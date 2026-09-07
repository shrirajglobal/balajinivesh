const CommissionDisclosure = () => {
  return (
    <div className="container max-w-4xl py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Commission Disclosure</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 7, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2>Regulatory Status</h2>
          <p>
            Balaji Nivesh Private Limited is an <strong>AMFI-registered Mutual Fund Distributor</strong> bearing ARN – 173142. We are <strong>not</strong> a SEBI-registered Investment Adviser, Research Analyst, or Portfolio Manager.
          </p>
        </section>

        <section>
          <h2>1. Source of Our Income</h2>
          <p>
            As a mutual fund distributor, Balaji Nivesh earns <strong>upfront and/or trail commission</strong> from Asset Management Companies (AMCs) on mutual fund schemes distributed through us. These commissions are paid by the AMCs directly to us and are <strong>not charged to the investor</strong> as a separate fee.
          </p>
          <p className="mt-2">
            The commission structure varies from scheme to scheme and from AMC to AMC. It may include:
          </p>
          <ul>
            <li>Upfront commission paid at the time of investment.</li>
            <li>Trail commission paid periodically for as long as the investor stays invested in the scheme.</li>
            <li>Other permissible incentives as per AMFI guidelines.</li>
          </ul>
        </section>

        <section>
          <h2>2. No Investment Advice</h2>
          <p>
            Balaji Nivesh acts purely as a <strong>distributor</strong> of mutual fund products. We do not provide investment advice, investment recommendations, or portfolio management services. Any information shared on this website or by our representatives is for <strong>educational and informational purposes only</strong> and should not be construed as advice to buy, sell, or hold any mutual fund scheme.
          </p>
          <p className="mt-2">
            Investors are encouraged to read the Scheme Information Document (SID), Statement of Additional Information (SAI), and Key Information Memorandum (KIM) of any scheme before investing. These documents are available on the SEBI filings portal at{" "}
            <a
              href="https://www.sebi.gov.in/filings/mutual-funds.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.sebi.gov.in/filings/mutual-funds.html
            </a>.
          </p>
        </section>

        <section>
          <h2>3. Independence & Investor Interest</h2>
          <p>
            While we receive commissions from AMCs, our aim is to help investors access mutual fund products in a transparent and compliant manner. Commission received does not, and should not be understood to, influence the selection or presentation of schemes. Investors must independently evaluate their risk appetite, financial goals, and investment horizon before making any investment decision.
          </p>
        </section>

        <section>
          <h2>4. Request for Scheme-wise Commission Details</h2>
          <p>
            In line with SEBI and AMFI requirements, investors may request scheme-wise commission details from us. To obtain this information, please write to us at{" "}
            <a
              href="mailto:info@balajinivesh.com"
              className="text-primary hover:underline"
            >
              info@balajinivesh.com
            </a>{" "}
            or call us at{" "}
            <a
              href="tel:+919330079717"
              className="text-primary hover:underline"
            >
              +91 93300 79717
            </a>.
          </p>
        </section>

        <section>
          <h2>5. Standard Disclaimer</h2>
          <p className="font-semibold text-foreground">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
          </p>
          <p className="mt-2">
            Past performance is not indicative of future returns. The NAV of mutual fund units may go up or down based on market conditions. There is no assurance or guarantee that the objectives of any mutual fund scheme will be achieved.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CommissionDisclosure;
