import { TrendingUp } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const MutualFunds = () => (
  <SolutionPageTemplate
    title="Mutual Funds"
    subtitle="A professionally managed investment vehicle that pools money from multiple investors to invest in diversified securities."
    description="This page is for educational purposes only. Balaji Nivesh is an AMFI registered mutual fund distributor and does not provide investment advisory services."
    icon={<TrendingUp className="h-8 w-8" />}
    whatIsIt="A mutual fund is a type of financial vehicle made up of a pool of money collected from many investors to invest in securities like stocks, bonds, money market instruments, and other assets. Mutual funds are operated by professional fund managers, who allocate the fund's assets and attempt to produce capital gains or income for the fund's investors. A mutual fund's portfolio is structured and maintained to match the investment objectives stated in its prospectus. In India, mutual funds are regulated by SEBI (Securities and Exchange Board of India) through AMFI (Association of Mutual Funds in India)."
    suitableFor={[
      "First-time investors starting SIPs",
      "Salaried professionals seeking wealth creation",
      "Investors looking for diversification",
      "Those seeking professional fund management",
    ]}
    horizon="Short-term (1-3 years) to Long-term (5+ years) depending on fund type"
    riskLevel="Moderate"
    keyBenefits={[
      "Professional fund management by experienced managers",
      "Diversification across multiple securities",
      "Start with as low as ₹500 per month via SIP",
      "High liquidity — redeem anytime for open-ended funds",
      "Tax benefits under Section 80C with ELSS funds",
      "Regulated by SEBI for investor protection",
      "Variety of fund categories for different goals",
      "Transparent NAV-based pricing",
    ]}
    faqs={[
      {
        question: "What is a SIP and how does it work?",
        answer:
          "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly (monthly/weekly) in a mutual fund scheme. It helps in rupee cost averaging and builds discipline in investing. You can start a SIP with as little as ₹500 per month.",
      },
      {
        question: "What are the different types of mutual funds?",
        answer:
          "Mutual funds can be broadly categorized into Equity Funds (invest in stocks), Debt Funds (invest in bonds/fixed income), Hybrid Funds (mix of equity and debt), and Solution-Oriented Funds (like retirement or children's funds). Each category has further sub-categories based on investment strategy.",
      },
      {
        question: "Are mutual funds safe?",
        answer:
          "Mutual funds are regulated by SEBI and managed by professional fund managers. However, all mutual fund investments are subject to market risks. The level of risk varies — debt funds are generally less risky than equity funds. It's important to choose funds aligned with your risk tolerance and investment horizon.",
      },
      {
        question: "How are mutual fund returns taxed in India?",
        answer:
          "Taxation depends on the type of fund and holding period. Equity funds held for over 1 year attract Long Term Capital Gains (LTCG) tax at 10% on gains above ₹1 lakh. Debt funds are taxed as per your income tax slab. Tax rules may change, so consult a tax professional for current rates.",
      },
      {
        question: "What is the minimum investment amount?",
        answer:
          "Most mutual funds allow lumpsum investments starting from ₹1,000 to ₹5,000. For SIPs, you can start with as low as ₹500 per month. Some fund houses also offer micro-SIPs starting from ₹100.",
      },
    ]}
  />
);

export default MutualFunds;
