import { useSiteSettings } from "@/hooks/useSiteSettings";

const CommissionDisclosure = () => {
  const { data: settings } = useSiteSettings();
  const rawArn = settings?.map.arn_number || "173142";
  const arnNumber = rawArn.replace(/^ARN[-\s]*/i, "");
  const arnHolder = settings?.map.arn_holder_name || "Balaji Nivesh Private Limited";
  const contactEmail = settings?.map.contact_email || "info@balajinivesh.com";
  const contactPhone = settings?.map.contact_phone || "+91 93300 79717";

  return (
    <div className="container max-w-4xl py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Commission Disclosure</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 7, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h2>Regulatory Status</h2>
          <p>
            <strong>{arnHolder}</strong> (ARN-{arnNumber}) is an <strong>AMFI Registered Mutual Fund Distributor</strong>. We distribute <strong>regular plans</strong> of mutual fund schemes and receive commission from Asset Management Companies (AMCs) for the assets mobilised and retained through us. We do not charge investors any separate fee for distribution services.
          </p>
          <p className="mt-3">
            We are <strong>not</strong> a SEBI-registered Investment Adviser under the SEBI (Investment Advisers) Regulations, 2013, nor a SEBI-registered Research Analyst under the SEBI (Research Analysts) Regulations, 2014, nor a SEBI-registered Portfolio Manager under the SEBI (Portfolio Managers) Regulations, 2020.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2>How Distributor Commissions Work</h2>
          <p>
            Under SEBI's all-trail commission framework, AMCs pay distributors a <strong>trail commission</strong> — a small annual percentage of the value of your investments, calculated on daily average assets and paid periodically for as long as you stay invested through us. Trail commission is paid by the AMC out of the scheme's total expense ratio (TER); it is <strong>not deducted separately from your investment amount</strong>.
          </p>
          <p className="mt-3">
            There is no entry load, and upfront commissions stand discontinued as per SEBI regulations. The exact rates applicable to any scheme you hold or are considering will be shared on request. Scheme-wise commission structures are also disclosed by AMFI on its website under distributor commission disclosures.
          </p>
        </section>

        <section>
          <h2>Illustrative Commission Structure</h2>
          <p>
            The table below shows <strong>indicative, industry-level ranges</strong> only. Actual commission rates vary by scheme, AMC, and plan type and will be disclosed to you before investment on request.
          </p>

          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-muted text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Fund Type</th>
                  <th className="px-4 py-3 font-semibold">Upfront Brokerage / Commission</th>
                  <th className="px-4 py-3 font-semibold">Trail Brokerage / Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-muted/40">
                  <td colSpan={3} className="px-4 py-2 text-center font-semibold text-foreground">Equity Schemes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Equity Fund</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 1.60%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">ELSS Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 1.75%</td>
                </tr>
                <tr className="bg-muted/40">
                  <td colSpan={3} className="px-4 py-2 text-center font-semibold text-foreground">Index Schemes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Index Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 0.70%</td>
                </tr>
                <tr className="bg-muted/40">
                  <td colSpan={3} className="px-4 py-2 text-center font-semibold text-foreground">Hybrid Schemes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Asset Allocation Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 1.65%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Arbitrage Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 0.70%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Hybrid Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 1.60%</td>
                </tr>
                <tr className="bg-muted/40">
                  <td colSpan={3} className="px-4 py-2 text-center font-semibold text-foreground">Debt Schemes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Gilt Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 1.05%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Income &amp; Bond Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 0.70%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Short Term Funds</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 0.85%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5">Liquid, Money Market &amp; Floating Rate</td>
                  <td className="px-4 py-2.5">0%</td>
                  <td className="px-4 py-2.5">0.00% to 0.70%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Your Rights as an Investor</h2>
          <ul>
            <li>You may ask us, at any time, for the exact commission we earn on any scheme recommended to you — we will disclose it before you invest.</li>
            <li>You are free to invest in <strong>direct plans</strong> of mutual fund schemes, which carry no distributor commission and have a lower expense ratio, directly with the AMC or through other platforms. Direct plans do not include our distribution and support services.</li>
            <li>Your account statements from the AMC/RTA reflect the scheme, plan, and applicable expense ratios of your holdings.</li>
            <li>We may receive different commissions from different AMCs for similar schemes. We are required to — and do — recommend schemes based on your suitability, not on the commission payable to us, in line with the AMFI Code of Conduct.</li>
          </ul>
        </section>

        <section>
          <h2>Other Disclosures</h2>
          <ul>
            <li>{arnHolder} does not receive any consideration by way of remuneration or reward from investors.</li>
            <li>We may, from time to time, participate in training or business development programs organised by AMCs.</li>
            <li>For SIF, AIF and PMS products, distribution commission structures differ from mutual fund trail commission and are governed by the respective SEBI regulations and the terms agreed with the fund house or portfolio manager. These are disclosed to you in the product documents before you invest.</li>
            <li>Aggregate commission details, where required, are disclosed in the Consolidated Account Statement (CAS) sent to investors as per SEBI regulations.</li>
          </ul>
        </section>

        <section>
          <h2>Request for Scheme-wise Commission Details</h2>
          <p>
            In line with SEBI and AMFI requirements, investors may request scheme-wise commission details from us. To obtain this information, please write to us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-primary hover:underline"
            >
              {contactEmail}
            </a>{" "}
            or call us at{" "}
            <a
              href={`tel:${contactPhone.replace(/\s/g, "")}`}
              className="text-primary hover:underline"
            >
              {contactPhone}
            </a>.
          </p>
        </section>

        <section className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
          <h2>Standard AMFI/SEBI Disclaimer</h2>
          <p className="font-semibold text-foreground">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
          </p>
          <p className="mt-3">
            Past performance is not indicative of future returns. The NAV of mutual fund units may go up or down based on market conditions. There is no assurance or guarantee that the objectives of any mutual fund scheme will be achieved.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CommissionDisclosure;
