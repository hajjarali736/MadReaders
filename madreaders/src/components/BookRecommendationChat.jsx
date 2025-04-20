import React, { useState, useRef, useEffect } from 'react';

const BookRecommendationChat = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your book recommendation assistant. Tell me what kind of book you're looking for, and I'll help you find it!", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
        setInputValue('');

        try {
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputValue }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, { text: data.error, isUser: false }]);
            } else if (data.ai_recommendation) {
                setMessages(prev => [...prev, { 
                    text: data.ai_recommendation, 
                    isUser: false,
                    isAI: true 
                }]);
                
                if (data.books && data.books.length > 0) {
                    data.books.forEach(book => {
                        setMessages(prev => [...prev, { 
                            text: book, 
                            isUser: false, 
                            isBook: true 
                        }]);
                    });
                }
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your request.', isUser: false }]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#212e53] to-purple-600">
                            Book Recommendation Assistant
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Your personal AI-powered book recommendation expert
                        </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-[#212e53] to-purple-600 p-4">
                            <h3 className="text-lg font-medium text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Chat with Assistant
                            </h3>
                        </div>
                        <div className="h-[400px] overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 transform transition-all duration-300 ${
                                            message.isUser
                                                ? 'bg-gradient-to-r from-[#212e53] to-purple-600 text-white'
                                                : message.isAI
                                                ? 'bg-green-100 text-gray-800'
                                                : 'bg-white border border-gray-200 shadow-sm'
                                        }`}
                                    >
                                        {message.isBook ? (
                                            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                                <h3 className="font-bold text-lg text-[#212e53]">{message.text.title}</h3>
                                                <p className="text-sm text-gray-600 italic">by {message.text.author}</p>
                                                <p className="mt-2 text-sm text-gray-700">{message.text.description}</p>
                                                <span className="inline-block bg-gradient-to-r from-[#212e53] to-purple-600 text-white text-xs px-2 py-1 rounded-full mt-2">
                                                    {message.text.genre}
                                                </span>
                                            </div>
                                        ) : (
                                            <p>{message.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 p-4 bg-white/50">
                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#212e53] focus:border-transparent shadow-sm"
                                    placeholder="Ask for book recommendations..."
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#212e53] to-purple-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-[#212e53] focus:outline-none focus:ring-2 focus:ring-[#212e53] focus:ring-offset-2 transform transition-all duration-300 hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookRecommendationChat; 