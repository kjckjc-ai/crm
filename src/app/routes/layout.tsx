import Navbar from '@/components/ui/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-6">
        <div className="container-custom">
          {children}
        </div>
      </div>
      <footer className="bg-white border-t py-4">
        <div className="container-custom text-center text-gray-500 text-sm">
          Personal CRM - For individual use only
        </div>
      </footer>
    </div>
  );
}
