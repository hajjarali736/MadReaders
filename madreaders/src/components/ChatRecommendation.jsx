import React, { useState, useRef, useEffect } from "react";
import { searchBooks } from "./services/googleBooksService";
import { useNavigate } from "react-router-dom";

const ChatRecommendation = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      text: "✨ Welcome! Share your thoughts, and I'll find the perfect books just for you.",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatBookData = (book) => {
    const volumeInfo = book.volumeInfo || {};
    
    // Skip books that have Arabic language or no language specified
    if (volumeInfo.language !== 'en') {
      return null;
    }
    
    return {
      id: book.id,
      title: volumeInfo.title || "No Title",
      author: volumeInfo.authors
        ? volumeInfo.authors.join(", ")
        : "Unknown Author",
      coverImage:
        volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/150x200?text=No+Cover",
      description: volumeInfo.description || "No description available",
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    setInputValue("");
    setInputDisabled(true);

    try {
      const aiRes = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputValue }),
      });

      const data = await aiRes.json();

      if (data.summary) {
        setMessages((prev) => [
          ...prev,
          {
            text: `🌟 Here's what I understood about you: ${data.summary}`,
            isUser: false,
            isAI: true,
          },
        ]);
      }

      const keyword = data?.keywords?.[0] || "fiction";
      console.log("🔑 keywords from AI:", data.keywords);

      const booksRes = await searchBooks(keyword, {
        orderBy: "relevance",
        maxResults: 8, // Increased to ensure we get enough English books after filtering
        langRestrict: "en",
        q: `${keyword} language:english -inlang:ar`,
        printType: "books"
      });

      const formattedBooks = booksRes.items
        ?.map(formatBookData)
        .filter(book => book !== null) // Remove any non-English books
        .slice(0, 4) || [];

      formattedBooks.forEach((book) => {
        setMessages((prev) => [
          ...prev,
          { text: book, isUser: false, isBook: true },
        ]);
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong.", isUser: false },
      ]);
    } finally {
      setInputDisabled(false);
    }
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`);
  };

  return (
    <>
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ top: '10%', left: '20%' }}></div>
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl animate-float-delay" style={{ top: '60%', right: '20%' }}></div>
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl animate-float-delay-2" style={{ top: '40%', left: '50%' }}></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-5 space-y-3">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-[#212e53] to-purple-600 text-transparent bg-clip-text">
            ✨ Book Buddy
          </h2>
          <div
            className="h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar"
            ref={messagesEndRef}
          >
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2 transition-all duration-300 ${
                    message.isUser
                      ? "bg-gradient-to-r from-[#212e53] to-purple-600 text-white"
                      : message.isAI
                      ? "bg-yellow-50 border-l-4 border-yellow-300 shadow-md text-gray-800"
                      : message.isBook
                      ? ""
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.isBook ? (
                    <div 
                      onClick={() => handleBookClick(message.text)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-[450px] cursor-pointer"
                    >
                      <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded mb-4">
                        <img
                          src={message.text.coverImage}
                          alt={message.text.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-medium text-[#212e53] mb-2 line-clamp-2 min-h-[3.5rem]">
                          {message.text.title}
                        </h3>
                        <p className="text-[#212e53] mb-2 line-clamp-1">
                          by {message.text.author}
                        </p>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {message.text.description}
                        </p>
                        <div className="mt-auto flex items-center gap-1">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <span
                                key={i}
                                className={`text-xl ${
                                  i < message.text.averageRating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          <span className="text-sm text-gray-600 ml-2">
                            ({message.text.ratingsCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              disabled={inputDisabled}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#212e53] bg-white/80 backdrop-blur-sm"
              placeholder="Tell me what you're thinking about..."
            />
            <button
              type="submit"
              disabled={inputDisabled}
              className="px-3 py-2 bg-gradient-to-r from-[#212e53] to-purple-600 text-white rounded-md hover:scale-105 transition-transform"
            >
              ✨
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatRecommendation; 