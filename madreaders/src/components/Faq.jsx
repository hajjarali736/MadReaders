import { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch, FaBookOpen, FaShippingFast, FaExchangeAlt, FaCreditCard, FaEnvelope } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days, while express shipping arrives in 1-2 business days. International shipping typically takes 7-14 business days depending on the destination.",
      icon: <FaShippingFast className="text-indigo-500 text-xl" />
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Books must be in their original condition with no markings or damage. Please contact our support team to initiate a return.",
      icon: <FaExchangeAlt className="text-indigo-500 text-xl" />
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. You'll see the exact shipping costs during checkout.",
      icon: <FaShippingFast className="text-indigo-500 text-xl" />
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number on our website or the carrier's website to track your package's journey to you.",
      icon: <FaSearch className="text-indigo-500 text-xl" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are securely processed.",
      icon: <FaCreditCard className="text-indigo-500 text-xl" />
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 1 hour of placement by contacting our support team. After that, orders enter our processing system and cannot be changed.",
      icon: <FaExchangeAlt className="text-indigo-500 text-xl" />
    },
    {
      question: "Do you sell e-books or digital products?",
      answer: "Currently we specialize in physical books only. We're considering adding e-books in the future - sign up for our newsletter to stay updated!",
      icon: <FaBookOpen className="text-indigo-500 text-xl" />
    },
    {
      question: "How are books packaged for shipping?",
      answer: "All books are carefully packaged in protective materials to prevent damage during transit. Hardcover books include additional corner protectors for extra safety.",
      icon: <FaShippingFast className="text-indigo-500 text-xl" />
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 ">
        <Header />
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
            className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-full shadow-xl mb-6"
          >
            <FaQuestionCircle className="text-white text-5xl" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
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

        {/* FAQ Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {['Shipping', 'Returns', 'Payments', 'Products'].map((category, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all border-l-4 border-indigo-400"
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  {i === 0 ? <FaShippingFast className="text-indigo-600" /> : 
                   i === 1 ? <FaExchangeAlt className="text-indigo-600" /> : 
                   i === 2 ? <FaCreditCard className="text-indigo-600" /> : 
                   <FaBookOpen className="text-indigo-600" />}
                </div>
                <h3 className="font-medium text-gray-900">{category}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Items */}
        <motion.div 
          layout
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
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
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-center"
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
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all"
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
            className="bg-indigo-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
          >
            <FaQuestionCircle className="text-2xl" />
          </motion.a>
        </motion.div>
      </div>
      <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}