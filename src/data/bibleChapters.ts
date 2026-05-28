// NISM V-A Content Bible — 42 chapters mapped to the 12 official units of the
// NISM V-A Mutual Fund Distributors workbook (FY 2024-25 syllabus).
// Do not improvise; the structure mirrors the official table of contents.

export interface BibleChapter {
  n: number;          // global chapter number 1..42 (drives display_order)
  slug: string;
  title: string;
  module_key: string; // must match learning_modules.module_key
}

export const BIBLE_CHAPTERS: BibleChapter[] = [
  // Unit 1 — Investment Landscape (4)
  { n: 1, slug: "investment-landscape-introduction", title: "Introduction to the Investment Landscape", module_key: "investment_landscape" },
  { n: 2, slug: "investors-and-financial-goals",      title: "Investors and Their Financial Goals",     module_key: "investment_landscape" },
  { n: 3, slug: "savings-vs-investments-asset-classes", title: "Savings vs Investments & Asset Classes", module_key: "investment_landscape" },
  { n: 4, slug: "risk-return-spectrum",               title: "The Risk-Return Spectrum",                 module_key: "investment_landscape" },

  // Unit 2 — Concept & Role of a Mutual Fund (3)
  { n: 5, slug: "concept-of-a-mutual-fund",           title: "Concept of a Mutual Fund",                 module_key: "concept_role_mf" },
  { n: 6, slug: "role-and-growth-of-mutual-funds",    title: "Role and Growth of Mutual Funds in India", module_key: "concept_role_mf" },
  { n: 7, slug: "classification-of-mutual-funds",     title: "Classification of Mutual Funds",           module_key: "concept_role_mf" },

  // Unit 3 — Legal Structure of Mutual Funds in India (4)
  { n: 8,  slug: "three-tier-structure-of-mutual-funds", title: "Three-Tier Structure of Mutual Funds",   module_key: "legal_structure" },
  { n: 9,  slug: "sponsor-trustee-amc",                  title: "Key Constituents: Sponsor, Trustee, AMC", module_key: "legal_structure" },
  { n: 10, slug: "rta-custodian-auditor-distributors",   title: "Service Providers: RTA, Custodian, Auditor, Distributors", module_key: "legal_structure" },
  { n: 11, slug: "role-of-sebi-and-amfi",                title: "Role of SEBI and AMFI as Regulators",    module_key: "legal_structure" },

  // Unit 4 — Legal & Regulatory Framework (4)
  { n: 12, slug: "sebi-mf-regulations-overview",      title: "SEBI (Mutual Funds) Regulations — Overview", module_key: "legal_regulatory" },
  { n: 13, slug: "investment-restrictions",           title: "Investment Restrictions for Mutual Funds",   module_key: "legal_regulatory" },
  { n: 14, slug: "kyc-pmla-aml-cft",                  title: "KYC, PMLA and AML/CFT Compliance",          module_key: "legal_regulatory" },
  { n: 15, slug: "fatca-crs-investor-protection",     title: "FATCA, CRS and Investor Protection",        module_key: "legal_regulatory" },

  // Unit 5 — Scheme Related Information (4)
  { n: 16, slug: "scheme-information-document-sid",   title: "Scheme Information Document (SID)",         module_key: "scheme_related_info" },
  { n: 17, slug: "statement-of-additional-information-sai", title: "Statement of Additional Information (SAI)", module_key: "scheme_related_info" },
  { n: 18, slug: "key-information-memorandum-kim",    title: "Key Information Memorandum (KIM)",          module_key: "scheme_related_info" },
  { n: 19, slug: "nfo-process-and-addendums",         title: "NFO Process, Addendums and Disclosures",    module_key: "scheme_related_info" },

  // Unit 6 — Fund Distribution & Channel Management (4)
  { n: 20, slug: "distribution-channels-overview",    title: "Distribution Channels Overview",            module_key: "fund_distribution" },
  { n: 21, slug: "arn-euin-registration",             title: "ARN and EUIN Registration Process",         module_key: "fund_distribution" },
  { n: 22, slug: "commission-structures-trail-upfront", title: "Commission Structures: Trail vs Upfront", module_key: "fund_distribution" },
  { n: 23, slug: "amfi-code-of-conduct",              title: "AMFI Code of Conduct for Distributors",     module_key: "fund_distribution" },

  // Unit 7 — NAV, TER & Pricing of Units (3)
  { n: 24, slug: "nav-calculation",                   title: "Net Asset Value (NAV) — Calculation",       module_key: "nav_ter_pricing" },
  { n: 25, slug: "total-expense-ratio-ter",           title: "Total Expense Ratio (TER) and SEBI Limits", module_key: "nav_ter_pricing" },
  { n: 26, slug: "pricing-and-cut-off-timings",       title: "Pricing of Units and Cut-Off Timings",      module_key: "nav_ter_pricing" },

  // Unit 8 — Taxation (3)
  { n: 27, slug: "taxation-equity-vs-debt-funds",     title: "Taxation of Equity vs Debt Funds",          module_key: "taxation" },
  { n: 28, slug: "idcw-dividend-and-stt",             title: "IDCW (Dividend) Treatment and STT",         module_key: "taxation" },
  { n: 29, slug: "capital-gains-set-off-carry-forward", title: "Capital Gains, Set-Off and Carry-Forward", module_key: "taxation" },

  // Unit 9 — Investor Services (4)
  { n: 30, slug: "transaction-processing",            title: "Transaction Processing for Mutual Funds",   module_key: "investor_services" },
  { n: 31, slug: "sip-swp-stp-systematic-plans",      title: "SIP, SWP and STP — Systematic Plans",       module_key: "investor_services" },
  { n: 32, slug: "folio-operations-and-nominations",  title: "Folio Operations, Nominations and KYC Updates", module_key: "investor_services" },
  { n: 33, slug: "investor-grievance-redressal-scores", title: "Investor Grievance Redressal and SCORES", module_key: "investor_services" },

  // Unit 10 — Risk, Return & Performance of Funds (3)
  { n: 34, slug: "measuring-returns-absolute-cagr-xirr", title: "Measuring Returns: Absolute, CAGR and XIRR", module_key: "risk_return_performance" },
  { n: 35, slug: "risk-measures-standard-deviation-beta", title: "Risk Measures: Standard Deviation and Beta", module_key: "risk_return_performance" },
  { n: 36, slug: "risk-adjusted-returns-sharpe-treynor",  title: "Risk-Adjusted Returns: Sharpe and Treynor",  module_key: "risk_return_performance" },

  // Unit 11 — Mutual Fund Scheme Performance (3)
  { n: 37, slug: "benchmarking-and-tracking-error",   title: "Benchmarking and Tracking Error",           module_key: "scheme_performance" },
  { n: 38, slug: "factors-affecting-fund-performance", title: "Factors Affecting Fund Performance",       module_key: "scheme_performance" },
  { n: 39, slug: "scheme-performance-evaluation",     title: "Evaluating Scheme Performance Over Time",   module_key: "scheme_performance" },

  // Unit 12 — Mutual Fund Scheme Selection (3)
  { n: 40, slug: "scheme-selection-criteria",         title: "Scheme Selection Criteria for Distributors", module_key: "scheme_selection" },
  { n: 41, slug: "asset-allocation-strategies",       title: "Asset Allocation Strategies",               module_key: "scheme_selection" },
  { n: 42, slug: "model-portfolios-and-rebalancing",  title: "Model Portfolios and Rebalancing",          module_key: "scheme_selection" },
];
