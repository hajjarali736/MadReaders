import { Link } from "react-router-dom";
import Header from "./Header";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100 pt-16">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#27374D] to-[#526D82] p-5 text-center">
              <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
              <p className="text-indigo-100 text-sm mt-1">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-sm max-w-none">
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Introduction</h2>
                  <p className="text-gray-600 mb-4">
                    At MadReaders, we respect your privacy and are committed to protecting your personal data. 
                    This privacy policy will inform you about how we look after your personal data when you visit 
                    our website and tell you about your privacy rights.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Data We Collect</h2>
                  <p className="text-gray-600 mb-2">
                    We may collect, use, store and transfer different kinds of personal data about you:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                    <li><strong>Identity Data:</strong> First name, last name, username</li>
                    <li><strong>Contact Data:</strong> Email address, phone number</li>
                    <li><strong>Profile Data:</strong> Username, password, preferences</li>
                    <li><strong>Usage Data:</strong> How you use our website and services</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
                  <p className="text-gray-600 mb-2">
                    We will only use your personal data when the law allows us to. Most commonly, we will use your data to:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                    <li>Provide and maintain our service</li>
                    <li>Notify you about changes to our service</li>
                    <li>Allow you to participate in interactive features</li>
                    <li>Provide customer support</li>
                    <li>Gather analysis to improve our service</li>
                    <li>Monitor usage of our service</li>
                    <li>Detect and prevent technical issues</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Data Security</h2>
                  <p className="text-gray-600 mb-4">
                    We have implemented appropriate security measures to prevent your personal data from being 
                    accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit 
                    access to your personal data to those employees and partners who have a business need to know.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Data Retention</h2>
                  <p className="text-gray-600 mb-4">
                    We will only retain your personal data for as long as necessary to fulfill the purposes 
                    we collected it for, including for the purposes of satisfying any legal, accounting, or 
                    reporting requirements.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Your Legal Rights</h2>
                  <p className="text-gray-600 mb-2">
                    Under certain circumstances, you have rights under data protection laws in relation to your personal data:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                    <li>Request access to your personal data</li>
                    <li>Request correction of your personal data</li>
                    <li>Request erasure of your personal data</li>
                    <li>Object to processing of your personal data</li>
                    <li>Request restriction of processing your personal data</li>
                    <li>Request transfer of your personal data</li>
                    <li>Right to withdraw consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Contact Us</h2>
                  <p className="text-gray-600">
                    If you have any questions about this Privacy Policy, please contact us at 
                    <a href="mailto:privacy@madreaders.com" className="text-indigo-600 hover:underline ml-1">
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