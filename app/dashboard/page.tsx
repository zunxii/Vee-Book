import CreateBrandForm from "@/components/CreateBrandForm";


export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Brand Dashboard</h1>
      <CreateBrandForm />
    </main>
  );
}
