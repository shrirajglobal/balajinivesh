import { Landmark } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const Bonds = () => (
  <SolutionPageTemplate
    title="Bonds"
    subtitle="Fixed-income instruments that provide regular interest payments and return of principal at maturity."
    description="This content is for educational purposes only and does not constitute investment advice. Please consult with Balaji Nivesh for personalized guidance."
    icon={<Landmark className="h-8 w-8" />}
    whatIsIt="Bonds are fixed-income securities where an investor lends money to a borrower (typically a corporation or government) for a defined period at a fixed or variable interest rate. In India, bonds include Government Securities (G-Secs), corporate bonds, tax-free bonds, and sovereign gold bonds. They are considered relatively safer than equities and provide predictable income streams. Bonds can be an important part of a diversified investment portfolio, especially for investors seeking regular income."
    suitableFor={[
      "Conservative investors seeking steady income",
      "Retirees looking for regular interest payments",
      "Investors wanting to diversify beyond equity",
      "Those with medium to long-term investment goals",
    ]}
    horizon="1 to 10+ years depending on bond type"
    riskLevel="Low to Moderate"
    keyBenefits={[
      "Regular and predictable interest income",
      "Generally lower risk compared to equities",
      "Government bonds backed by sovereign guarantee",
      "Tax-free bonds available for tax-efficient income",
      "Portfolio diversification benefit",
      "Capital preservation for conservative investors",
      "Sovereign Gold Bonds offer exposure to gold with interest",
      "Various tenure options to match financial goals",
    ]}
    faqs={[
      {
        question: "What types of bonds are available in India?",
        answer:
          "India offers various types of bonds including Government Securities (G-Secs), State Development Loans (SDLs), Corporate Bonds, Tax-Free Bonds, RBI Floating Rate Savings Bonds, and Sovereign Gold Bonds (SGBs). Each has different risk profiles, returns, and tax implications.",
      },
      {
        question: "Are bonds risk-free?",
        answer:
          "While government bonds are considered very safe as they carry sovereign guarantee, corporate bonds carry credit risk depending on the issuer's financial health. Interest rate changes can also affect bond prices. It's important to consider the credit rating and issuer quality before investing.",
      },
      {
        question: "How are bond returns taxed?",
        answer:
          "Interest from most bonds is taxable as per your income tax slab. However, tax-free bonds (issued by government-backed entities) offer interest that is exempt from income tax. Capital gains on bonds are taxed based on holding period. Consult a tax professional for specific guidance.",
      },
      {
        question: "What is the minimum investment in bonds?",
        answer:
          "The minimum investment varies by bond type. RBI Floating Rate Bonds start from ₹1,000. Sovereign Gold Bonds have a minimum of 1 gram of gold. Corporate bonds typically start from ₹10,000. Government securities can be purchased through RBI Retail Direct with low minimums.",
      },
    ]}
  />
);

export default Bonds;
