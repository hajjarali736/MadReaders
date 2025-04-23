import { useState, useEffect } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch, FaBookOpen, FaShippingFast, FaExchangeAlt, FaCreditCard, FaEnvelope } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import samlandLogo from '/samland (1).png';
export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSamLandPopup, setShowSamLandPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSamLandPopup(true);
    }, 1000); // Shows after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days, while express shipping arrives in 1-2 business days. International shipping typically takes 7-14 business days depending on the destination.",
        icon: <FaShippingFast className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of purchase. Books must be in their original condition with no markings or damage. Please contact our support team to initiate a return.",
        icon: <FaExchangeAlt className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. You'll see the exact shipping costs during checkout.",
      icon: <FaShippingFast className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number on our website or the carrier's website to track your package's journey to you.",
      icon: <FaSearch className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are securely processed.",
      icon: <FaCreditCard className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 1 hour of placement by contacting our support team. After that, orders enter our processing system and cannot be changed.",
      icon: <FaExchangeAlt className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "Do you sell e-books or digital products?",
      answer: "Currently we specialize in physical books only. We're considering adding e-books in the future - stay updated!",
      icon: <FaBookOpen className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "How are books packaged for shipping?",
      answer: "All books are carefully packaged in protective materials to prevent damage during transit. Hardcover books include additional corner protectors for extra safety.",
      icon: <FaShippingFast className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "Do you have a loyalty program?",
      answer: "Yes! We offer a loyalty program where you can earn points for every purchase. These points can be redeemed for discounts on future orders. Sign up for more details!",
      icon: <FaBookOpen className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "What should I do if I received a damaged book?",
      answer: "If you receive a damaged book, please contact our support team within 7 days of delivery. We'll assist you in processing a return or exchange.",
      icon: <FaExchangeAlt className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. The item must be in its original condition and packaging. You can contact us for more details.",
    icon: <FaBookOpen className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "How often do you restock books?",
      answer: "We regularly restock popular titles, but availability can vary. If a book is out of stock, it will not be displayed in our website.",
      icon: <FaBookOpen className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "Do you offer gift cards?",
      answer: "No, but we offer Coupons in various amounts. They can be purchased through our website and are a perfect gift for any book lover!",
      icon: <FaCreditCard className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  {
      question: "How can I contact customer support?",
      answer: "You can contact our customer support team via the contact form on our website or by emailing us at support@madreaders.com. We're here to help!",
      icon: <FaEnvelope className="text-bg-gradient-to-br from-indigo-50 to-blue-100" />
  },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Header />
      
      {/* SamLand Popup */}
      <AnimatePresence>
        {showSamLandPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 max-w-md w-full relative shadow-lg border-2 border-orange-300"
            >
              <button
                onClick={() => setShowSamLandPopup(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-orange-600"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src={samlandLogo} 
                  alt="SamLand Logo"
                  className="w-full h-full object-cover"
                />
                </div>
                <h3 className="text-2xl font-bold text-orange-700 mb-2">
                  Take a break from reading!
                </h3>
                <p className="text-lg mb-4">Enjoy yourself at SamLand, where rollercoasters of imagination meet waterslides of adventure!</p>

                <div className="bg-gradient-to-r from-orange-200 to-yellow-200 border-2 border-dashed border-orange-300 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-800 mb-1">
                    Special offer just for book lovers:
                  </p>
                  <p className="text-xs text-gray-700 mt-2">
                    50% off Day Pass Tickets
                  </p>
                </div>

                <a
                  href="https://samland.fun/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full inline-block text-center"
                > 
                Visit SamLand →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Animated Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 rounded-full shadow-xl mb-6"
            >
              <FaQuestionCircle className="text-white text-5xl" />
            </motion.div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-bg-gradient-to-br from-indigo-50 to-blue-100">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our bookstore. Can't find an answer? Contact our team.
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 max-w-2xl mx-auto relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div 
            layout
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12"
          >
            <div className="divide-y divide-gray-100">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <button
                      className="w-full flex justify-between items-center text-left focus:outline-none group"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {faq.icon}
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      {activeIndex === index ? (
                        <FaChevronUp className="text-indigo-500 ml-4 text-lg" />
                      ) : (
                        <FaChevronDown className="text-indigo-500 ml-4 text-lg" />
                      )}
                    </button>
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pl-10 text-gray-600">
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="bg-indigo-100 inline-flex p-4 rounded-full mb-4">
                    <FaQuestionCircle className="text-indigo-600 text-3xl" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching for something else or contact our support team.</p>
                </motion.div>
              )}
            </div>

            {/* Contact CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-[#27374D] to-[#526D82] px-8 py-12 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/20 inline-flex p-4 rounded-full mb-6">
                  <FaEnvelope className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Still have questions?
                </h3>
                <p className="text-indigo-100 mb-6 text-lg">
                  Our book-loving support team is ready to help you with any questions.
                </p>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-bg-gradient-to-r from-[#27374D] to-[#526D82] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
                >
                  Contact Our Team
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Help Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-8 right-8"
          >
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-[#27374D] to-[#526D82] text-white p-4 rounded-full shadow-xl flex items-center justify-center"
            >
              <FaQuestionCircle className="text-2xl" />
            </motion.a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}