import { supabaseAdmin } from './server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @param productId - The product ID for organizing files
 * @param imageType - 'primary' or 'secondary'
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  imageType: 'primary' | 'secondary'
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${imageType}-${uuidv4()}.${fileExt}`;

  const { data, error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload ${imageType} image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteProductImage(url: string): Promise<void> {
  try {
    // Extract path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/path
    const urlParts = url.split('/product-images/');
    if (urlParts.length < 2) {
      console.warn('Invalid image URL format:', url);
      return;
    }

    const path = urlParts[1];

    const { error } = await supabaseAdmin.storage
      .from('product-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    // Don't throw - allow product deletion to continue even if image deletion fails
  }
}

/**
 * Delete all images for a product (entire folder)
 * @param productId - The product ID whose folder to delete
 */
export async function deleteProductImages(productId: string): Promise<void> {
  try {
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('product-images')
      .list(productId);

    if (listError) {
      console.error('Error listing images:', listError);
      return;
    }

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${productId}/${file.name}`);

      const { error: deleteError } = await supabaseAdmin.storage
        .from('product-images')
        .remove(filePaths);

      if (deleteError) {
        console.error('Error deleting images:', deleteError);
      }
    }
  } catch (error) {
    console.error('Error in deleteProductImages:', error);
  }
}
