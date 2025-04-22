import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const [showHeader, setShowHeader] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const isChatPage = location.pathname === "/chat-recommendation";
  const isRecommendationPage = location.pathname === "/book-recommendation";

  useEffect(() => {
    if (!isChatPage) {
      setShowHeader(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setShowHeader((prevShowHeader) => {
        const visible =
          prevScrollPos > currentScrollPos || currentScrollPos < 10;
        setPrevScrollPos(currentScrollPos);
        return visible;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isChatPage, prevScrollPos]);

  return (
    <div className="min-h-screen flex flex-col">
      {isChatPage ? (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <Header />
        </header>
      ) : (
        <header className="sticky top-0 z-50">
          <Header />
        </header>
      )}
      <main className={`flex-1 ${isChatPage ? "pt-24" : ""}`}>{children}</main>
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
