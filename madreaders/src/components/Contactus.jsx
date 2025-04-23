import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheck,
  FaClock,
  FaBookOpen,
} from "react-icons/fa";
import Header from "./Header";
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch {
      setErrors({
        ...errors,
        submit:
          "There was a problem sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Background with Book Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1589998059171-988d887df646')",
            backgroundAttachment: "fixed", // for parallax effect
            willChange: "transform", // performance optimization
          }}
        ></div>
        {/* Fun Book Elements Floating */}
        <div className="absolute top-1/4 left-1/5 text-6xl text-indigo-200 animate-float">
          <FaBookOpen />
        </div>
        <div className="absolute top-1/3 right-1/4 text-5xl text-amber-200 animate-float-delay">
          <FaBookOpen />
        </div>
        <div className="absolute bottom-1/4 right-1/5 text-4xl text-emerald-200 animate-float-delay-2">
          <FaBookOpen />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative z-10 px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-serif">
            Contact The MadCoders
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-serif">
            More stories than your nosy neighbor! 🤥📚
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          {/* Form Column */}
          <div className="lg:w-1/1">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center">
                  <FaCheck className="text-green-500 mr-3 text-xl" />
                  <p className="text-green-800 font-medium">
                    Thank you! Your message has been sent successfully.
                  </p>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800 font-medium">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition bg-white bg-opacity-70`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition bg-white bg-opacity-70`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.subject ? "border-red-300" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition bg-white bg-opacity-70`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.message ? "border-red-300" : "border-gray-300"
                      } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition bg-white bg-opacity-70`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-4 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                        isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2 inline" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="lg:w-1/1">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">
                Our Beirut Location
              </h2>

              {/* Beirut Map */}
              <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13293.039190511773!2d35.4950726!3d33.8882466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215880a78f%3A0x729182bae99836b4!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Horizontal Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <FaEnvelope className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  </div>
                  <p className="text-gray-700 ml-9">contact@MadCoders.com</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <FaPhone className="text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  </div>
                  <p className="text-gray-700 ml-9">+961 1 123 456</p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                      <FaMapMarkerAlt className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Address
                    </h3>
                  </div>
                  <p className="text-gray-700 ml-9">LAU Beirut Campus</p>
                  <p className="text-gray-700 ml-9">Beirut, Lebanon</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <FaClock className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                  </div>
                  <p className="text-gray-700 ml-9">Mon-Fri: 9am-7pm</p>
                  <p className="text-gray-700 ml-9">Sat: 10am-5pm</p>
                  <p className="text-gray-700 ml-9">Sun: Closed</p>
                </div>
              </div>

              {/* Fun Book Quote */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="italic text-blue-800">
                  "A bookshop is not just about selling books. It's about
                  fostering the love of reading in Beirut's vibrant community."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite 2s;
        }
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite 4s;
        }
      `}</style>
    </div>
  );
}
