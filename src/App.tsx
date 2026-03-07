import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import MutualFunds from "./pages/solutions/MutualFunds";
import Bonds from "./pages/solutions/Bonds";
import Insurance from "./pages/solutions/Insurance";
import IPO from "./pages/solutions/IPO";
import FixedDeposits from "./pages/solutions/FixedDeposits";
import Calculators from "./pages/Calculators";
import SIPCalculator from "./pages/calculators/SIPCalculator";
import LumpsumCalculator from "./pages/calculators/LumpsumCalculator";
import StepUpSIPCalculator from "./pages/calculators/StepUpSIPCalculator";
import RetirementPlanner from "./pages/calculators/RetirementPlanner";
import SIPvsFD from "./pages/calculators/SIPvsFD";
import EmergencyFundCalculator from "./pages/calculators/EmergencyFundCalculator";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
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
            <Route path="/solutions/mutual-funds" element={<MutualFunds />} />
            <Route path="/solutions/bonds" element={<Bonds />} />
            <Route path="/solutions/insurance" element={<Insurance />} />
            <Route path="/solutions/ipo" element={<IPO />} />
            <Route path="/solutions/fixed-deposits" element={<FixedDeposits />} />
            {/* Calculators */}
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/calculators/sip" element={<SIPCalculator />} />
            <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
            <Route path="/calculators/step-up-sip" element={<StepUpSIPCalculator />} />
            <Route path="/calculators/retirement" element={<RetirementPlanner />} />
            <Route path="/calculators/sip-vs-fd" element={<SIPvsFD />} />
            <Route path="/calculators/emergency-fund" element={<EmergencyFundCalculator />} />
            {/* Education & Insights */}
            <Route path="/education" element={<Placeholder />} />
            <Route path="/insights" element={<Placeholder />} />
            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
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
