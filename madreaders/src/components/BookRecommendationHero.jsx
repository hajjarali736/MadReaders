import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookRecommendationHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 animate-gradient-x">
      {/* Floating books */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <div className="w-16 h-24 bg-white rounded-md shadow-lg transform rotate-12"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float-delay">
        <div className="w-20 h-28 bg-white rounded-md shadow-lg transform -rotate-6"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
        <div className="w-14 h-22 bg-white rounded-md shadow-lg transform rotate-3"></div>
      </div>
      
      {/* Pulsing AI orb */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 bg-white rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full opacity-70 animate-spin-slow"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          AI Book Assistant
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8 animate-fade-in-delay">
          Discover your next favorite read with our intelligent book recommendation system
        </p>
        <button 
          onClick={() => navigate('/chat-recommendation')}
          className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2">
          Start Chatting
        </button>
      </div>
    </div>
  );
};

export default BookRecommendationHero; 