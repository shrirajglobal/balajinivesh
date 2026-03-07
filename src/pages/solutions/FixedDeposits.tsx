import { Banknote } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const FixedDeposits = () => (
  <SolutionPageTemplate
    title="Fixed Deposits"
    subtitle="A traditional and secure investment option offering guaranteed returns over a fixed tenure."
    description="FD rates mentioned are indicative and may vary. This content is for educational purposes only."
    icon={<Banknote className="h-8 w-8" />}
    whatIsIt="A Fixed Deposit (FD) is one of the most popular and traditional investment instruments in India. When you invest in an FD, you deposit a lump sum with a bank or NBFC for a fixed period at a predetermined interest rate. The interest rate is guaranteed and does not change during the tenure, making FDs a predictable and safe investment option. FDs are ideal for conservative investors who prioritize capital safety over high returns. Senior citizens typically get an additional 0.25% to 0.50% interest rate on FDs."
    suitableFor={[
      "Conservative investors seeking capital safety",
      "Senior citizens looking for regular income",
      "Short to medium-term savings goals",
      "Those parking emergency or surplus funds",
    ]}
    horizon="7 days to 10 years depending on requirement"
    riskLevel="Low"
    keyBenefits={[
      "Guaranteed and predictable returns",
      "Capital safety — deposit amount is protected",
      "DICGC insurance cover up to ₹5 lakh per bank",
      "Flexible tenure options from 7 days to 10 years",
      "Tax-saving FDs available under Section 80C (5-year lock-in)",
      "Senior citizen higher interest rates",
      "Loan against FD facility available",
      "No market risk — returns are fixed at investment time",
    ]}
    faqs={[
      {
        question: "What are current FD interest rates in India?",
        answer:
          "FD interest rates vary across banks and NBFCs, typically ranging from 5% to 8% per annum depending on tenure and institution. Senior citizens usually get 0.25% to 0.50% extra. Corporate FDs from NBFCs may offer slightly higher rates but carry different risk profiles. Check with us for the latest rates.",
      },
      {
        question: "Is FD interest taxable?",
        answer:
          "Yes, interest earned on FDs is fully taxable as per your income tax slab. If the total interest from all FDs in a bank exceeds ₹40,000 (₹50,000 for senior citizens) in a financial year, the bank deducts TDS at 10%. You can submit Form 15G/15H if your total income is below the taxable limit.",
      },
      {
        question: "Can I withdraw my FD before maturity?",
        answer:
          "Yes, most banks allow premature withdrawal of FDs, but a penalty of 0.5% to 1% is typically deducted from the applicable interest rate. Tax-saving FDs (5-year) cannot be withdrawn before maturity. Some banks offer FDs with no premature withdrawal penalty.",
      },
      {
        question: "Should I choose FD or mutual funds?",
        answer:
          "Both serve different purposes. FDs offer guaranteed returns and capital safety but lower growth potential. Mutual funds offer higher potential returns over the long term but come with market risk. The right choice depends on your risk tolerance, investment horizon, and financial goals. Many investors use both in their portfolio.",
      },
    ]}
  />
);

export default FixedDeposits;
