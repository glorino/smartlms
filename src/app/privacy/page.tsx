import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SITE_CONFIG } from "@/lib/constants";

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {currentDate}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p>
              At {SITE_CONFIG.name}, we are committed to protecting your
              privacy and personal information. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information
              when you visit our platform at{" "}
              <a href={SITE_CONFIG.url}>{SITE_CONFIG.url}</a> and use our
              services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree
              with the terms of this Privacy Policy, you are expressly
              prohibited from using the Platform.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> When you register, we
                collect your name, email address, and password.
              </li>
              <li>
                <strong>Profile Information:</strong> You may optionally provide
                additional information such as your bio, profile picture, country,
                and language preference.
              </li>
              <li>
                <strong>Payment Information:</strong> When you purchase a
                subscription or course, we process payment through our payment
                partners. We do not store your payment card details directly.
              </li>
              <li>
                <strong>Content:</strong> We collect any content you submit
                through the Platform, including course reviews, questions,
                answers, and notes.
              </li>
              <li>
                <strong>Communications:</strong> We collect information when you
                contact us for support or otherwise communicate with us.
              </li>
            </ul>

            <h2>2. Information We Collect Automatically</h2>
            <p>
              We and our service providers may automatically collect information
              about your device and usage of the Platform, including:
            </p>
            <ul>
              <li>
                <strong>Log Data:</strong> IP address, browser type, operating
                system, referral URL, access times, and pages viewed.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies and
                similar tracking technologies to collect information about your
                interactions with the Platform.
              </li>
              <li>
                <strong>Analytics:</strong> We use analytics services to
                understand how users interact with the Platform.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Platform;</li>
              <li>Process transactions and send related information;</li>
              <li>Send you technical notices, updates, and support messages;</li>
              <li>Send you marketing communications (if opted in);</li>
              <li>Respond to your requests and inquiries;</li>
              <li>Monitor and analyze platform usage;</li>
              <li>Detect fraud and ensure security;</li>
              <li>Comply with legal obligations.</li>
            </ul>

            <h2>4. Legal Basis for Processing (GDPR)</h2>
            <p>
              If you are located in the European Economic Area, we process
              your information based on the following legal grounds:
            </p>
            <ul>
              <li>
                <strong>Contract performance:</strong> To provide the Platform
                and fulfill our agreement with you.
              </li>
              <li>
                <strong>Legitimate interests:</strong> To improve the Platform,
                ensure security, and prevent fraud.
              </li>
              <li>
                <strong>Consent:</strong> Where you have explicitly consented
                (e.g., marketing communications).
              </li>
              <li>
                <strong>Legal obligation:</strong> To comply with applicable laws.
              </li>
            </ul>

            <h2>5. Data Sharing and Disclosure</h2>
            <p>
              We do not sell or trade your personally identifiable information.
              We may share your information with:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who
                assist us in operating the Platform (payment processors, email
                providers, analytics services).
              </li>
              <li>
                <strong>Instructors:</strong> If you are a student, your name
                and email may be visible to instructors for course communication.
              </li>
              <li>
                <strong>Legal Compliance:</strong> When required by law or to
                protect our rights, property, or safety.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger,
                acquisition, or sale of assets.
              </li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active
              or as needed to provide the Platform. If you close your account, we
              will retain certain information for legitimate business purposes,
              such as completing transactions and complying with legal
              requirements.
            </p>

            <h2>7. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access, correct, or delete your personal information;</li>
              <li>Restrict or object to certain processing;</li>
              <li>Data portability (receive your data in a structured format);</li>
              <li>Withdraw consent (where applicable);</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`}>
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>

            <h2>8. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information. This includes encryption (TLS),
              secure servers, and access controls. However, no method of
              transmission over the internet is completely secure, and we cannot
              guarantee absolute security.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              The Platform is hosted in Nigeria and intended for users in
              Nigeria and other countries. By using the Platform, you consent to
              the transfer of your information to Nigeria and other
              jurisdictions where data protection laws may differ.
            </p>

            <h2>10. Third-Party Links and Services</h2>
            <p>
              The Platform may contain links to third-party websites or
              services (including payment processors like Flutterwave, and
              social media platforms). We are not responsible for the privacy
              practices of these third parties. We encourage you to review the
              privacy policies of any third-party services you use.
            </p>

            <h2>11. Children's Privacy</h2>
            <p>
              The Platform is not intended for individuals under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If we become aware that we have collected information
              from a child under 13, we will take steps to delete it promptly.
            </p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date. Your continued use
              of the Platform after any changes constitutes acceptance of the
              updated Privacy Policy.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, the practices
              of the Platform, or your dealings with us, please contact us at:
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`}>
                {SITE_CONFIG.contact.email}
              </a>
              <br />
              Address: {SITE_CONFIG.contact.address}
              <br />
              Phone: {SITE_CONFIG.contact.phone}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
