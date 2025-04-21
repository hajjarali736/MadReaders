import React, { useState, useRef, useEffect } from "react";
import { searchBooks } from "./services/googleBooksService";

const BookRecommendationChat = () => {
  const [messages, setMessages] = useState([
    {
      text: "✨ Welcome! Share your thoughts, and I’ll find the perfect books just for you.",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatBookData = (book) => {
    const volumeInfo = book.volumeInfo || {};
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
        maxResults: 4,
      });

      const formattedBooks =
        booksRes.items?.slice(0, 4).map(formatBookData) || [];

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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-4">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-[#212e53] to-purple-600 text-transparent bg-clip-text">
          ✨ Book Recommendation Assistant
        </h2>
        <div
          className="h-[500px] overflow-y-auto space-y-4 pr-2"
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
                className={`max-w-[80%] rounded-lg p-3 transition-all duration-300 ${
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
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col">
                    <img
                      src={message.text.coverImage}
                      alt={message.text.title}
                      className="w-full h-[250px] object-cover rounded mb-3"
                    />
                    <h3 className="text-lg font-medium text-[#212e53]">
                      {message.text.title}
                    </h3>
                    <p className="text-sm text-[#212e53] mb-1 italic">
                      by {message.text.author}
                    </p>
                    <p className="text-sm text-gray-600">
                      {message.text.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
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
                      <span className="text-sm text-gray-500 ml-1">
                        ({message.text.ratingsCount})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>{message.text}</p>
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#212e53]"
            placeholder="Tell me what you’re thinking about..."
          />
          <button
            type="submit"
            disabled={inputDisabled}
            className="px-4 py-2 bg-gradient-to-r from-[#212e53] to-purple-600 text-white rounded-md hover:scale-105 transition-transform"
          >
            ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRecommendationChat;
