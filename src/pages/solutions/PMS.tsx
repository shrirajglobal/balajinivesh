import { Briefcase } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const PMS = () => (
  <SolutionPageTemplate
    title="PMS"
    subtitle="Portfolio Management Services — an individually managed portfolio of securities held in your own name."
    description="This page is for educational purposes only. Balaji Nivesh Private Limited is an AMFI-registered Mutual Fund Distributor | ARN-173142 and does not provide investment advisory services."
    icon={<Briefcase className="h-8 w-8" />}
    whatIsIt="Portfolio Management Services (PMS) is a professional investment service in which a SEBI-registered portfolio manager builds and manages a portfolio of stocks, bonds and other securities for a single investor. Unlike a mutual fund, where you own units of a pooled scheme, in PMS the securities are held in your own demat account in your own name, giving you direct ownership and full visibility of every holding and transaction. PMS is offered in two broad forms: discretionary, where the portfolio manager takes buy and sell decisions on your behalf under a signed agreement, and non-discretionary, where the manager recommends and you approve each decision. SEBI prescribes a minimum investment of ₹50 lakh. Fees are typically a fixed management fee, a performance/profit-sharing fee above a hurdle rate, or a combination, and are disclosed in the disclosure document and the PMS agreement."
    suitableFor={[
      "Investors able to commit at least ₹50 lakh",
      "Those who want direct ownership of individual securities",
      "Investors seeking a concentrated, high-conviction strategy",
      "People who value detailed, holding-level transparency",
    ]}
    horizon="Long-term (5+ years)"
    riskLevel="High"
    keyBenefits={[
      "Securities held directly in your own demat account",
      "Portfolio tailored to a chosen strategy and mandate",
      "Complete transparency of every holding and transaction",
      "Managed by SEBI-registered portfolio managers",
      "Discretionary or non-discretionary options available",
      "Detailed periodic performance and audited reporting",
    ]}
    faqs={[
      {
        question: "How is PMS different from a mutual fund?",
        answer:
          "In a mutual fund you own units of a pooled scheme along with thousands of other investors. In PMS the securities are bought in your own name and held in your demat account, portfolios are typically more concentrated, the minimum investment is ₹50 lakh, and fee structures often include a performance component.",
      },
      {
        question: "What is the minimum investment in PMS?",
        answer:
          "SEBI mandates a minimum of ₹50 lakh per investor for Portfolio Management Services. Individual portfolio managers may set a higher threshold for specific strategies.",
      },
      {
        question: "What is the difference between discretionary and non-discretionary PMS?",
        answer:
          "In discretionary PMS the portfolio manager takes investment decisions independently within the agreed mandate. In non-discretionary PMS the manager recommends ideas and you approve each transaction before it is executed.",
      },
      {
        question: "How is PMS taxed?",
        answer:
          "Because securities are held directly in your name, every buy and sell in the portfolio is a taxable event for you, taxed as capital gains at your applicable short-term or long-term rate. This differs from mutual funds, where tax arises only when you redeem units. Please consult your tax professional.",
      },
      {
        question: "What fees should I expect?",
        answer:
          "Typically a fixed management fee, a performance fee above an agreed hurdle rate, or a hybrid of both, plus brokerage, custody and statutory charges. All fees must be disclosed in the disclosure document and PMS agreement — read them carefully before signing.",
      },
    ]}
  />
);

export default PMS;
