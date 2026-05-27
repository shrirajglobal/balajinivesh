// NISM V-A Content Bible — fixed 42-chapter list (do not improvise)
export interface BibleChapter {
  n: number;
  slug: string;
  title: string;
  module_key: string;
}

export const BIBLE_CHAPTERS: BibleChapter[] = [
  // Investment Landscape (1–3)
  { n: 1, slug: "investment-landscape-introduction", title: "Introduction to Investment Landscape", module_key: "investment_landscape" },
  { n: 2, slug: "concept-and-role-of-mutual-fund", title: "Concept and Role of a Mutual Fund", module_key: "investment_landscape" },
  { n: 3, slug: "classification-of-mutual-funds", title: "Classification of Mutual Funds", module_key: "investment_landscape" },
  // Regulatory Framework (4–8)
  { n: 4, slug: "regulatory-framework-sebi", title: "Regulatory Framework — SEBI", module_key: "regulatory_framework" },
  { n: 5, slug: "amfi-and-self-regulation", title: "AMFI and Self-Regulation", module_key: "regulatory_framework" },
  { n: 6, slug: "structure-of-mutual-funds-in-india", title: "Structure of Mutual Funds in India", module_key: "regulatory_framework" },
  { n: 7, slug: "key-constituents-sponsor-trustee-amc", title: "Key Constituents: Sponsor, Trustee, AMC", module_key: "regulatory_framework" },
  { n: 8, slug: "service-providers-rta-custodian-auditor", title: "Service Providers: RTA, Custodian, Auditor", module_key: "regulatory_framework" },
  // Legal & Compliance (9–13)
  { n: 9, slug: "legal-structure-trust-and-deed", title: "Legal Structure: Trust and Trust Deed", module_key: "legal_compliance" },
  { n: 10, slug: "investment-restrictions-and-regulations", title: "Investment Restrictions and Regulations", module_key: "legal_compliance" },
  { n: 11, slug: "kyc-and-pmla-compliance", title: "KYC and PMLA Compliance", module_key: "legal_compliance" },
  { n: 12, slug: "fatca-and-crs-reporting", title: "FATCA and CRS Reporting", module_key: "legal_compliance" },
  { n: 13, slug: "investor-protection-and-grievance-redressal", title: "Investor Protection and Grievance Redressal", module_key: "legal_compliance" },
  // Offer Documents (14–18)
  { n: 14, slug: "scheme-information-document-sid", title: "Scheme Information Document (SID)", module_key: "offer_documents" },
  { n: 15, slug: "statement-of-additional-information-sai", title: "Statement of Additional Information (SAI)", module_key: "offer_documents" },
  { n: 16, slug: "key-information-memorandum-kim", title: "Key Information Memorandum (KIM)", module_key: "offer_documents" },
  { n: 17, slug: "nfo-process-and-timelines", title: "NFO Process and Timelines", module_key: "offer_documents" },
  { n: 18, slug: "addendum-and-disclosures", title: "Addendum and Continuous Disclosures", module_key: "offer_documents" },
  // Scheme Types (19–24)
  { n: 19, slug: "equity-funds", title: "Equity Funds", module_key: "scheme_types" },
  { n: 20, slug: "debt-funds", title: "Debt Funds", module_key: "scheme_types" },
  { n: 21, slug: "hybrid-funds", title: "Hybrid Funds", module_key: "scheme_types" },
  { n: 22, slug: "solution-oriented-and-other-schemes", title: "Solution-Oriented and Other Schemes", module_key: "scheme_types" },
  { n: 23, slug: "index-funds-and-etfs", title: "Index Funds and ETFs", module_key: "scheme_types" },
  { n: 24, slug: "fund-of-funds-and-international-funds", title: "Fund of Funds and International Funds", module_key: "scheme_types" },
  // Risk, Return, Performance (25–29)
  { n: 25, slug: "measuring-mutual-fund-returns", title: "Measuring Mutual Fund Returns", module_key: "risk_return_performance" },
  { n: 26, slug: "risk-measures-standard-deviation-beta", title: "Risk Measures: Standard Deviation, Beta", module_key: "risk_return_performance" },
  { n: 27, slug: "risk-adjusted-returns-sharpe-treynor", title: "Risk-Adjusted Returns: Sharpe, Treynor", module_key: "risk_return_performance" },
  { n: 28, slug: "benchmarking-and-scheme-performance", title: "Benchmarking and Scheme Performance", module_key: "risk_return_performance" },
  { n: 29, slug: "factors-affecting-fund-performance", title: "Factors Affecting Fund Performance", module_key: "risk_return_performance" },
  // Financial Planning (30–34)
  { n: 30, slug: "financial-planning-fundamentals", title: "Financial Planning Fundamentals", module_key: "financial_planning" },
  { n: 31, slug: "goal-setting-and-life-stages", title: "Goal Setting and Life Stages", module_key: "financial_planning" },
  { n: 32, slug: "asset-allocation-strategies", title: "Asset Allocation Strategies", module_key: "financial_planning" },
  { n: 33, slug: "model-portfolios-and-rebalancing", title: "Model Portfolios and Rebalancing", module_key: "financial_planning" },
  { n: 34, slug: "investment-vs-speculation", title: "Investment vs Speculation", module_key: "financial_planning" },
  // Distribution & Channels (35–39)
  { n: 35, slug: "distribution-channels-overview", title: "Distribution Channels Overview", module_key: "distribution_channels" },
  { n: 36, slug: "arn-euin-registration-process", title: "ARN and EUIN Registration Process", module_key: "distribution_channels" },
  { n: 37, slug: "commission-structures-and-trail", title: "Commission Structures and Trail", module_key: "distribution_channels" },
  { n: 38, slug: "code-of-conduct-for-distributors", title: "Code of Conduct for Distributors", module_key: "distribution_channels" },
  { n: 39, slug: "transaction-processing-and-cut-off", title: "Transaction Processing and Cut-Off Timings", module_key: "distribution_channels" },
  // Taxation & Accounting (40–42)
  { n: 40, slug: "taxation-of-equity-and-debt-funds", title: "Taxation of Equity and Debt Funds", module_key: "taxation_accounting" },
  { n: 41, slug: "dividend-and-stt-treatment", title: "Dividend (IDCW) and STT Treatment", module_key: "taxation_accounting" },
  { n: 42, slug: "fund-accounting-expense-ratio", title: "Fund Accounting and Expense Ratio", module_key: "taxation_accounting" },
];
