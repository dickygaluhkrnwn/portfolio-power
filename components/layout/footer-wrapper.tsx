"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer"; // Mengambil komponen footer yang sudah lu buat

export function FooterWrapper() {
  const pathname = usePathname();

  // Pengecekan: Apakah URL saat ini berawalan '/admin' ?
  const isAdminPage = pathname?.startsWith("/admin");

  // Jika ini halaman admin, kembalikan null (Footer disembunyikan)
  if (isAdminPage) {
    return null;
  }

  // Jika bukan halaman admin (halaman public), tampilkan Footer
  return <Footer />;
}