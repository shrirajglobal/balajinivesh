import { lazy, Suspense, ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageSkeleton from "@/components/ui/page-skeleton";

// Critical path - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth-critical: must be eager
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";

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
const SIPGoalVisualizer = lazy(() => import("./pages/tools/SIPGoalVisualizer"));

const Education = lazy(() => import("./pages/Education"));
const HomemakersEducation = lazy(() => import("./pages/education/HomemakersEducation"));
const KidsEducation = lazy(() => import("./pages/education/KidsEducation"));

const Auth = lazy(() => import("./pages/Auth"));
// MarketInsights merged into /market-updates (Phase 6 CRO)
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

// Admin pages
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
const AdminAcademyImport = lazy(() => import("./pages/admin/AdminAcademyImport"));
const AdminAcademyGenerate = lazy(() => import("./pages/admin/AdminAcademyGenerate"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminCRM = lazy(() => import("./pages/admin/AdminCRM"));

// Public blog
const BlogIndex = lazy(() => import("./pages/blog/BlogIndex"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));

// Subscribe
const Subscribe = lazy(() => import("./pages/subscribe/Subscribe"));
const ConfirmSubscription = lazy(() => import("./pages/subscribe/ConfirmSubscription"));
const Unsubscribe = lazy(() => import("./pages/subscribe/Unsubscribe"));

// Phase 6: Engagement & Community
const Locator = lazy(() => import("./pages/Locator"));
const Videos = lazy(() => import("./pages/Videos"));
const ForumIndex = lazy(() => import("./pages/forum/ForumIndex"));
const ForumThread = lazy(() => import("./pages/forum/ForumThread"));
const AdminEmbeddings = lazy(() => import("./pages/admin/AdminEmbeddings"));
const AdminVideos = lazy(() => import("./pages/admin/AdminVideos"));
const AdminForum = lazy(() => import("./pages/admin/AdminForum"));
const AdminLocator = lazy(() => import("./pages/admin/AdminLocator"));

// Reusable wrapper that provides per-route Suspense for lazy components
const LazyRoute = ({ component: Comp, ...props }: { component: ComponentType<any>; [k: string]: any }) => (
  <Suspense fallback={<PageSkeleton />}>
    <Comp {...props} />
  </Suspense>
);

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner position="top-center" />
            <BrowserRouter>
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
                  <Route index element={<LazyRoute component={AdminDashboard} />} />
                  <Route path="partners" element={<LazyRoute component={AdminPartners} />} />
                  <Route path="partners/active" element={<LazyRoute component={AdminActivePartners} />} />
                  <Route path="rta-upload" element={<LazyRoute component={AdminRTAUpload} />} />
                  <Route path="clients" element={<LazyRoute component={AdminClients} />} />
                  <Route path="commissions" element={<LazyRoute component={AdminCommissions} />} />
                  <Route path="aum" element={<LazyRoute component={AdminAUM} />} />
                  <Route path="users" element={<LazyRoute component={AdminUsers} />} />
                  <Route path="gifts" element={<LazyRoute component={AdminGifts} />} />
                  <Route path="certificates" element={<LazyRoute component={AdminCertificates} />} />
                  <Route path="leads" element={<LazyRoute component={AdminLeads} />} />
                  <Route path="integrations" element={<LazyRoute component={AdminIntegrations} />} />
                  <Route path="site-settings" element={<LazyRoute component={AdminSiteSettings} />} />
                  <Route path="blog" element={<LazyRoute component={AdminBlog} />} />
                  <Route path="market-updates" element={<LazyRoute component={AdminMarketUpdates} />} />
                  <Route path="academy" element={<LazyRoute component={AdminAcademy} />} />
                  <Route path="academy/import" element={<LazyRoute component={AdminAcademyImport} />} />
                  <Route path="academy/generate" element={<LazyRoute component={AdminAcademyGenerate} />} />
                  <Route path="newsletter" element={<LazyRoute component={AdminNewsletter} />} />
                  <Route path="crm" element={<LazyRoute component={AdminCRM} />} />
                  <Route path="embeddings" element={<LazyRoute component={AdminEmbeddings} />} />
                  <Route path="videos" element={<LazyRoute component={AdminVideos} />} />
                  <Route path="forum" element={<LazyRoute component={AdminForum} />} />
                  <Route path="locator" element={<LazyRoute component={AdminLocator} />} />
                  <Route path="settings" element={<LazyRoute component={AdminSettings} />} />
                </Route>

                {/* Main site routes — flat layout route, no nested Routes */}
                <Route element={<LayoutWrapper />}>
                  <Route path="/" element={<Index />} />
                  {/* Investment Solutions */}
                  <Route path="/solutions/mutual-funds" element={<LazyRoute component={MutualFunds} />} />
                  <Route path="/solutions/bonds" element={<LazyRoute component={Bonds} />} />
                  <Route path="/solutions/insurance" element={<LazyRoute component={Insurance} />} />
                  <Route path="/solutions/ipo" element={<LazyRoute component={IPO} />} />
                  <Route path="/solutions/fixed-deposits" element={<LazyRoute component={FixedDeposits} />} />
                  {/* Calculators */}
                  <Route path="/calculators" element={<LazyRoute component={Calculators} />} />
                  <Route path="/calculators/sip" element={<LazyRoute component={SIPCalculator} />} />
                  <Route path="/calculators/lumpsum" element={<LazyRoute component={LumpsumCalculator} />} />
                  <Route path="/calculators/step-up-sip" element={<LazyRoute component={StepUpSIPCalculator} />} />
                  <Route path="/calculators/retirement" element={<LazyRoute component={RetirementPlanner} />} />
                  <Route path="/calculators/sip-vs-fd" element={<LazyRoute component={SIPvsFD} />} />
                  <Route path="/calculators/emergency-fund" element={<LazyRoute component={EmergencyFundCalculator} />} />
                  {/* Assessment Tools */}
                  <Route path="/tools/health-check" element={<LazyRoute component={FinancialHealthCheck} />} />
                  <Route path="/tools/risk-profile" element={<LazyRoute component={RiskProfiler} />} />
                  <Route path="/tools/sip-goal" element={<LazyRoute component={SIPGoalVisualizer} />} />
                  {/* Education & Insights */}
                  <Route path="/education" element={<LazyRoute component={Education} />} />
                  <Route path="/education/homemakers" element={<LazyRoute component={HomemakersEducation} />} />
                  <Route path="/education/kids" element={<LazyRoute component={KidsEducation} />} />
                  <Route path="/insights" element={<Navigate to="/market-updates" replace />} />
                  <Route path="/market-updates" element={<LazyRoute component={MarketUpdates} />} />
                  <Route path="/market-updates/:date" element={<LazyRoute component={MarketUpdates} />} />
                  {/* Blog */}
                  <Route path="/blog" element={<LazyRoute component={BlogIndex} audience="all" />} />
                  <Route path="/blog/investor" element={<LazyRoute component={BlogIndex} audience="investor" />} />
                  <Route path="/blog/partner" element={<LazyRoute component={BlogIndex} audience="partner" />} />
                  <Route path="/blog/:slug" element={<LazyRoute component={BlogPost} />} />
                  {/* Partner */}
                  <Route path="/partner" element={<LazyRoute component={Partner} />} />
                  <Route path="/partner/dashboard" element={<LazyRoute component={PartnerDashboard} />} />
                  <Route path="/partner/commissions" element={<LazyRoute component={PartnerCommissions} />} />
                  <Route path="/partner/clients" element={<LazyRoute component={PartnerClients} />} />
                  <Route path="/partner/leads" element={<LazyRoute component={PartnerLeads} />} />
                  <Route path="/partner/academy" element={<LazyRoute component={PartnerAcademy} />} />
                  <Route path="/partner/academy/:moduleSlug" element={<LazyRoute component={PartnerAcademyModule} />} />
                  <Route path="/partner/academy/:moduleSlug/quiz" element={<LazyRoute component={PartnerAcademyQuiz} />} />
                  <Route path="/partner/academy/:moduleSlug/:chapterSlug" element={<LazyRoute component={PartnerAcademyChapter} />} />
                  <Route path="/partner/toolkit" element={<LazyRoute component={PartnerToolkit} />} />
                  {/* Engagement & Community (Phase 6) */}
                  <Route path="/locator" element={<LazyRoute component={Locator} />} />
                  <Route path="/videos" element={<LazyRoute component={Videos} />} />
                  <Route path="/forum" element={<LazyRoute component={ForumIndex} />} />
                  <Route path="/forum/:slug" element={<LazyRoute component={ForumThread} />} />
                  {/* Subscribe */}
                  <Route path="/subscribe" element={<LazyRoute component={Subscribe} />} />
                  <Route path="/subscribe/confirm" element={<LazyRoute component={ConfirmSubscription} />} />
                  <Route path="/subscribe/unsubscribe" element={<LazyRoute component={Unsubscribe} />} />
                  {/* Auth */}
                  <Route path="/auth" element={<LazyRoute component={Auth} />} />
                  {/* Static Pages */}
                  <Route path="/about" element={<LazyRoute component={About} />} />
                  <Route path="/contact" element={<LazyRoute component={Contact} />} />
                  <Route path="/resources" element={<LazyRoute component={Resources} />} />
                  <Route path="/privacy" element={<LazyRoute component={PrivacyPolicy} />} />
                  <Route path="/terms" element={<LazyRoute component={TermsOfUse} />} />
                  <Route path="/disclaimer" element={<LazyRoute component={Disclaimer} />} />
                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
