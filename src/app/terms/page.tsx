import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { SITE_CONFIG } from "@/lib/constants";

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: {currentDate}
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p>
              Welcome to {SITE_CONFIG.name}. These Terms of Service ("Terms")
              govern your access to and use of {SITE_CONFIG.name}
              ("Platform"), operated by {SITE_CONFIG.name} ("we," "us," or "our").
              By accessing or using the Platform, you agree to be bound by these Terms.
              Please read them carefully before using our services.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Platform, you confirm that you are at
              least 13 years old (or the age of majority in your jurisdiction,
              whichever is higher) and that you have the legal capacity to
              enter into this agreement. If you are under 18, you may only use
              the Platform under the supervision of a parent or guardian who
              agrees to these Terms on your behalf.
            </p>

            <h2>2. Account Registration and Security</h2>
            <p>
              To access certain features of the Platform, you must register for
              an account. You agree to provide accurate, current, and complete
              information during registration and to update such information
              promptly as it changes. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>
            <p>
              You must notify us immediately of any unauthorized use of your
              account or any other breach of security. We will not be liable for
              any loss or damage arising from your failure to comply with these
              requirements.
            </p>

            <h2>3. Subscription and Payment Terms</h2>
            <p>
              Some features of the Platform are available via paid subscription
              ("Pro Plan") or enterprise licensing. By subscribing, you agree to
              the pricing and billing terms disclosed at the time of purchase or
              available in your account settings. We accept payment via
              Flutterwave and other payment processors.
            </p>
            <p>
              All payments are charged in Nigerian Naira (₦) and are
              non-refundable except as required by applicable law or as stated
              in our Refund Policy. Subscriptions automatically renew unless
              cancelled before the renewal date.
            </p>

            <h2>4. License Grant</h2>
            <p>
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, revocable license to access and use the Platform
              for your personal or internal business purposes. This license does
              not include:
            </p>
            <ul>
              <li>Any resale or commercial exploitation of the Platform;</li>
              <li>Any collection or aggregation of content from the Platform;</li>
              <li>Any use that violates applicable laws or regulations;</li>
              <li>Any attempt to reverse engineer or interfere with the Platform;</li>
            </ul>

            <h2>5. User Content and Conduct</h2>
            <p>
              You are solely responsible for any content you post, upload, or
              otherwise make available through the Platform ("User Content").
              You agree not to post any content that is unlawful, defamatory,
              infringing, harassing, or otherwise objectionable.
            </p>
            <p>
              By posting User Content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, modify, and distribute
              such content solely as necessary to provide the Platform's
              features.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              The Platform, including all content, graphics, logos, and
              software, is the property of {SITE_CONFIG.name} or its licensors
              and is protected by copyright, trademark, and other intellectual
              property laws. No license or right is granted to you to use any
              trademarks or content without our express written permission.
            </p>

            <h2>7. Course Content and Completion</h2>
            <p>
              Course content is provided by instructors and third-party
              contributors. While we strive to ensure accuracy, we do not
              guarantee that any content will be complete, accurate, or
              suitable for any particular purpose. We are not responsible for
              the quality, accuracy, or completeness of user-generated or
              instructor-provided content.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL
              WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM WILL BE
              UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
              {SITE_CONFIG.name} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, USE,
              REVENUE, OR PROFITS, ARISING OUT OF OR IN CONNECTION WITH THESE
              TERMS, THE PLATFORM, OR YOUR USE THEREOF, WHETHER BASED ON WARRANTY,
              CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY.
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE
              AMOUNT PAID BY YOU, IF ANY, DURING THE 12 MONTHS IMMEDIATELY
              PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
            </p>

            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Platform
              immediately, without prior notice or liability, for any reason
              whatsoever, including if you breach these Terms. Upon termination,
              your right to use the Platform will cease immediately.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time
              at our sole discretion. If a revision is material, we will notify
              you by email or through the Platform. Your continued use of the
              Platform after any changes constitutes acceptance of the new Terms.
            </p>

            <h2>12. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by the laws of Nigeria, without
              regard to its conflict of law principles. Any dispute arising out
              of or in connection with these Terms shall be resolved by the
              courts of Lagos, Nigeria, and both parties submit to the
              exclusive jurisdiction of those courts.
            </p>

            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href={`mailto:${SITE_CONFIG.contact.email}`}>
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
