import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { uploadProductImage, deleteProductImage, deleteProductImages } from '@/lib/supabase/storage';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing product
    const { data: existingProduct, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const yearLaunched = formData.get('year_launched') as string;
    const primaryImage = formData.get('primary_image') as File | null;
    const secondaryImage = formData.get('secondary_image') as File | null;
    const removeSecondary = formData.get('remove_secondary') === 'true';

    // Prepare updates object
    const updates: any = {};

    if (title) updates.title = title;
    if (yearLaunched) updates.year_launched = parseInt(yearLaunched);

    // Handle primary image update
    if (primaryImage && primaryImage.size > 0) {
      // Delete old primary image
      if (existingProduct.primary_image_url) {
        await deleteProductImage(existingProduct.primary_image_url);
      }

      // Upload new primary image
      const primaryImageUrl = await uploadProductImage(
        primaryImage,
        id,
        'primary'
      );
      updates.primary_image_url = primaryImageUrl;
    }

    // Handle secondary image update
    if (removeSecondary) {
      // Remove secondary image
      if (existingProduct.secondary_image_url) {
        await deleteProductImage(existingProduct.secondary_image_url);
      }
      updates.secondary_image_url = null;
    } else if (secondaryImage && secondaryImage.size > 0) {
      // Delete old secondary image if exists
      if (existingProduct.secondary_image_url) {
        await deleteProductImage(existingProduct.secondary_image_url);
      }

      // Upload new secondary image
      const secondaryImageUrl = await uploadProductImage(
        secondaryImage,
        id,
        'secondary'
      );
      updates.secondary_image_url = secondaryImageUrl;
    }

    // Update product in database
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error in PATCH /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get product to retrieve image URLs
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product from database
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Delete all images for this product
    await deleteProductImages(id);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
