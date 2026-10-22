/*
-----------------------------------------
nama file: [ page.tsx ] 
fungsi [ Halaman utama dasbor admin Robotika UNS yang memuat template dasbor dengan kondisi aktif dasbor. ]
-----------------------------------------------
*/

import { AdminDashboardTemplate } from "@/src/components/templates";

export default function AdminPage() {
  return <AdminDashboardTemplate initialCondition="dashboard" />;
}
