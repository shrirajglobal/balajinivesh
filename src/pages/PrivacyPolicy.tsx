const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 7, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Balaji Nivesh ("we", "us", or "our"), an AMFI-registered Mutual Fund Distributor (ARN – XXXXXX), is committed to protecting the privacy of individuals who visit our website and use our services. This Privacy Policy explains how we collect, use, store, and disclose your personal information in compliance with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, as well as applicable SEBI and AMFI guidelines.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect the following categories of information:</p>
          <ul>
            <li><strong>Personal Identification Information:</strong> Name, email address, phone number, postal address, date of birth, PAN number (when required for KYC), and other details you provide voluntarily.</li>
            <li><strong>Financial Information:</strong> Investment preferences, risk profile responses, and goal-planning data entered into our calculators and assessment tools. We do <strong>not</strong> collect bank account details, credit/debit card numbers, or payment credentials through this website.</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device identifiers, pages visited, and interaction data collected via cookies and analytics tools.</li>
            <li><strong>Communication Records:</strong> Correspondence via contact forms, emails, or phone calls.</li>
          </ul>
        </section>

        <section>
          <h2>3. Purpose of Data Collection</h2>
          <p>Your information is used solely for the following purposes:</p>
          <ul>
            <li>To facilitate mutual fund distribution services and related financial product distribution.</li>
            <li>To complete KYC verification as mandated by SEBI, AMFI, and the Prevention of Money Laundering Act (PMLA), 2002.</li>
            <li>To provide personalised financial education content, calculators, and assessment tools.</li>
            <li>To communicate with you regarding your enquiries, transactions, and service updates.</li>
            <li>To issue certificates and process gift claims under our education programmes.</li>
            <li>To comply with regulatory and legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing & Disclosure</h2>
          <p>We do <strong>not</strong> sell, rent, or trade your personal information. We may share your data with:</p>
          <ul>
            <li><strong>Asset Management Companies (AMCs)</strong> and Registrar & Transfer Agents (RTAs) such as CAMS and KFintech for processing your mutual fund transactions.</li>
            <li><strong>KYC Registration Agencies (KRAs)</strong> for identity verification as per SEBI regulations.</li>
            <li><strong>Regulatory bodies</strong> (SEBI, AMFI, Income Tax Department, Financial Intelligence Unit) when required by law.</li>
            <li><strong>Service providers</strong> assisting us with website hosting, email delivery, and analytics — bound by confidentiality agreements.</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement reasonable security practices and procedures as required under the IT Act, 2000 and its Rules. These include encryption of data in transit (SSL/TLS), secure cloud infrastructure, access controls, and periodic security reviews. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable laws and regulations. SEBI and AMFI guidelines may require us to retain certain records for a minimum period even after termination of the client relationship.
          </p>
        </section>

        <section>
          <h2>7. Cookies & Tracking</h2>
          <p>
            Our website may use cookies and similar tracking technologies for analytics and functionality. You may configure your browser to reject cookies; however, this may limit certain features of the website. We do not use cookies for targeted advertising.
          </p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review the personal information we hold about you.</li>
            <li>Request correction of inaccurate or incomplete data.</li>
            <li>Withdraw consent for data processing (subject to legal and regulatory requirements).</li>
            <li>Request deletion of your data where not restricted by regulatory retention requirements.</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, please contact us at the details provided below.</p>
        </section>

        <section>
          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites including AMC portals, AMFI India, SEBI, and other regulatory bodies. We are not responsible for the privacy practices of these third-party websites and encourage you to review their individual privacy policies.
          </p>
        </section>

        <section>
          <h2>10. Children's Privacy</h2>
          <p>
            Our financial education section for children is designed for educational purposes only. We do not knowingly collect personal information from children under the age of 18 without verifiable parental consent. If we become aware of such collection, we will take steps to delete the information promptly.
          </p>
        </section>

        <section>
          <h2>11. Grievance Officer</h2>
          <p>
            In accordance with the Information Technology Act, 2000, the name and contact details of our Grievance Officer are provided below for any complaints or concerns regarding data privacy:
          </p>
          <p className="mt-2">
            <strong>Grievance Officer:</strong> [Name of Grievance Officer]<br />
            <strong>Email:</strong> info@balajinivesh.com<br />
            <strong>Phone:</strong> +91 XXXXX XXXXX<br />
            <strong>Address:</strong> Your Office Address, City, State, India
          </p>
        </section>

        <section>
          <h2>12. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with the updated date. Continued use of the website after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            For any questions or concerns about this Privacy Policy, please contact us at:<br />
            <strong>Email:</strong> info@balajinivesh.com<br />
            <strong>Phone:</strong> +91 XXXXX XXXXX
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
