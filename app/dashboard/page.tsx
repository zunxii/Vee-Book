import BrandList from "@/components/Brandlist";
import CreateBrandForm from "@/components/CreateBrandForm";
import Link from "next/link";


export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-4">Brand Dashboard</h1>
      <CreateBrandForm />
      <BrandList/>
    </main>
  );
}
