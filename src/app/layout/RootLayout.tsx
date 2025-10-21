import { Outlet } from "react-router-dom";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { Chatbot } from "@/features/chatbot/components/Chatbot";
import { ChatbotTaller } from "@/features/chatbot/components/ChatbotTaller";
import { useAuth } from "@/app/providers/AuthContext";

export default function RootLayout() {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      {usuario?.tipo === "usuario" && <Chatbot />}
      {usuario?.tipo === "taller" && <ChatbotTaller />}
    </div>
  );
}
