import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Investment Solutions */}
            <Route path="/solutions/mutual-funds" element={<Placeholder />} />
            <Route path="/solutions/bonds" element={<Placeholder />} />
            <Route path="/solutions/insurance" element={<Placeholder />} />
            <Route path="/solutions/ipo" element={<Placeholder />} />
            <Route path="/solutions/fixed-deposits" element={<Placeholder />} />
            {/* Tools */}
            <Route path="/calculators" element={<Placeholder />} />
            {/* Education & Insights */}
            <Route path="/education" element={<Placeholder />} />
            <Route path="/insights" element={<Placeholder />} />
            {/* Static Pages */}
            <Route path="/about" element={<Placeholder />} />
            <Route path="/contact" element={<Placeholder />} />
            <Route path="/resources" element={<Placeholder />} />
            <Route path="/privacy" element={<Placeholder />} />
            <Route path="/terms" element={<Placeholder />} />
            <Route path="/disclaimer" element={<Placeholder />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
