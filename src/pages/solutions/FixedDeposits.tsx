import { Banknote } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const FixedDeposits = () => (
  <SolutionPageTemplate
    title="Fixed Deposits"
    subtitle="A traditional investment option offering pre-agreed returns over a fixed tenure, subject to the issuer's terms."
    description="FD rates mentioned are indicative and may vary across issuers and tenures. This content is for educational purposes only and does not constitute investment advice."
    icon={<Banknote className="h-8 w-8" />}
    whatIsIt="A Fixed Deposit (FD) is one of the most popular traditional investment instruments in India. When you invest in an FD, you deposit a lump sum with a bank or NBFC for a fixed period at a pre-agreed rate of interest. The interest rate is contractually fixed at the time of booking and does not change during the tenure. Bank FDs are covered by DICGC insurance up to ₹5 lakh per depositor per bank; corporate/NBFC FDs are not covered by DICGC and carry credit risk of the issuer. Senior citizens typically get an additional 0.25% to 0.50% interest rate."
    suitableFor={[
      "Conservative investors seeking predictable cash flows",
      "Senior citizens looking for regular interest income",
      "Short to medium-term savings goals",
      "Those parking emergency or surplus funds",
    ]}
    horizon="7 days to 10 years depending on requirement"
    riskLevel="Low"
    keyBenefits={[
      "Contractually pre-agreed interest rate for the chosen tenure",
      "Bank FDs covered by DICGC insurance up to ₹5 lakh per bank",
      "Flexible tenure options from 7 days to 10 years",
      "Tax-saving FDs available under Section 80C (5-year lock-in)",
      "Additional interest rates for senior citizens",
      "Loan against FD facility available with most banks",
      "Interest rate is not linked to daily market movements",
      "Corporate/NBFC FDs carry credit risk of the issuer — read the offer document",
    ]}
    faqs={[
      {
        question: "What are current FD interest rates in India?",
        answer:
          "FD interest rates vary across banks and NBFCs, typically ranging from 5% to 8% per annum depending on tenure and issuer. Senior citizens usually get 0.25% to 0.50% extra. Corporate/NBFC FDs may offer slightly higher rates but carry issuer credit risk and are not covered by DICGC. Please check the latest published rates of the specific issuer before investing.",
      },
      {
        question: "Is FD interest taxable?",
        answer:
          "Yes, interest earned on FDs is fully taxable as per your income tax slab. If the total interest from all FDs in a bank exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year, the bank deducts TDS at 10%. You can submit Form 15G/15H if your total income is below the taxable limit. Please consult a tax professional for your specific situation.",
      },
      {
        question: "Can I withdraw my FD before maturity?",
        answer:
          "Most banks allow premature withdrawal, typically with a penalty of 0.5% to 1% on the applicable interest rate. Tax-saving FDs (5-year) cannot be withdrawn before maturity. Terms vary by issuer — please read the specific FD's terms before booking.",
      },
      {
        question: "How does an FD compare with mutual funds?",
        answer:
          "FDs and mutual funds serve different purposes. FDs offer a pre-agreed interest rate for a fixed tenure with lower volatility, while mutual funds are market-linked — returns are not fixed and can fluctuate based on market conditions. The right mix depends on your risk profile, investment horizon, and financial goals. Mutual fund investments are subject to market risks; please read all scheme-related documents carefully before investing.",
      },
    ]}
  />
);

export default FixedDeposits;
