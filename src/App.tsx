import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import PageSkeleton from "@/components/ui/page-skeleton";

// Critical path - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical routes
const MutualFunds = lazy(() => import("./pages/solutions/MutualFunds"));
const Bonds = lazy(() => import("./pages/solutions/Bonds"));
const Insurance = lazy(() => import("./pages/solutions/Insurance"));
const IPO = lazy(() => import("./pages/solutions/IPO"));
const FixedDeposits = lazy(() => import("./pages/solutions/FixedDeposits"));

const Calculators = lazy(() => import("./pages/Calculators"));
const SIPCalculator = lazy(() => import("./pages/calculators/SIPCalculator"));
const LumpsumCalculator = lazy(() => import("./pages/calculators/LumpsumCalculator"));
const StepUpSIPCalculator = lazy(() => import("./pages/calculators/StepUpSIPCalculator"));
const RetirementPlanner = lazy(() => import("./pages/calculators/RetirementPlanner"));
const SIPvsFD = lazy(() => import("./pages/calculators/SIPvsFD"));
const EmergencyFundCalculator = lazy(() => import("./pages/calculators/EmergencyFundCalculator"));

const FinancialHealthCheck = lazy(() => import("./pages/tools/FinancialHealthCheck"));
const RiskProfiler = lazy(() => import("./pages/tools/RiskProfiler"));

const Education = lazy(() => import("./pages/Education"));
const HomemakersEducation = lazy(() => import("./pages/education/HomemakersEducation"));
const KidsEducation = lazy(() => import("./pages/education/KidsEducation"));

const Auth = lazy(() => import("./pages/Auth"));
const MarketInsights = lazy(() => import("./pages/MarketInsights"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Resources = lazy(() => import("./pages/Resources"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

const Partner = lazy(() => import("./pages/Partner"));
const PartnerDashboard = lazy(() => import("./pages/partner/Dashboard"));
const PartnerCommissions = lazy(() => import("./pages/partner/Commissions"));
const PartnerClients = lazy(() => import("./pages/partner/Clients"));
const PartnerLeads = lazy(() => import("./pages/partner/Leads"));
const PartnerAcademy = lazy(() => import("./pages/partner/Academy"));
const PartnerToolkit = lazy(() => import("./pages/partner/Toolkit"));

const AdminPartners = lazy(() => import("./pages/admin/Partners"));
const AdminRTAUpload = lazy(() => import("./pages/admin/RTAUpload"));

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={300}>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Layout>
              <Suspense fallback={<PageSkeleton />}>
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
                  {/* Assessment Tools */}
                  <Route path="/tools/health-check" element={<FinancialHealthCheck />} />
                  <Route path="/tools/risk-profile" element={<RiskProfiler />} />
                  {/* Education & Insights */}
                  <Route path="/education" element={<Education />} />
                  <Route path="/education/homemakers" element={<HomemakersEducation />} />
                  <Route path="/education/kids" element={<KidsEducation />} />
                  <Route path="/insights" element={<MarketInsights />} />
                  {/* Partner */}
                  <Route path="/partner" element={<Partner />} />
                  <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                  <Route path="/partner/commissions" element={<PartnerCommissions />} />
                  <Route path="/partner/clients" element={<PartnerClients />} />
                  <Route path="/partner/leads" element={<PartnerLeads />} />
                  <Route path="/partner/academy" element={<PartnerAcademy />} />
                  <Route path="/partner/toolkit" element={<PartnerToolkit />} />
                  {/* Admin */}
                  <Route path="/admin/partners" element={<AdminPartners />} />
                  <Route path="/admin/rta-upload" element={<AdminRTAUpload />} />
                  {/* Auth */}
                  <Route path="/auth" element={<Auth />} />
                  {/* Static Pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfUse />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
