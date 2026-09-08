import { memo, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StickyCTA from "./StickyCTA";
import ChatWidget from "@/components/chatbot/ChatWidget";
import MobileStickyBar from "./MobileStickyBar";
import DwellNudge from "./DwellNudge";
import AppBanner from "@/components/app/AppBanner";
import RouteSEO from "@/components/seo/RouteSEO";

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <RouteSEO />
      <Header />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <StickyCTA />
      <ChatWidget />
      <MobileStickyBar />
      <AppBanner />
      <DwellNudge />
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
