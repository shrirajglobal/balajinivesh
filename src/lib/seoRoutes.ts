import { SITE_URL, absoluteUrl } from "@/lib/site";

export interface RouteMeta {
  title: string;
  description: string;
  keywords?: string[];
  /** Breadcrumb trail (excluding Home) as [label, path] pairs. */
  crumbs?: [string, string][];
  noindex?: boolean;
}

export function breadcrumbLd(crumbs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...crumbs].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Balaji Nivesh Private Limited",
  alternateName: "Balaji Nivesh",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "AMFI-registered Mutual Fund Distributor (ARN-173142) offering investor education, financial planning tools and distribution of Mutual Funds, SIF, AIF and PMS.",
  telephone: "+91-93300-79717",
  areaServed: "IN",
  address: { "@type": "PostalAddress", addressCountry: "IN", addressRegion: "West Bengal", addressLocality: "Kolkata" },
  sameAs: [SITE_URL],
  knowsAbout: ["Mutual Funds", "SIP", "SIF", "AIF", "PMS", "Retirement Planning"],
  identifier: "ARN-173142",
};

const CALC = (name: string, path: string, title: string, description: string, keywords: string[]): [string, RouteMeta] => [
  path,
  { title, description, keywords, crumbs: [["Calculators", "/calculators"], [name, path]] },
];

export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Balaji Nivesh — Mutual Fund Distributor & Planning Tools",
    description:
      "Free SIP, retirement and goal calculators plus investor education from an AMFI-registered Mutual Fund Distributor (ARN-173142). Book a free 15-minute call.",
    keywords: ["mutual fund distributor", "SIP calculator", "financial planning India", "ARN-173142"],
  },
  "/calculators": {
    title: "Free Investment Calculators — SIP, Retirement, Goals",
    description:
      "Eleven free calculators — SIP, lumpsum, step-up SIP, retirement, crorepati, child education, marriage, emergency fund and life cover. Plan any goal in 2 minutes.",
    keywords: ["SIP calculator", "retirement calculator", "investment calculator India"],
    crumbs: [["Calculators", "/calculators"]],
  },
  "/education": {
    title: "Investor Education — Learn Investing in Simple Language",
    description:
      "Simple, jargon-free investing lessons for homemakers, kids and first-time investors. Free courses with certificates from Balaji Nivesh.",
    keywords: ["investor education India", "learn mutual funds", "financial literacy"],
    crumbs: [["Education", "/education"]],
  },
  "/education/homemakers": {
    title: "Money Lessons for Homemakers — Free Course",
    description:
      "A friendly, step-by-step course for homemakers: budgeting, saving, SIPs and building your own money confidence. Free, with a certificate.",
    keywords: ["money course for homemakers", "women investing India"],
    crumbs: [["Education", "/education"], ["Homemakers", "/education/homemakers"]],
  },
  "/education/kids": {
    title: "Money Lessons for Kids — Fun Financial Literacy",
    description:
      "Fun, age-appropriate lessons that teach children saving, spending and compounding — with quizzes and a printable certificate.",
    keywords: ["financial literacy for kids", "money lessons children India"],
    crumbs: [["Education", "/education"], ["Kids", "/education/kids"]],
  },
  "/tools/health-check": {
    title: "Free Financial Health Check — Score Your Finances",
    description:
      "Answer a few questions and get an instant score on your savings, protection and investments, plus the three things to fix first.",
    keywords: ["financial health check", "money checkup India"],
    crumbs: [["Financial Health Check", "/tools/health-check"]],
  },
  "/partner": {
    title: "Become a Mutual Fund Distribution Partner",
    description:
      "Partner with Balaji Nivesh: NISM-aligned academy, ready client tools, transparent commissions and full back-office support for sub-distributors.",
    keywords: ["mutual fund distributor partner", "become MFD India", "sub-distributor"],
    crumbs: [["Partner", "/partner"]],
  },
  "/resources": {
    title: "Investor Resources — Guides, Forms & Downloads",
    description:
      "Handy downloads, checklists and links for mutual fund investors — KYC, statements, nomination and planning guides in one place.",
    crumbs: [["Resources", "/resources"]],
  },
  "/privacy": {
    title: "Privacy Policy | Balaji Nivesh",
    description:
      "How Balaji Nivesh Private Limited collects, uses and protects your personal information as an AMFI-registered Mutual Fund Distributor.",
    crumbs: [["Privacy Policy", "/privacy"]],
  },
  "/terms": {
    title: "Terms of Use | Balaji Nivesh",
    description: "The terms that govern your use of the Balaji Nivesh website, calculators and educational content.",
    crumbs: [["Terms of Use", "/terms"]],
  },
  "/disclaimer": {
    title: "Disclaimer | Balaji Nivesh",
    description:
      "Mutual fund investments are subject to market risks. Read the standard disclaimer for Balaji Nivesh Private Limited, ARN-173142.",
    crumbs: [["Disclaimer", "/disclaimer"]],
  },
  "/commission-disclosure": {
    title: "Commission Disclosure | Balaji Nivesh",
    description:
      "Full disclosure of the commission Balaji Nivesh Private Limited (ARN-173142) earns as a mutual fund distributor, scheme category wise.",
    crumbs: [["Commission Disclosure", "/commission-disclosure"]],
  },
  "/auth": { title: "Sign in | Balaji Nivesh", description: "Sign in to your Balaji Nivesh account.", noindex: true },
};

[
  CALC("SIP Calculator", "/calculators/sip", "SIP Calculator — Monthly SIP Returns in Seconds",
    "Work out what a monthly SIP could grow to. Adjust the amount, years and expected return, and see the year-by-year chart. Free SIP calculator, market risks apply.",
    ["SIP calculator", "mutual fund SIP returns", "SIP growth calculator"]),
  CALC("Lumpsum Calculator", "/calculators/lumpsum", "Lumpsum Calculator — One-Time Investment Growth",
    "See how a one-time investment could grow over time with compounding. Free lumpsum mutual fund calculator from Balaji Nivesh.",
    ["lumpsum calculator", "one time investment calculator"]),
  CALC("Step-Up SIP Calculator", "/calculators/step-up-sip", "Step-Up SIP Calculator — Raise Your SIP Yearly",
    "Increase your SIP a little every year and see how much extra wealth it creates. Free step-up SIP calculator with a year-wise chart.",
    ["step up SIP calculator", "top up SIP"]),
  CALC("Retirement Planner", "/calculators/retirement", "Retirement Calculator — How Much Corpus You Need",
    "Find the retirement corpus you need for your lifestyle after inflation, and the monthly SIP that gets you there. Free retirement planner for India.",
    ["retirement calculator India", "retirement corpus calculator"]),
  CALC("SIP vs FD", "/calculators/sip-vs-fd", "SIP vs FD Calculator — Compare Side by Side",
    "Compare a monthly SIP with a fixed deposit over the same period and see the difference in outcome, tax and liquidity. Market risks apply.",
    ["SIP vs FD", "fixed deposit vs mutual fund"]),
  CALC("Emergency Fund", "/calculators/emergency-fund", "Emergency Fund Calculator — How Much to Keep Aside",
    "Calculate the emergency fund your household needs based on monthly expenses and dependants, and where to park it.",
    ["emergency fund calculator", "contingency fund India"]),
  CALC("Crorepati Calculator", "/calculators/crorepati", "Crorepati Calculator — Reach Rs 1 Crore With SIP",
    "Find the monthly SIP needed to build Rs 1 crore in your chosen timeframe, adjusted for expected returns. Free crorepati calculator.",
    ["crorepati calculator", "1 crore SIP calculator"]),
  CALC("Child Education", "/calculators/child-education", "Child Education Calculator — Plan College Costs",
    "Estimate the future cost of your child's education after inflation and the monthly investment needed to fund it.",
    ["child education calculator", "education planning India"]),
  CALC("Child Marriage", "/calculators/child-marriage", "Child Marriage Planner — Save for the Big Day",
    "Estimate the future cost of your child's wedding after inflation and the monthly investment required to be ready in time.",
    ["child marriage calculator", "wedding savings plan"]),
  CALC("Life Cover", "/calculators/life-cover", "Life Cover Calculator — How Much Insurance You Need",
    "Work out the life cover your family would need using income, loans, goals and existing cover, in under two minutes.",
    ["life cover calculator", "term insurance need calculator"]),
].forEach(([path, meta]) => {
  routeMeta[path as string] = meta as RouteMeta;
});
