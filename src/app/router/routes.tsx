import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/app/layout/RootLayout';
import { AdminLayout } from '@/app/layout/AdminLayout';
import { TallerLayout } from '@/app/layout/TallerLayout';
import { ProtectedRoute, RoleRoute } from '@/app/router/guards';

// Catálogo / público
import HomePage from '@/features/catalog/pages/HomePage';
import ProductDetailPage from '@/features/catalog/pages/ProductDetailPage';
import ServiceDetailPage from '@/features/catalog/pages/ServiceDetailPage';

// Auth
import LoginPage from '@/features/auth/pages/LoginPage';

// User
import UserProfilePage from '@/features/user/pages/ProfilePage';

// Cart
import CartPage from '@/features/cart/pages/CartPage';
import CheckoutPage from '@/features/cart/pages/CheckoutPage';

// Taller
import WorkshopDashboard from '@/features/workshop/pages/DashboardPage';
import InventoryPage from '@/features/workshop/pages/InventoryPage';
import ServicesPage from '@/features/workshop/pages/ServicesPage';
import ExchangePage from '@/features/workshop/pages/ExchangePage';
import WorkshopProfile from '@/features/workshop/pages/ProfilePage';
import WorkshopChat from '@/features/workshop/pages/ChatPage';

// Admin
import AdminDashboard from '@/features/admin/pages/DashboardPage';
import UsersPage from '@/features/admin/pages/UsersPage';
import OrdersPage from '@/features/admin/pages/OrdersPage';
import RegisterProductPage from '@/features/admin/pages/RegisterProductPage';
import RegisterServicePage from '@/features/admin/pages/RegisterServicePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'productos/:id', element: <ProductDetailPage /> },
            { path: 'servicios/:id', element: <ServiceDetailPage /> },
            { path: 'carrito', element: (
                <ProtectedRoute><CartPage /></ProtectedRoute>
            ) },
            { path: 'checkout', element: (
                <ProtectedRoute roles={['usuario']}>
                    <CheckoutPage />
                </ProtectedRoute>
            ) },
            { path: 'perfil', element: (
                <RoleRoute roles={['usuario']}>
                <UserProfilePage />
                </RoleRoute>
            ) },
        ],
    },
    {
        path: '/taller',
        element: (
            <RoleRoute roles={['taller']}>
            <TallerLayout />
            </RoleRoute>
        ),
        children: [
            { index: true, element: <WorkshopDashboard /> },
            { path: 'inventario', element: <InventoryPage /> },
            { path: 'servicios', element: <ServicesPage /> },
            { path: 'intercambio', element: <ExchangePage /> },
            { path: 'perfil', element: <WorkshopProfile /> },
            { path: 'chat', element: <WorkshopChat /> },
        ],
    },
    {
        path: '/admin',
        element: (
            <RoleRoute roles={['admin']}>
            <AdminLayout />
            </RoleRoute>
        ),
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'usuarios', element: <UsersPage /> },
            { path: 'ordenes', element: <OrdersPage /> },
            { path: 'registro-productos', element: <RegisterProductPage /> },
            { path: 'registro-servicios', element: <RegisterServicePage /> },
        ],
    },
]);