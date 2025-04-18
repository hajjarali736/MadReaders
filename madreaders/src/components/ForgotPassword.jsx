import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import Header from './Header';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call with proper error handling
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate API response
          if (email) {
            resolve({ 
              success: true,
              message: "Password reset link sent successfully"
            });
          } else {
            reject(new Error("Email is required"));
          }
        }, 1000);
      });

      // Handle successful response
      if (response.success) {
        setSuccess(response.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.message || "Failed to send reset link");
      }
      
    } catch (err) {
      // Handle different error types
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to send reset link. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Fixed background elements */}
      <div className="fixed inset-0 overflow-visible z-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <img
            key={i}
            src="/book1.jpg" 
            alt=""
            className={`floating-book float-book-${i + 1} w-12 opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <Header />

      {/* Main content area */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-center">
              <h1 className="text-xl font-bold text-white">Reset Password</h1>
              <p className="text-indigo-100 text-sm mt-1">Enter your email to continue</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r text-sm">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-r text-sm">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                    placeholder="you@example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll send a password reset link to this email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition ${isLoading ? "opacity-80" : ""}`}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - now properly positioned at bottom */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}