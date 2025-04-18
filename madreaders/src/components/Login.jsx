import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import Header from './Header';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess("");
    setIsLoading(true);

    try {
      const success = await signIn(username, password);
      if (success) {
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage("Invalid username or password");
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Login failed. Please try again.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Fixed background elements */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <img
            key={i}
            src="/book1.jpg"
            alt={`Floating book ${i + 1}`}
            className={`floating-book float-book-${i + 1} w-12 opacity-30`}
          />
        ))}
      </div>

      <Header />

      {/* Main content area */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        {/* Error Popup */}
        {showErrorPopup && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-center">
              <h1 className="text-2xl font-bold text-white">
                Welcome To MadReaders
              </h1>
              <p className="text-indigo-100 mt-1">Sign in to your account</p>
            </div>

            <div className="p-8">
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="••••••••"
                    />
                    <div className="text-right mt-2">
                      <Link
                        to="/forgotpassword"
                        className="text-xs text-indigo-600 hover:text-indigo-500 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition duration-200 ${
                    isLoading ? "opacity-80" : ""
                  }`}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Sign up
                </Link>
              </p>
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