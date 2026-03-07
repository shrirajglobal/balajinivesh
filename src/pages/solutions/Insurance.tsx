import { Shield } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const Insurance = () => (
  <SolutionPageTemplate
    title="Insurance"
    subtitle="Financial protection products that safeguard you and your family against life's uncertainties."
    description="Insurance products are distributed through Balaji Nivesh. This content is for educational purposes only."
    icon={<Shield className="h-8 w-8" />}
    whatIsIt="Insurance is a financial product that provides protection against financial losses due to unforeseen events. In India, insurance broadly falls into two categories — Life Insurance (which provides financial protection to your family in case of your untimely demise) and General Insurance (covering health, motor, travel, property, etc.). Insurance plays a crucial role in financial planning by protecting your wealth and ensuring your family's financial security. IRDAI (Insurance Regulatory and Development Authority of India) regulates the insurance sector."
    suitableFor={[
      "Anyone with financial dependents",
      "Individuals seeking health coverage",
      "People looking for tax-saving options",
      "Families wanting financial security",
    ]}
    horizon="Term plans: 10-40 years | Health: Renewed annually"
    riskLevel="Low"
    keyBenefits={[
      "Financial protection for your family",
      "Health insurance covers medical expenses",
      "Tax benefits under Section 80C and 80D",
      "Term insurance offers high cover at low premiums",
      "Riders for additional coverage (accident, critical illness)",
      "Peace of mind for life's uncertainties",
      "Maturity benefits in endowment and ULIP plans",
      "Critical illness cover for major health conditions",
    ]}
    faqs={[
      {
        question: "What is the difference between term insurance and endowment plans?",
        answer:
          "Term insurance provides pure life cover — if the policyholder passes away during the policy term, the nominee receives the sum assured. It has no maturity benefit but offers the highest cover at lowest premiums. Endowment plans combine insurance with savings, providing a maturity benefit, but premiums are significantly higher for lower cover amounts.",
      },
      {
        question: "How much life insurance cover do I need?",
        answer:
          "A general rule of thumb is to have life insurance coverage of at least 10-15 times your annual income. However, the exact amount depends on your liabilities, lifestyle expenses, number of dependents, existing assets, and future financial goals. A comprehensive needs analysis can help determine the right cover.",
      },
      {
        question: "Is health insurance really necessary if I'm young and healthy?",
        answer:
          "Yes. Medical costs are rising rapidly in India, and a single hospitalization can wipe out years of savings. Buying health insurance when you're young means lower premiums and no pre-existing condition waiting periods. It's one of the most important financial planning steps regardless of age.",
      },
      {
        question: "What tax benefits are available on insurance?",
        answer:
          "Life insurance premiums qualify for deduction under Section 80C (up to ₹1.5 lakh). Health insurance premiums qualify under Section 80D — up to ₹25,000 for self/family and an additional ₹25,000-₹50,000 for parents. Tax rules may change, so consult a tax advisor.",
      },
    ]}
  />
);

export default Insurance;
