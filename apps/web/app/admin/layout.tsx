import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdminGuard } from '@/components/admin/admin-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex flex-1 flex-col'>
          <Header />
          <main className='flex-1 p-6'>{children}</main>
          <Footer />
        </div>
      </div>
    </AdminGuard>
  );
}
