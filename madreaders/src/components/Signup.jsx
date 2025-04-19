import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login } from "../auth/cognito";
import "../styles/Login.css";
import Header from "./Header";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    birthdate: "",
    gender: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
      isValid: hasLowercase && hasUppercase && hasNumber,
      message: !hasLowercase
        ? "At least one lowercase letter required"
        : !hasUppercase
        ? "At least one uppercase letter required"
        : "At least one number required",
    };
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.username.trim()) {
        setError("Please enter a username");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must at least 6 characters");
        return false;
      }

      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setError(`Invalid password format: ${passwordValidation.message}`);
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.birthdate) {
        setError("Please enter your birthdate");
        return false;
      }
      if (!formData.gender) {
        setError("Please select your gender");
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.firstName.trim()) {
        setError("Please enter your first name");
        return false;
      }
      if (!formData.lastName.trim()) {
        setError("Please enter your last name");
        return false;
      }
      if (!formData.email.includes("@") || !formData.email.includes(".")) {
        setError("Please enter a valid email");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateStep()) return;

    setIsLoading(true);
    try {
      const {
        username,
        password,
        email,
        firstName,
        lastName,
        birthdate,
        gender,
      } = formData;
      const user = await register(
        username,
        password,
        birthdate,
        gender,
        firstName,
        lastName,
        email
      );

      const userData = {
        Name: `${formData.firstName} ${formData.lastName}`,
        Email: formData.email,
        PhoneNumber: "", // Not collected in form
        Address: "", // Not collected in form
        Role: "user", // Default role
        CreatedAt: new Date(),
      };

      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log("✅ User created:", data);
      if (user) {
        // If registration is successful, navigate to home
        const curr = login(username, password);
        setTimeout(() => navigate("/"), 1000);
        if (curr) {
          navigate("/");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Error message positioned below header at top right */}
      {error && (
        <div className="fixed top-24 right-4 z-50">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-xs">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError("")}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-5 p-5 text-center">
              <h1 className="text-xl font-bold text-white">Join MadReaders</h1>
              <p className="text-indigo-100 text-sm mt-1">
                Step {currentStep} of 3
              </p>
            </div>

            <div className="p-6">
              <form
                onSubmit={
                  currentStep === 3 ? handleSubmit : (e) => e.preventDefault()
                }
              >
                {/* Step 1: Account Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        placeholder="coolreader123"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        placeholder="••••••"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        At least 6 characters with 1 uppercase, 1 lowercase, and
                        1 number
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Birthdate *
                      </label>
                      <input
                        name="birthdate"
                        type="date"
                        required
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        placeholder="Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Back
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto px-4 py-2 rounded text-white text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`ml-auto px-4 py-2 rounded text-white text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition ${
                        isLoading ? "opacity-80" : ""
                      }`}
                    >
                      {isLoading ? "Creating account..." : "Complete Sign Up"}
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-4 text-center text-xs text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-medium">
                  Sign in
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-indigo-600">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} MadReaders Bookstore. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
