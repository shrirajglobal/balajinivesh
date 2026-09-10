import { Layers } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const SIF = () => (
  <SolutionPageTemplate
    title="SIF"
    subtitle="Specialized Investment Fund — SEBI's newer category that sits between mutual funds and PMS."
    description="This page is for educational purposes only. Balaji Nivesh Private Limited is an AMFI-registered Mutual Fund Distributor | ARN-173142 and does not provide investment advisory services."
    icon={<Layers className="h-8 w-8" />}
    whatIsIt="A Specialized Investment Fund (SIF) is an investment product category introduced by SEBI to bridge the gap between traditional mutual funds and Portfolio Management Services. SIFs are launched by eligible mutual fund houses under a distinct brand and are permitted to run more flexible, sophisticated strategies — such as long-short equity, sector rotation or hybrid debt strategies — that a regular mutual fund scheme cannot pursue. Because of this added flexibility and the higher risk that comes with it, SEBI prescribes a higher minimum investment (generally ₹10 lakh per investor across a fund house's SIF strategies, with limited exceptions such as accredited investors) so that participation is restricted to investors who can understand and absorb the risk. SIFs remain a pooled, regulated structure with periodic disclosures, but they are not mutual funds and should not be evaluated with the same expectations."
    suitableFor={[
      "Experienced investors who already hold a core mutual fund portfolio",
      "Those able to commit at least ₹10 lakh to a single strategy",
      "Investors comfortable with higher volatility and complex strategies",
      "People seeking diversification beyond plain long-only funds",
    ]}
    horizon="Medium to Long-term (3-7 years), depending on the strategy"
    riskLevel="Moderate to High"
    keyBenefits={[
      "Regulated by SEBI with defined disclosure and reporting norms",
      "Access to strategies not permitted in regular mutual fund schemes",
      "Managed by established, SEBI-registered fund houses",
      "Pooled structure with professional risk management teams",
      "Periodic NAV and portfolio disclosures",
      "Potential to diversify away from traditional long-only equity",
    ]}
    faqs={[
      {
        question: "How is an SIF different from a mutual fund?",
        answer:
          "A mutual fund is designed for mass retail participation with tight investment restrictions. An SIF, while also offered by fund houses, can use more flexible strategies including derivatives-based long-short positions, and carries a higher minimum investment. It is a separate SEBI product category with its own branding and risk disclosures.",
      },
      {
        question: "What is the minimum investment in an SIF?",
        answer:
          "SEBI prescribes a minimum investment threshold of ₹10 lakh per investor across the SIF strategies of a single fund house, with certain relaxations for accredited investors. Exact thresholds and terms are set out in each strategy's offer documents.",
      },
      {
        question: "Is SIF riskier than a mutual fund?",
        answer:
          "Generally yes. The wider strategy mandate that makes an SIF attractive also allows exposures that can behave very differently from a standard fund. All investments are subject to market risk and you should read the offer document carefully before investing.",
      },
      {
        question: "Can I redeem an SIF investment anytime?",
        answer:
          "Liquidity varies by strategy. Some SIF strategies offer daily subscription and redemption while others may operate on a weekly, fortnightly or interval basis with notice periods. Check the specific strategy's terms before committing.",
      },
      {
        question: "How does Balaji Nivesh support me here?",
        answer:
          "We help you understand the structure, taxation and risk profile of these products and assist with documentation. We are a distributor, not an investment adviser, and we do not manage your money or execute transactions on a discretionary basis.",
      },
    ]}
  />
);

export default SIF;
