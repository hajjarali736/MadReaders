import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login, confirmUser, getCurrentUser } from "../auth/cognito";
import "../styles/Login.css";
import Header from "./Header";

export default function SignUpPage() {
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/");
    }
  }, []);

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
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [success, setSuccess] = useState(false);

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

      if (!user) {
        setError("❌ Registration failed");
        setIsLoading(false);
        return;
      }

      // ✅ Add to MongoDB right after Cognito register
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: username,
          Name: `${firstName} ${lastName}`,
          Email: email,
          PhoneNumber: "00000000",
          Address: "Not Provided",
          Role: "user",
        }),
      });

      const db = await res.json();
      if (db.sucess == false) {
        setError("⚠️ Registered but failed saving to DB: " + db.message);
        setIsLoading(false);
        return;
      }

      setIsConfirming(true); // ✅ Show confirmation form now
    } catch (err) {
      setError("❌ Something went wrong: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#DDE6ED]">
      <Header />

      {/* Error message positioned below header at top right */}
      {error && (
        <div className="fixed top-24 right-4 z-50 error-popup">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg flex items-center">
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
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-600 focus:outline-none"
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
      )}

      {/* Fixed background elements */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <img
            key={i}
            src="/book1.jpg"
            alt={`Floating book ${i + 1}`}
            className={`floating-book float-book-${i + 1} w-12 opacity-15`}
          />
        ))}
      </div>

      {/* Main content area */}
      <main className="flex-grow flex items-center justify-center p-4 relative z-10 mt-">
        {isConfirming && (
          <div className="p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-center mb-4">
              Confirm Your Email
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              We've sent a 6-digit code to <strong>{formData.email}</strong>.
            </p>
            <input
              type="text"
              placeholder="Enter verification code"
              className="form-input w-full px-4 py-3 rounded-lg border border-gray-300 mb-4"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            {error && (
              <p className="text-sm text-red-600 text-center mb-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 text-center mb-2">
                ✅ Your email is confirmed and you're now logged in!
              </p>
            )}

            <button
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                setError("");
                try {
                  const confirmed = await confirmUser(
                    formData.username,
                    confirmationCode
                  );
                  if (!confirmed) {
                    setError("❌ Wrong code or expired.");
                    return;
                  }

                  // ✅ Optional: login again after confirming
                  await login(formData.username, formData.password);

                  navigate("/"); // ✅ All good
                } catch (err) {
                  setError("❌ Confirmation failed: " + err.message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className={`w-full px-6 py-3 rounded-lg transition text-white ${
                isLoading ? "bg-gray-400" : "bg-[#27374D] hover:bg-[#526D82]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Confirming...
                </span>
              ) : success ? (
                "✅ Confirmed!"
              ) : (
                "Confirm Email"
              )}
            </button>
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 text-center">
              <h1 className="text-2xl font-bold text-white">Join MadReaders</h1>
              <p className="text-gray-200 mt-1">Step {currentStep} of 3</p>
            </div>

            <div className="p-8">
              <form
                onSubmit={
                  currentStep === 3 ? handleSubmit : (e) => e.preventDefault()
                }
                className="space-y-6"
              >
                {/* Step 1: Account Info */}
                {!isConfirming && currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        At least 6 characters with 1 uppercase, 1 lowercase, and
                        1 number
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Info */}
                {!isConfirming && currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="birthdate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Birthdate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {!isConfirming && currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#27374D] focus:ring-2 focus:ring-[#526D82]/20 outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-4 mt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 rounded-lg text-[#27374D] font-medium border-2 border-[#27374D] hover:bg-[#27374D] hover:text-white transition duration-200 flex-1"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="login-button px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#27374D] to-[#526D82] hover:from-[#27374D]/90 hover:to-[#526D82]/90 transition duration-200 flex-1"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`login-button px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#27374D] to-[#526D82] hover:from-[#27374D]/90 hover:to-[#526D82]/90 transition duration-200 flex-1 ${
                        isLoading ? "opacity-80" : ""
                      }`}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                  )}
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#27374D] font-medium hover:text-[#526D82] transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
