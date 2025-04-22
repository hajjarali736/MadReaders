import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaEnvelope,
  FaShoppingBag,
  FaHome,
  FaTruck,
} from "react-icons/fa";
import { getCurrentUser } from "../auth/cognito";

export default function CheckoutConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "" } = location.state?.formData || {};
  const [progress, setProgress] = useState(0);

  const user = getCurrentUser();
  const userEmail = email || (user ? user.attributes?.email : "");

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Animation timeline
    const animationDuration = 6000; // 6 seconds in milliseconds
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercentage = Math.min(elapsed / animationDuration, 1);

      // Different easing functions for different phases
      let easedProgress;
      if (progressPercentage < 0.3) {
        // Fast start (easeOutQuad)
        easedProgress = progressPercentage * (2 - progressPercentage);
      } else if (progressPercentage < 0.7) {
        // Slow middle (easeInQuad)
        easedProgress = progressPercentage * progressPercentage;
      } else {
        // Normal finish (linear)
        easedProgress = progressPercentage;
      }

      setProgress(easedProgress * 100);

      if (progressPercentage < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    requestAnimationFrame(animateProgress);

    return () => {
      // Cleanup if component unmounts
    };
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
            Your order is confirmed. It will arrive in 3-5 days.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <FaHome className="text-green-600 text-3xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-100 rounded-full p-2">
                  <FaShoppingBag className="text-indigo-600 text-sm" />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              The order will take 3-5 days
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

          {/* Progress Bar - Simplified */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Delivery Status
            </h3>
            <div className="flex items-center">
              <FaTruck className="mr-2 text-indigo-600 text-2xl" />
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
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
            <a href="/contact" className="text-indigo-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
