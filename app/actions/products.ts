'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProductAction(formData: FormData) {
  const supabase = createClient();
  
  // 1. Cek Autorisasi Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin' && profile?.role !== 'owner') {
    throw new Error("Akses ditolak. Khusus Admin.");
  }

  // 2. Ambil Data Form
  const nama = formData.get('nama') as string;
  const bpom_no = formData.get('bpom_no') as string;
  const harga = Number(formData.get('harga'));
  const sku = formData.get('sku') as string;
  const imageFile = formData.get('image') as File;
  
  // 3. Server-side Validation untuk BPOM Drugstore Indo
  const bpomRegex = /^(NA|NC|NB|ND)\d{11}$/;
  if (!bpomRegex.test(bpom_no)) {
    return { error: "Nomor BPOM tidak valid! Harus 13 digit diawali NA/NC/NB/ND." };
  }

  let imageUrl = '';

  // 4. Upload Foto ke Supabase Storage (Jika ada)
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${sku}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('products')
      .upload(fileName, imageFile);

    if (uploadError) return { error: `Gagal upload gambar: ${uploadError.message}` };
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
    imageUrl = publicUrlData.publicUrl;
  }

  // 5. Insert ke Tabel Products & Variants menggunakan Supabase RPC (Transaction) atau 2 step insert
  const slug = nama.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const { data: newProduct, error: productError } = await supabase
    .from('products')
    .insert({
      nama,
      slug,
      bpom_no,
      // Field lain seperti deskripsi, dll
    })
    .select()
    .single();

  if (productError) return { error: `Gagal simpan produk: ${productError.message}` };

  const { error: variantError } = await supabase
    .from('product_variants')
    .insert({
      product_id: newProduct.id,
      nama_varian: 'Default',
      sku,
      harga,
      harga_member: harga * 0.9, // Contoh: Diskon member 10%
      harga_modal: harga * 0.6,
      foto_urls: imageUrl ? [imageUrl] : [],
    });

  if (variantError) return { error: `Gagal simpan varian: ${variantError.message}` };

  // 6. Refresh Cache halaman Admin & Katalog
  revalidatePath('/admin/products');
  revalidatePath('/');
  
  return { success: true, message: "Produk berhasil ditambahkan!" };
}
