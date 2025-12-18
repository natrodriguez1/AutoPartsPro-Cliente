import { Outlet } from 'react-router-dom';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { Toaster } from '@/shared/ui/sonner';

export default function AdminLayout() {
    return (
        <div className="min-h-dvh flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">
                <Outlet />
            </main>
            <Footer />
            <Toaster />
        </div>
    );
}