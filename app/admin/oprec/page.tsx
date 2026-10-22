/*
-----------------------------------------
nama file: [ page.tsx ] 
fungsi [ Halaman seleksi dan manajemen open recruitment (Oprec) admin Robotika UNS yang memuat template dasbor dengan kondisi aktif oprec. ]
-----------------------------------------------
*/

import { AdminDashboardTemplate } from "@/src/components/templates";

export default function AdminOprecPage() {
  return <AdminDashboardTemplate initialCondition="oprec" />;
}
