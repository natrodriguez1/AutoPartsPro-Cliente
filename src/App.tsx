// App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router/routes";
import { AuthProvider } from "@/app/providers/AuthContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
