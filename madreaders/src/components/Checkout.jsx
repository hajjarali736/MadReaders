import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaEnvelope, FaShoppingBag, FaHome } from "react-icons/fa";
import { getCurrentUser } from "../auth/cognito";

export default function CheckoutConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "" } = location.state?.formData || {};

  const user = getCurrentUser();
  const userEmail = email || (user ? user.attributes?.email : "");

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <FaCheckCircle className="text-bg-gradient-to-r from-[#27374D] to-[#526D82] text-3xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Order Confirmed!</h1>
          <p className="text-indigo-100 mt-1">
            Thank you for your purchase
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <FaEnvelope className="text-green-600 text-3xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-100 rounded-full p-2">
                  <FaShoppingBag className="text-indigo-600 text-sm" />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Check your email
            </h2>
            <p className="text-gray-600 mt-2">
              We've sent order confirmation and shipping details to:
            </p>
            <p className="font-medium text-indigo-600 mt-1 break-all">
              {userEmail}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
              What's next?
            </h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Your order is being processed</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Shipping details will arrive soon</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track your order with the link in your email</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#27374D] to-[#526D82] text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FaHome className="mr-2" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a
              href="/contact"
              className="text-indigo-600 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}