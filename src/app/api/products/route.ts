import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { uploadProductImage } from '@/lib/supabase/storage';
import { v4 as uuidv4 } from 'uuid';

// GET all products
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const yearLaunched = formData.get('year_launched') as string;
    const primaryImage = formData.get('primary_image') as File | null;
    const secondaryImage = formData.get('secondary_image') as File | null;

    // Validate required fields
    if (!title || !yearLaunched || !primaryImage) {
      return NextResponse.json(
        { error: 'Title, year launched, and primary image are required' },
        { status: 400 }
      );
    }

    // Create temporary product ID for image uploads
    const productId = uuidv4();

    // Upload primary image
    const primaryImageUrl = await uploadProductImage(
      primaryImage,
      productId,
      'primary'
    );

    // Upload secondary image if provided
    let secondaryImageUrl: string | null = null;
    if (secondaryImage && secondaryImage.size > 0) {
      secondaryImageUrl = await uploadProductImage(
        secondaryImage,
        productId,
        'secondary'
      );
    }

    // Create product in database
    const { data: product, error: dbError } = await supabaseAdmin
      .from('products')
      .insert({
        id: productId,
        title,
        year_launched: parseInt(yearLaunched),
        primary_image_url: primaryImageUrl,
        secondary_image_url: secondaryImageUrl
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating product:', dbError);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
