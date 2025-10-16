import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router/routes';
import { AuthProvider } from '@/app/providers/AuthProvider';
import './index.css';

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
  