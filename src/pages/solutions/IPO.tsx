import { Rocket } from "lucide-react";
import SolutionPageTemplate from "@/components/solutions/SolutionPageTemplate";

const IPO = () => (
  <SolutionPageTemplate
    title="IPO (Initial Public Offering)"
    subtitle="An opportunity to invest in companies when they first list their shares on the stock exchange."
    description="IPO information is for educational purposes only. Past performance and listing gains are not guaranteed. Invest based on your own assessment."
    icon={<Rocket className="h-8 w-8" />}
    whatIsIt="An Initial Public Offering (IPO) is the process by which a private company offers its shares to the public for the first time on a stock exchange. When a company goes public through an IPO, investors get an opportunity to buy shares at the offer price before the stock starts trading on exchanges like NSE and BSE. IPOs in India are regulated by SEBI, and companies must file a Draft Red Herring Prospectus (DRHP) with detailed information about the business, financials, and risk factors. IPO investing can offer opportunities but also carries risks."
    suitableFor={[
      "Investors with higher risk appetite",
      "Those who understand equity markets",
      "Investors seeking listing day opportunities",
      "Long-term investors interested in company growth stories",
    ]}
    horizon="Short-term (listing gains) to Long-term (3-5+ years)"
    riskLevel="High"
    keyBenefits={[
      "Opportunity to invest at offer price before listing",
      "Potential for listing gains if demand is high",
      "Access to growing companies' equity early",
      "SEBI-regulated process with mandatory disclosures",
      "Apply online through UPI-based ASBA process",
      "Retail investor quota ensures allocation for small investors",
      "Demat-based allotment for easy holding",
      "Can apply through any registered bank or broker",
    ]}
    faqs={[
      {
        question: "How do I apply for an IPO in India?",
        answer:
          "You can apply for IPOs through your bank's net banking (ASBA - Application Supported by Blocked Amount) or through UPI using any trading app. You need a Demat account, PAN card, and a bank account. The application amount is blocked in your account and debited only if shares are allotted.",
      },
      {
        question: "Is IPO investing risky?",
        answer:
          "Yes, IPO investing carries significant risks. Not all IPOs give listing gains — some may list below the offer price. The company's future performance is uncertain, and past IPO returns don't guarantee future results. It's important to read the prospectus carefully and understand the business before applying.",
      },
      {
        question: "What is the difference between book-built and fixed-price IPOs?",
        answer:
          "In a book-built IPO, the company provides a price band and investors bid within that range. The final price is determined based on demand. In a fixed-price IPO, the price is set beforehand. Most major IPOs in India follow the book-built route.",
      },
      {
        question: "What does 'oversubscribed' mean in an IPO?",
        answer:
          "When more shares are applied for than are available, the IPO is said to be 'oversubscribed'. For example, 3x oversubscribed means three times more shares were demanded than offered. Higher oversubscription generally means lower chances of allotment for retail investors.",
      },
    ]}
  />
);

export default IPO;
