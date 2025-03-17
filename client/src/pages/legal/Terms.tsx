import { Layout } from "@/components/layouts/Layout";
import { CTASection } from "@/components/sections/CTASection";

export default function Terms() {
  return (
    <Layout>
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            
            <div className="bg-white dark:bg-card p-8 rounded-lg shadow-md space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Introduction</h2>
                <p className="mb-3">
                  Welcome to Shivanshi Enterprises. These Terms of Service ("Terms") govern your access to and use of our website,
                  products, and services. Please read these Terms carefully before using our services.
                </p>
                <p>
                  By accessing or using our website, ordering our products, or engaging with our services, you agree to be bound
                  by these Terms. If you do not agree with any part of these Terms, you may not use our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Products and Services</h2>
                <p className="mb-3">
                  Shivanshi Enterprises is a supplier of chemicals and compounds for various industrial, research, and commercial purposes.
                  Our product information, including specifications, applications, and safety data, is provided for informational purposes only.
                </p>
                <p>
                  We strive to ensure that all product descriptions, prices, and availability information are accurate and up to date.
                  However, we reserve the right to correct any errors, inaccuracies, or omissions and to change or update information without prior notice.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Ordering and Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    All orders placed through our website or other channels are subject to our acceptance and availability of products.
                  </li>
                  <li>
                    Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any
                    product or service without notice at any time.
                  </li>
                  <li>
                    Payment terms, including acceptable payment methods, will be specified during the ordering process or in separate agreements.
                  </li>
                  <li>
                    For business customers, we may offer credit terms subject to our credit approval process and separate credit agreements.
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Shipping and Delivery</h2>
                <p className="mb-3">
                  We ship our products throughout India. Delivery times and shipping costs will vary based on location, 
                  order size, and chosen shipping method. Specific delivery information will be provided during the ordering process.
                </p>
                <p>
                  Due to the regulated nature of some chemical products, special shipping arrangements, documentation, or restrictions may apply.
                  We will inform you of any special requirements before finalizing your order.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Product Safety and Compliance</h2>
                <p className="mb-3">
                  Our chemicals and compounds are intended for use by knowledgeable individuals or businesses familiar with proper
                  handling procedures and safety precautions for chemical substances.
                </p>
                <p className="mb-3">
                  By purchasing our products, you acknowledge that you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Will use the products in compliance with all applicable laws and regulations</li>
                  <li>Have reviewed and understand the safety data sheets (SDS) provided with the products</li>
                  <li>Will implement appropriate safety measures when handling, storing, and using our products</li>
                  <li>Will properly dispose of any unused products and containers in accordance with local regulations</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
                <p className="mb-3">
                  To the maximum extent permitted by law, Shivanshi Enterprises shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, including but not limited to, loss of profits, data, or business opportunities,
                  resulting from your use of our products or services.
                </p>
                <p>
                  Our liability is limited to the purchase price of the specific product or service that is the subject of the claim.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
                <p>
                  All content on our website, including text, graphics, logos, images, product descriptions, and software, is the property
                  of Shivanshi Enterprises or our content suppliers and is protected by Indian and international copyright, trademark, and other
                  intellectual property laws. You may not reproduce, distribute, display, sell, or otherwise use our intellectual property
                  without our prior written permission.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these
                  Terms shall be subject to the exclusive jurisdiction of the courts in Prayagraj, Uttar Pradesh, India.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website.
                  Your continued use of our services after any changes indicates your acceptance of the modified Terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                <p>
                  If you have any questions or concerns about these Terms, please contact us at:
                </p>
                <div className="mt-3">
                  <p><strong>Shivanshi Enterprises</strong></p>
                  <p>Email: shivanshienterprises44@gmail.com</p>
                  <p>Phone: +91 9418974444</p>
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