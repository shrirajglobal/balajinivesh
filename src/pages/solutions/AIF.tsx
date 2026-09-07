import { Boxes } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const AIF = () => (
  <SolutionPageTemplate
    title="AIF"
    subtitle="Alternative Investment Fund — privately pooled vehicles for sophisticated, high-net-worth investors."
    description="This page is for educational purposes only. Balaji Nivesh Private Limited is an AMFI-registered Mutual Fund Distributor | ARN-173142 and does not provide investment advisory services."
    icon={<Boxes className="h-8 w-8" />}
    whatIsIt="An Alternative Investment Fund (AIF) is a privately pooled investment vehicle registered with SEBI under the SEBI (Alternative Investment Funds) Regulations, 2012. It collects money from sophisticated investors — Indian or foreign — and invests according to a defined strategy that usually falls outside conventional equity and debt. SEBI classifies AIFs into three categories: Category I (venture capital, SME, social impact and infrastructure funds that receive policy encouragement), Category II (private equity, private credit and real estate funds that use no significant leverage) and Category III (hedge-fund style strategies including long-short and derivatives-driven approaches). AIFs typically have a defined fund life, capital is drawn down over time, and units are illiquid until the fund exits its investments. Minimum investment is generally ₹1 crore per investor (₹25 lakh for directors, employees and fund managers of the AIF)."
    suitableFor={[
      "High-net-worth investors who can commit at least ₹1 crore",
      "Investors with an existing, well-diversified core portfolio",
      "Those comfortable locking capital for several years",
      "People seeking exposure to private markets or hedge-style strategies",
    ]}
    horizon="Long-term (5-10 years), often with a defined fund life"
    riskLevel="High"
    keyBenefits={[
      "Access to private equity, private credit and venture opportunities",
      "Strategies with low correlation to listed equity markets",
      "Managed by specialist, SEBI-registered fund managers",
      "Registered and supervised under SEBI AIF Regulations, 2012",
      "Category choice (I, II or III) to match a specific objective",
      "Potential portfolio diversification beyond listed markets",
    ]}
    faqs={[
      {
        question: "What are the three AIF categories?",
        answer:
          "Category I covers venture capital, angel, SME, social impact and infrastructure funds. Category II covers private equity, private credit and real estate funds that do not use significant leverage. Category III covers hedge-fund style strategies that may use leverage and derivatives, including long-short funds.",
      },
      {
        question: "What is the minimum investment in an AIF?",
        answer:
          "SEBI mandates a minimum commitment of ₹1 crore per investor (₹25 lakh for the fund's own directors, employees and managers). Accredited investors may have different terms as permitted by regulation.",
      },
      {
        question: "How are AIFs taxed in India?",
        answer:
          "Category I and II AIFs generally enjoy pass-through status, so income is taxed in the hands of the investor as if earned directly (business income is taxed at the fund level). Category III AIFs are generally taxed at the fund level. Taxation is complex and changes over time — please consult your tax professional.",
      },
      {
        question: "Can I exit an AIF before maturity?",
        answer:
          "Usually not easily. Close-ended AIFs have a fixed tenure and units are illiquid; secondary transfers are possible but limited and can be at a discount. Treat an AIF commitment as long-term, locked capital.",
      },
      {
        question: "What is Balaji Nivesh's role in an AIF investment?",
        answer:
          "We help you understand the structure, category, fee terms and risks, and support you through documentation with the AIF manager. Products are offered by duly registered AIF managers; we act as a distributor and do not provide investment advice or manage funds.",
      },
    ]}
  />
);

export default AIF;
