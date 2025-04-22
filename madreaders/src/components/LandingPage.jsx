import React, { useState, useEffect, useRef } from "react"
import { BookOpen, BookMarked, Users, Sparkles, ChevronRight, BookHeart, Star, Bookmark, Coffee, Zap, ArrowRight, Lightbulb, Heart } from 'lucide-react'

// Custom animated book component
const AnimatedBook = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setIsOpen(prev => !prev)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isHovered])
  
  return (
    <div 
      className="relative w-72 h-96 book-perspective cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={`book-container w-full h-full relative book-3d book-float ${isOpen ? 'book-open' : ''}`}>
        <div className="absolute w-full h-full bg-[#1e3a5f] rounded-r-lg shadow-xl book-cover-front border-r border-[#a3c9ff]">
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="https://placehold.co/200x200" alt="MadReaders Logo" className="w-20 h-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-xl font-bold mb-2">MadReaders</div>
                <div className="text-sm opacity-80">Click to open</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute w-full h-full bg-white rounded-l-lg shadow-xl book-cover-back">
          <div className="absolute inset-0 p-8 flex flex-col justify-center">
            <h3 className="text-[#1e3a5f] text-xl font-bold mb-4">MadReaders</h3>
            <p className="text-[#1e3a5f]/80 text-sm">
              "Books are a uniquely portable magic."
              <br />- Stephen King
            </p>
            <div className="mt-4 text-sm text-[#1e3a5f]/60">
              <p>Join our community of book lovers and discover your next favorite read!</p>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="px-4 py-2 bg-[#1e3a5f] text-white rounded-full text-sm animate-pulse">
                Explore our library
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Floating books background component
const FloatingBooksBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="absolute book-icon"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 15}s`
          }}
        >
          {i % 3 === 0 ? (
            <BookOpen className="text-white/10 w-8 h-8" />
          ) : i % 3 === 1 ? (
            <BookMarked className="text-white/10 w-10 h-10" />
          ) : (
            <Bookmark className="text-white/10 w-6 h-6" />
          )}
        </div>
      ))}
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ value, label, icon }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const duration = 2000
          const step = timestamp => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setCount(Math.floor(progress * value))
            if (progress < 1) {
              window.requestAnimationFrame(step)
            }
          }
          window.requestAnimationFrame(step)
          observer.unobserve(counterRef.current)
        }
      },
      { threshold: 0.1 }
    )
    
    if (counterRef.current) {
      observer.observe(counterRef.current)
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [value])
  
  return (
    <div 
      ref={counterRef}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group"
    >
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-[#1e3a5f] mb-2 counter-value">{count.toLocaleString()}+</div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

// Animated timeline item component
const TimelineItem = ({ year, title, description, index }) => {
  const itemRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(itemRef.current)
        }
      },
      { threshold: 0.1 }
    )
    
    if (itemRef.current) {
      observer.observe(itemRef.current)
    }
    
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current)
      }
    }
  }, [])
  
  return (
    <div
      ref={itemRef}
      className={`relative mb-12 ${
        index % 2 === 0 ? "md:ml-auto md:mr-[50%]" : "md:mr-auto md:ml-[50%]"
      } md:w-[45%] z-10 transition-all duration-1000 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : index % 2 === 0 
            ? "opacity-0 translate-x-24" 
            : "opacity-0 -translate-x-24"
      }`}
    >
      <div className="bg-white rounded-xl p-8 shadow-md relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-[#1e3a5f] border-4 border-white z-20 ${
            index % 2 === 0
              ? "md:-right-[3.25rem] right-1/2 translate-x-1/2 md:translate-x-0"
              : "md:-left-[3.25rem] left-1/2 -translate-x-1/2 md:translate-x-0"
          }`}
        >
          <span className="ping-animation absolute inline-flex h-full w-full rounded-full bg-[#a3c9ff] opacity-75"></span>
        </div>
        <span className="inline-block px-3 py-1 bg-[#1e3a5f] text-white text-sm font-medium rounded-full mb-4">
          {year}
        </span>
        <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

// Animated feature card component
const FeatureCard = ({ icon, title, description, delay }) => {
  const cardRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(cardRef.current)
        }
      },
      { threshold: 0.1 }
    )
    
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])
  
  return (
    <div
      ref={cardRef}
      className={`bg-[#2c4c74] rounded-xl p-8 hover:bg-[#355785] transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay * 150}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-[#1e3a5f] rounded-lg p-3 feature-icon-container">
          <div className="feature-icon">{icon}</div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-white/80">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Testimonial card with animation
const TestimonialCard = ({ quote, name, title, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`bg-[#f0f4f9] rounded-xl p-8 shadow-md relative transition-all duration-500 hover:shadow-xl ${
        isHovered ? 'scale-105 bg-white' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
        <div className="text-[#1e3a5f] text-6xl opacity-20">"</div>
      </div>
      <div className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-[#a3c9ff]/20 transition-all duration-500 ${
        isHovered ? 'scale-[3] opacity-50' : 'scale-100'
      }`}></div>
      <p className="text-gray-600 mb-6 relative z-10">{quote}</p>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold transition-all duration-300 ${
          isHovered ? 'scale-110' : ''
        }`}>
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h4 className="font-bold text-[#1e3a5f]">{name}</h4>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-[#a3c9ff] rounded-b-xl transform scale-x-0 origin-left transition-transform duration-500 ${
        isHovered ? 'scale-x-100' : ''
      }`}></div>
    </div>
  )
}

// Particle effect component
const ParticleEffect = () => {
  return (
    <div className="particle-container absolute inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div 
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
            background: `rgba(163, 201, 255, ${Math.random() * 0.5 + 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  // eslint-disable-next-line no-unused-vars
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f9] overflow-hidden">
      {/* Hero Section with Animated Book */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#1e3a5f] to-[#2c4c74]">
        <FloatingBooksBackground />
        <ParticleEffect />
        
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://placehold.co/')" }}
          ></div>
          <div className="absolute inset-0 bg-[#1e3a5f]/60"></div>
        </div>

        <div className="container relative z-10 px-4 mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4 animate-bounce-slow">
              <span className="text-sm font-medium text-white">Our Journey</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight magic-text">
              Where <span className="text-[#a3c9ff] glow-text">Stories</span> Find Their{" "}
              <span className="text-[#a3c9ff] glow-text">Readers</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl slide-in-text">
              MadReaders was born from a passion to connect people with knowledge that transforms lives. Our story is
              one of dedication, innovation, and a deep love for literature.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 fade-in-up" style={{ animationDelay: '0.6s' }}>
              <a
                href="#our-mission"
                className="px-6 py-3 rounded-lg bg-white text-[#1e3a5f] font-medium hover:bg-[#a3c9ff] transition-all duration-300 flex items-center gap-2 hover:gap-3 group"
              >
                Our Mission <ChevronRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/book-recommendation"
                className="px-6 py-3 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 hover:gap-3 group"
              >
                Try Book Buddy <BookHeart className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center fade-in-up" style={{ animationDelay: '0.8s' }}>
            <AnimatedBook />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0f4f9] to-transparent"></div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <a href="#our-mission" className="text-white/80 hover:text-white transition-colors duration-300">
            <div className="flex flex-col items-center">
              <span className="text-sm mb-2">Scroll Down</span>
              <ArrowRight className="h-5 w-5 transform rotate-90" />
            </div>
          </a>
        </div>
      </section>

      {/* Our Mission Section */}
      <section id="our-mission" className="py-20 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3c9ff]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1e3a5f]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="container px-4 mx-auto relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1e3a5f]/10 mb-4">
              <span className="text-sm font-medium text-[#1e3a5f]">Our Purpose</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6 relative">
              Our Mission
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#a3c9ff] rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 mt-8">
              At MadReaders, we believe that books have the power to change lives. Our mission is to create a community
              where readers can discover, share, and celebrate the transformative power of literature.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10 text-[#1e3a5f]" />,
                title: "Discover",
                description:
                  "Find your next favorite book through our curated collections and personalized recommendations.",
              },
              {
                icon: <BookMarked className="h-10 w-10 text-[#1e3a5f]" />,
                title: "Teach",
                description:
                  "Unlock the joy of learning—share your love of stories and mentor fellow readers.",
              },
              {
                icon: <Users className="h-10 w-10 text-[#1e3a5f]" />,
                title: "Grow",
                description: "Expand your horizons with diverse perspectives and ideas from around the world.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#f0f4f9] rounded-xl p-8 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <div className="mission-icon">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="mt-6 w-0 group-hover:w-full h-1 bg-[#a3c9ff] rounded-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 bg-[#f0f4f9] relative">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1e3a5f]/10 mb-4">
              <span className="text-sm font-medium text-[#1e3a5f]">Our History</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6 relative inline-block">
              Our Journey
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3c9ff] rounded-full"></div>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#1e3a5f]/20"></div>

            {[
              {
                year: "Phase 1",
                title: "The Idea",
                description:
                  "MadReaders began as a simple idea: to create a platform that connects readers with the books they'll love.",
              },
              {
                year: "Phase 2",
                title: "Architecture Design",
                description:
                  "We designed our architecture, focusing on creating a user-friendly interface for book discovery.",
              },
              {
                year: "Phase 3",
                title: "Implementation and Book Body Launch",
                description: "We implemented our website and introduced Book Buddy, our AI-powered recommendation system that helps readers find their perfect match..",
              },
              {
                year: "Today",
                title: "Book Buddy Launch",
                description:
                  "We introduced Book Buddy, our AI-powered recommendation system that helps readers find their perfect match.",
              },
            ].map((item, index) => (
              <TimelineItem 
                key={index}
                year={item.year}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section id="book-buddy" className="py-20 bg-[#1e3a5f] text-white relative overflow-hidden">
        <ParticleEffect />
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <span className="text-sm font-medium text-white">Our Uniqueness</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              What Makes MadReaders Special
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3c9ff] rounded-full"></div>
            </h2>
            <p className="text-lg text-white/80 mt-8">
              We're not just another book platform. Here's what sets MadReaders apart and makes us unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-[#a3c9ff]" />,
                title: "Personalized Experience",
                description: "Our advanced algorithms learn your preferences to recommend books you'll truly enjoy.",
              },
              {
                icon: <BookHeart className="h-8 w-8 text-[#a3c9ff]" />,
                title: "Book Buddy",
                description:
                  "Your personal AI reading companion that understands your tastes and helps you discover new favorites.",
              },
            ].map((item, index) => (
              <FeatureCard 
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-[#1e3a5f]/10 mb-4">
              <span className="text-sm font-medium text-[#1e3a5f]">Reader Feedback</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6 relative inline-block">
              What Our Readers Say
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-[#a3c9ff] rounded-full"></div>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "MadReaders completely transformed how I discover books. The Book Buddy feature feels like having a librarian who really knows me.",
                name: "Mohammad Jomha",
                title: "Book Addict",
              },
              {
                quote:
                  "MadReaders didn’t just calm my bookish chaos—it weaponized it. My ‘to-read’ pile used to be a source of stress (we’ve all been there). Now, thanks to scary-accurate recommendations and filters that actually work, my madness has direction. I still obsess over books… but now it’s a superpower.",
                name: "Bilal Abou Osman",
                title: "MadReader",
              },
              {
                quote:
                  "The variety of books in the website is as breathtaking as a library bathed in golden-hour light—each title meticulously arranged for your discovery, with covers that glimmer like treasures waiting to be claimed..",
                name: "Michael kolanjian",
                title: "Book expert",
              },
            ].map((item, index) => (
              <TestimonialCard 
                key={index}
                quote={item.quote}
                name={item.name}
                title={item.title}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1e3a5f] to-[#2c4c74] text-white relative overflow-hidden">
        <ParticleEffect />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#a3c9ff]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#a3c9ff]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="text-sm font-medium text-white">Join Us Today</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 glow-text-subtle">Join the MadReaders Community</h2>
            <p className="text-lg text-white/80 mb-8">
              Become part of our story. Join thousands of readers who have found their literary home with MadReaders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/signup"
                className="px-8 py-4 rounded-lg bg-white text-[#1e3a5f] font-medium hover:bg-[#a3c9ff] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#a3c9ff]/20"
              >
                Sign Up Now
              </a>
              <a
                href="/"
                className="px-8 py-4 rounded-lg bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Explore Books
              </a>
            </div>
            
            <div className="mt-12 pt-12 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 counter-value">50K+</div>
                  <div className="text-white/70">Target: Happy Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 counter-value">40M+</div>
                  <div className="text-white/70">Books Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 counter-value">15K+</div>
                  <div className="text-white/70">Recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

