import { Layout } from "@/components/layouts/Layout";
import { CTASection } from "@/components/sections/CTASection";

export default function Privacy() {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="bg-white dark:bg-card p-8 rounded-lg shadow-md space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Introduction</h2>
                <p className="mb-3">
                  Shivanshi Enterprises ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website or interact with our business.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or using our website, you acknowledge 
                  that you have read, understood, and agree to be bound by all the terms outlined in this policy.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                <p className="mb-3">We may collect information about you in a variety of ways, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Data:</strong> When you fill out contact forms, request information, 
                    or place orders, we collect personal information such as your name, email address, 
                    phone number, company name, and address.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We may automatically collect information about your 
                    browsing actions and patterns when you visit our website, including pages visited, 
                    time spent on pages, and other statistical data.
                  </li>
                  <li>
                    <strong>Cookies:</strong> We use cookies to enhance your experience on our website. 
                    These are small files placed on your device that help us provide website functionality, 
                    understand site usage, and improve our services.
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
                <p className="mb-3">We may use the information we collect from you for various purposes, including to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders for chemicals and compounds</li>
                  <li>Respond to your inquiries and provide customer service</li>
                  <li>Provide you with information about our products and services</li>
                  <li>Improve our website, products, and customer experience</li>
                  <li>Send you marketing communications where permitted by law</li>
                  <li>Comply with legal obligations and business requirements</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Disclosure of Your Information</h2>
                <p className="mb-3">We may share your information in the following situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Business Partners:</strong> With trusted vendors, service providers, and 
                    business partners who assist us in operating our business and servicing you.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> To comply with applicable laws, regulations, 
                    legal processes, or governmental requests.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with any merger, sale of company assets, 
                    financing, or acquisition of all or a portion of our business.
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Security of Your Information</h2>
                <p>
                  We implement appropriate technical and organizational measures to maintain the safety 
                  of your personal information. However, please be aware that no method of transmission 
                  over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute 
                  security of your data.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
                <p className="mb-3">Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access personal information we hold about you</li>
                  <li>The right to request correction of inaccurate information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. The updated version will be 
                  indicated by an updated "Revised" date. We encourage you to review this Privacy Policy 
                  frequently to stay informed about how we are protecting your information.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our privacy 
                  practices, please contact us at:
                </p>
                <div className="mt-3">
                  <p><strong>Shivanshi Enterprises</strong></p>
                  <p>Email: shivanshienterprises44@gmail.com</p>
                  <p>Phone: +91 1234567890</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <CTASection />
    </Layout>
  );
} 