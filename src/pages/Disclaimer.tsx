const Disclaimer = () => {
  return (
    <div className="container max-w-4xl py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 7, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {/* Regulatory Status */}
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2>Regulatory Status</h2>
          <p>
            Balaji Nivesh Private Limited is an <strong>AMFI-registered Mutual Fund Distributor</strong> bearing ARN – 173142. We are <strong>not</strong> a SEBI-registered Investment Adviser under the SEBI (Investment Advisers) Regulations, 2013, nor a SEBI-registered Research Analyst under the SEBI (Research Analysts) Regulations, 2014, nor a SEBI-registered Portfolio Manager under the SEBI (Portfolio Managers) Regulations, 2020.
          </p>
        </section>

        {/* Standard AMFI Disclaimer */}
        <section className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h2>Standard AMFI/SEBI Disclaimer</h2>
          <p className="font-semibold text-foreground">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
          </p>
          <p className="mt-3">
            Past performance is not indicative of future returns. The NAV of mutual fund units may go up or down based on market conditions and factors affecting the securities markets. There is no assurance or guarantee that the objectives of any mutual fund scheme will be achieved.
          </p>
        </section>

        <section>
          <h2>1. General Information Only</h2>
          <p>
            The information provided on this website, including but not limited to text, graphics, data, calculators, tools, educational content, and assessment results, is for <strong>general informational and educational purposes only</strong>. It does not constitute:
          </p>
          <ul>
            <li>Investment advice or recommendation to buy, sell, or hold any security or financial product.</li>
            <li>An offer or solicitation to purchase or subscribe to any mutual fund scheme or financial product.</li>
            <li>Professional financial, tax, legal, or accounting advice.</li>
            <li>A guarantee or assurance of returns on any investment.</li>
          </ul>
        </section>

        <section>
          <h2>2. No Advisory Relationship</h2>
          <p>
            Use of this website does not create an investment advisory relationship between you and Balaji Nivesh. As a mutual fund distributor, we earn commissions/trail fees from the Asset Management Companies (AMCs) whose products we distribute. You are encouraged to consider this when evaluating our services and to seek independent financial advice tailored to your specific circumstances.
          </p>
        </section>

        <section>
          <h2>3. Investor Responsibility</h2>
          <ul>
            <li>All investment decisions are made solely by the investor. We do not assume responsibility for any investment losses.</li>
            <li>Investors must read and understand the Scheme Information Document (SID), Statement of Additional Information (SAI), and Key Information Memorandum (KIM) of any mutual fund scheme before investing.</li>
            <li>Investors should assess their own risk appetite, financial goals, and investment horizon before making any investment decision.</li>
            <li>Investors are advised to consult their tax advisors for tax implications of their investments.</li>
          </ul>
        </section>

        <section>
          <h2>4. Accuracy of Information</h2>
          <p>
            While we endeavour to ensure that the information on this website is accurate, complete, and current, we make no representations or warranties (express or implied) regarding the accuracy, reliability, completeness, or timeliness of any information. NAV data, return figures, scheme details, and other financial data displayed may be sourced from third parties including AMCs, RTAs, and data providers, and may not reflect real-time values.
          </p>
        </section>

        <section>
          <h2>5. Calculators & Tools Disclaimer</h2>
          <p>
            The financial calculators (SIP Calculator, Lump Sum Calculator, Step-Up SIP Calculator, Retirement Planner, SIP vs FD Comparison, Emergency Fund Calculator), Risk Profiler, and Financial Health Check tools available on this website:
          </p>
          <ul>
            <li>Use simplified models and assumed rates of return for illustrative purposes only.</li>
            <li>Do <strong>not</strong> account for taxes, exit loads, expense ratios, inflation adjustments (unless explicitly stated), or changes in regulatory frameworks.</li>
            <li>Should <strong>not</strong> be relied upon as the sole basis for any investment decision.</li>
            <li>Are not predictions, projections, or guarantees of actual investment outcomes.</li>
            <li>Actual returns may vary significantly from the estimates provided by these tools.</li>
          </ul>
        </section>

        <section>
          <h2>6. Education Content & Certificates</h2>
          <ul>
            <li>The educational content in the Investor Education Hub is designed to improve general financial literacy and is <strong>not</strong> a substitute for professional financial advice.</li>
            <li>Certificates issued upon completion of education modules are for personal motivation and engagement only. They are <strong>not</strong> recognised as professional qualifications by SEBI, AMFI, NISM, or any educational or regulatory body.</li>
            <li>The content may be simplified for educational accessibility and may not cover all aspects, risks, or nuances of the topics discussed.</li>
          </ul>
        </section>

        <section>
          <h2>7. Product-Specific Disclosures</h2>
          <ul>
            <li><strong>Mutual Funds:</strong> Subject to market risks. Read all scheme-related documents carefully.</li>
            <li><strong>Bonds:</strong> Subject to credit risk, interest rate risk, and liquidity risk. Bond values may fluctuate based on market conditions.</li>
            <li><strong>Insurance:</strong> Insurance is a contract between the insurer and the insured. Balaji Nivesh acts as a referral partner and is not an IRDAI-licensed insurance agent/broker. Please read the policy documents carefully for detailed terms and conditions.</li>
            <li><strong>IPO:</strong> Investment in IPOs involves risk. Past IPO listing gains do not guarantee future performance. Allotment is subject to regulatory processes and is not guaranteed.</li>
            <li><strong>Fixed Deposits:</strong> Returns on fixed deposits depend on the issuer's creditworthiness. Fixed deposits of companies are not guaranteed by any regulatory body.</li>
          </ul>
        </section>

        <section>
          <h2>8. SEBI Investor Charter</h2>
          <p>
            As per SEBI guidelines, investors are encouraged to deal only with SEBI-registered intermediaries. You can verify the registration status of any intermediary on the SEBI website at{" "}
            <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.sebi.gov.in
            </a>. 
            For investor grievances, you may lodge complaints on the SEBI SCORES portal at{" "}
            <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              scores.sebi.gov.in
            </a>.
          </p>
        </section>

        <section>
          <h2>9. AMFI Investor Awareness</h2>
          <p>
            For AMFI-related investor awareness information and to verify the registration of mutual fund distributors, please visit{" "}
            <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.amfiindia.com
            </a>.
          </p>
          <p className="mt-2">
            <strong>KYC is one-time exercise while dealing in securities markets.</strong> Once KYC is done through a SEBI-registered intermediary (broker, DP, mutual fund, etc.), you need not undergo the same process again when you approach another intermediary.
          </p>
        </section>

        <section>
          <h2>10. No Liability</h2>
          <p>
            To the fullest extent permitted by law, Balaji Nivesh, its proprietor(s), employees, associates, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to loss of profits, goodwill, data, or other intangible losses, arising out of or in connection with:
          </p>
          <ul>
            <li>Use or inability to use this website or any of its features.</li>
            <li>Any investment decision made based on information available on this website.</li>
            <li>Any errors, omissions, or inaccuracies in the content.</li>
            <li>Unauthorised access to or alteration of your data.</li>
          </ul>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            This Disclaimer shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [City, State], India.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-muted/50 p-6">
          <h2>Investor Helplines</h2>
          <ul className="space-y-2">
            <li><strong>SEBI Toll-Free Helpline:</strong> 1800 266 7575</li>
            <li><strong>SEBI SCORES (Complaints):</strong>{" "}
              <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">scores.sebi.gov.in</a>
            </li>
            <li><strong>AMFI:</strong>{" "}
              <a href="https://www.amfiindia.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.amfiindia.com</a>
            </li>
            <li><strong>SEBI:</strong>{" "}
              <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.sebi.gov.in</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Disclaimer;
