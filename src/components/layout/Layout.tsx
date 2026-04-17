import { memo, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "@/components/chatbot/ChatWidget";

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
