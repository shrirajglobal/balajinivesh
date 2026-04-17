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
const MarketUpdates = lazy(() => import("./pages/MarketUpdates"));
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
const PartnerAcademyModule = lazy(() => import("./pages/partner/AcademyModule"));
const PartnerAcademyChapter = lazy(() => import("./pages/partner/AcademyChapter"));
const PartnerAcademyQuiz = lazy(() => import("./pages/partner/AcademyQuiz"));
const PartnerToolkit = lazy(() => import("./pages/partner/Toolkit"));

// Admin
const AdminGuard = lazy(() => import("./components/admin/AdminGuard"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPartners = lazy(() => import("./pages/admin/Partners"));
const AdminActivePartners = lazy(() => import("./pages/admin/AdminActivePartners"));
const AdminRTAUpload = lazy(() => import("./pages/admin/RTAUpload"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminCommissions = lazy(() => import("./pages/admin/AdminCommissions"));
const AdminAUM = lazy(() => import("./pages/admin/AdminAUM"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminGifts = lazy(() => import("./pages/admin/AdminGifts"));
const AdminCertificates = lazy(() => import("./pages/admin/AdminCertificates"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminIntegrations = lazy(() => import("./pages/admin/AdminIntegrations"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminMarketUpdates = lazy(() => import("./pages/admin/AdminMarketUpdates"));
const AdminAcademy = lazy(() => import("./pages/admin/AdminAcademy"));

// Public blog
const BlogIndex = lazy(() => import("./pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));

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
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                {/* Admin routes — no main Layout wrapper */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="partners/active" element={<AdminActivePartners />} />
                  <Route path="rta-upload" element={<AdminRTAUpload />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="commissions" element={<AdminCommissions />} />
                  <Route path="aum" element={<AdminAUM />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="gifts" element={<AdminGifts />} />
                  <Route path="certificates" element={<AdminCertificates />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="integrations" element={<AdminIntegrations />} />
                  <Route path="site-settings" element={<AdminSiteSettings />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="market-updates" element={<AdminMarketUpdates />} />
                  <Route path="academy" element={<AdminAcademy />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Main site routes */}
                <Route
                  path="*"
                  element={
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
                        {/* Assessment Tools */}
                        <Route path="/tools/health-check" element={<FinancialHealthCheck />} />
                        <Route path="/tools/risk-profile" element={<RiskProfiler />} />
                        {/* Education & Insights */}
                        <Route path="/education" element={<Education />} />
                        <Route path="/education/homemakers" element={<HomemakersEducation />} />
                        <Route path="/education/kids" element={<KidsEducation />} />
                        <Route path="/insights" element={<MarketInsights />} />
                        <Route path="/market-updates" element={<MarketUpdates />} />
                        <Route path="/market-updates/:date" element={<MarketUpdates />} />
                        {/* Blog */}
                        <Route path="/blog" element={<BlogIndex audience="all" />} />
                        <Route path="/blog/investor" element={<BlogIndex audience="investor" />} />
                        <Route path="/blog/partner" element={<BlogIndex audience="partner" />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        {/* Partner */}
                        <Route path="/partner" element={<Partner />} />
                        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                        <Route path="/partner/commissions" element={<PartnerCommissions />} />
                        <Route path="/partner/clients" element={<PartnerClients />} />
                        <Route path="/partner/leads" element={<PartnerLeads />} />
                        <Route path="/partner/academy" element={<PartnerAcademy />} />
                        <Route path="/partner/toolkit" element={<PartnerToolkit />} />
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
                    </Layout>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
