'use client'

import { useRef, useState } from 'react';
import { createProductAction } from '@/actions/product';
// Menggunakan shadcn UI components (asumsi sudah diinstall)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProductForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await createProductAction(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      alert("Produk berhasil masuk katalog!");
      formRef.current?.reset();
    }
    setLoading(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-2xl font-bold">Tambah Skincare Baru</h2>
      
      {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      <div className="space-y-2">
        <label className="text-sm font-semibold">Nama Produk</label>
        <Input name="nama" placeholder="e.g. Glowing Serum Niacinamide" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Nomor BPOM</label>
        <Input name="bpom_no" placeholder="NA1823010xxxx" required />
        <p className="text-xs text-gray-500">Wajib 13 digit (NA/NC/NB/ND)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">SKU</label>
          <Input name="sku" placeholder="SKU-SERUM-01" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Harga Jual</label>
          <Input name="harga" type="number" placeholder="150000" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Foto Produk Utama</label>
        <Input name="image" type="file" accept="image/*" required />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Menyimpan & Upload..." : "Simpan Produk"}
      </Button>
    </form>
  );
}
