import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaShippingFast, FaCreditCard, FaUser, FaCheck } from 'react-icons/fa';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Personal, 2: Shipping, 3: Payment
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    shippingMethod: 'standard',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, duration: '3-5 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, duration: '1-2 business days' },
    { id: 'priority', name: 'Priority Shipping', price: 19.99, duration: '1 business day' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.address || !formData.city || !formData.country || !formData.zipCode) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Error during payment processing:', err);
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#DDE6ED]">
      <div className="container mx-auto px-4 max-w-3xl ">
        {/* Progress Steps with Icons */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 h-1 w-full bg-gray-700 -z-10"></div>
            <div 
              className="absolute top-1/2 h-1 bg-indigo-400 -z-10 transition-all duration-300" 
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
            
            {[
              { step: 'Personal', icon: <FaUser className="text-sm" /> },
              { step: 'Shipping', icon: <FaShippingFast className="text-sm" /> },
              { step: 'Payment', icon: <FaCreditCard className="text-sm" /> }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                    currentStep === index + 1 ? 'bg-indigo-500 text-white' : 
                    'bg-white border-2 border-gray-300 text-gray-400'}`}>
                  {currentStep > index + 1 ? (
                    <FaCheck className="text-white" />
                  ) : (
                    item.icon
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  currentStep >= index + 1 ? 'text-indigo-300' : 'text-gray-400'
                }`}>{item.step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Secure Checkout Header */}
          <div className="border-b border-gray-200 p-4 flex items-center">
            <FaLock className="text-indigo-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Secure Checkout</h2>
            <span className="ml-auto text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Secure Connection
            </span>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaUser className="text-indigo-600 mr-2 text-sm" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaShippingFast className="text-indigo-600 mr-2 text-sm" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.shippingMethod === option.id ? 
                        'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => setFormData({...formData, shippingMethod: option.id})}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${
                          formData.shippingMethod === option.id ? 
                          'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                        }`}>
                          {formData.shippingMethod === option.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{option.name}</span>
                            <span className="text-sm font-semibold text-indigo-600">${option.price.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{option.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaCreditCard className="text-indigo-600 mr-2 text-sm" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Card Number *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 pl-10 transition"
                        required
                      />
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name on Card *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">CVC *</label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mt-4">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                      <FaLock className="text-indigo-600 mr-1 text-xs" />
                      Order Summary
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Subtotal</span>
                        <span className="text-xs font-medium">$28.98</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Shipping</span>
                        <span className="text-xs font-medium">
                          ${shippingOptions.find(o => o.id === formData.shippingMethod)?.price.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-gray-800">Total</span>
                          <span className="text-sm font-bold text-indigo-600">
                            ${(28.98 + (shippingOptions.find(o => o.id === formData.shippingMethod)?.price || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center"
              >
                Continue to {currentStep === 1 ? 'Shipping' : 'Payment'}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-5 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <FaLock className="ml-2 text-xs text-white" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}