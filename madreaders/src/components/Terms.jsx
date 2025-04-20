import { Link } from "react-router-dom";
import Header from "./Header";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100 pt-16">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 ">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#27374D] to-[#526D82] p-5 text-center">
              <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
              <p className="text-indigo-100 text-sm mt-1">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-sm max-w-none">
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 mb-4">
                    Welcome to MadReaders! By accessing or using our services, you agree to be bound by these Terms of Service. 
                    If you do not agree to all the terms, please do not use our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">2. User Accounts</h2>
                  <p className="text-gray-600 mb-2">
                    To access certain features, you may need to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Be at least 13 years of age</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Content and Conduct</h2>
                  <p className="text-gray-600 mb-2">
                    You are responsible for all content you post on our platform. You agree not to:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                    <li>Post illegal, harmful, or offensive content</li>
                    <li>Violate intellectual property rights</li>
                    <li>Use our services for any unlawful purpose</li>
                    <li>Interfere with the operation of our services</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Purchases and Payments</h2>
                  <p className="text-gray-600 mb-4">
                    All purchases are subject to availability. We reserve the right to refuse or cancel orders. 
                    Prices are subject to change without notice. Payment must be received before order fulfillment.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Termination</h2>
                  <p className="text-gray-600 mb-4">
                    We may terminate or suspend your account immediately, without prior notice, for any reason, 
                    including without limitation if you breach these Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Changes to Terms</h2>
                  <p className="text-gray-600 mb-4">
                    We reserve the right to modify these terms at any time. We will notify you of any changes by 
                    posting the new Terms on this page. Changes are effective immediately upon posting.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Contact Us</h2>
                  <p className="text-gray-600">
                    If you have any questions about these Terms, please contact us at 
                    <a href="mailto:legal@madreaders.com" className="text-indigo-600 hover:underline ml-1">
                      support@madreaders.com
                    </a>.
                  </p>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded text-white text-sm font-medium bg-gradient-to-r from-[#27374D] to-[#526D82] hover:from-indigo-700 hover:to-blue-600 transition inline-block"
                >
                  Back to Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}