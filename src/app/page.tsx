'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Mail, Phone, Calendar, Star, CheckCircle, ArrowRight, 
  Zap, Clock, Target, ChevronRight, Play, Sparkles,
  MessageCircle, Shield, Rocket, BarChart3
} from 'lucide-react';
import Image from 'next/image';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  metrics: string;
  category: string;
  duration: string;
  tools: string[];
  image: string;
  results: string[];
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  company: string;
  result: string;
}

export default function VAPortfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Loading animation
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const services: Service[] = [
    {
      icon: <Mail className="w-10 h-10" />,
      title: "Email & Communication Management",
      description: "Transform your inbox chaos into a streamlined communication powerhouse with AI-powered automation and strategic response systems.",
      features: [
        "Smart email filtering & prioritization",
        "Professional template library creation", 
        "Automated follow-up sequences",
        "Client communication optimization",
        "CRM integration & management"
      ],
      price: "Starting at $899/month"
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: "Executive Calendar & Scheduling",
      description: "Optimize your time with strategic calendar management that maximizes productivity while maintaining perfect work-life balance.",
      features: [
        "AI-powered scheduling optimization",
        "Multi-timezone coordination",
        "Meeting preparation & briefings",
        "Calendar conflict resolution",
        "VIP client scheduling priority"
      ],
      price: "Starting at $699/month"
    },
    {
      icon: <Rocket className="w-10 h-10" />,
      title: "Business Operations & Growth",
      description: "Scale your business with systems that work while you sleep. Complete operational management for ambitious entrepreneurs.",
      features: [
        "Process automation & documentation",
        "Performance analytics & reporting",
        "Team coordination & management",
        "Strategic planning support",
        "Growth strategy implementation"
      ],
      price: "Starting at $1,299/month"
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Marketing & Brand Management",
      description: "Build a powerful online presence that converts visitors into loyal customers through strategic marketing and content creation.",
      features: [
        "Social media strategy & management",
        "Content creation & curation",
        "Lead generation campaigns",
        "Brand development & positioning",
        "Marketing automation setup"
      ],
      price: "Starting at $999/month"
    }
  ];

  const portfolioItems: PortfolioItem[] = [
    {
      title: "SaaS Company Revenue Transformation",
      description: "Revolutionized a struggling SaaS startup&apos;s operations by implementing comprehensive business systems, resulting in explosive growth and successful Series A funding.",
      metrics: "340% Revenue Growth",
      category: "Business Transformation",
      duration: "8 months",
      tools: ["HubSpot", "Slack", "Notion", "Zapier", "Google Analytics"],
      image: "",
      results: [
        "Reduced operational costs by 45%",
        "Increased team productivity by 180%",
        "Secured $2.3M Series A funding",
        "Scaled from 5 to 25 employees"
      ]
    },
    {
      title: "E-commerce Empire Launch",
      description: "Built a complete e-commerce operation from scratch for a luxury brand, creating systems that generated 7-figure revenue in the first year.",
      metrics: "$1.2M First Year Revenue",
      category: "E-commerce Launch",
      duration: "12 months",
      tools: ["Shopify Plus", "Klaviyo", "Facebook Ads", "Google Analytics", "Zendesk"],
      image: "",
      results: [
        "Built automated sales funnels",
        "Created content marketing strategy",
        "Implemented customer service systems",
        "Achieved 15% monthly growth rate"
      ]
    },
    {
      title: "Tech CEO Executive Support",
      description: "Provided comprehensive executive support to a Fortune 500 tech CEO, optimizing their schedule and operations for maximum strategic impact.",
      metrics: "85% Schedule Optimization",
      category: "Executive Support",
      duration: "Ongoing - 18 months",
      tools: ["Calendly", "Microsoft 365", "Slack", "Asana", "DocuSign"],
      image: "",
      results: [
        "Eliminated 90% of scheduling conflicts",
        "Streamlined board communications",
        "Improved decision-making speed by 60%",
        "Managed $50M+ strategic initiatives"
      ]
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Marcus Thompson",
      role: "CEO",
      company: "TechFlow Innovations",
      content: "Adeola didn&apos;t just manage my business operations—she transformed them. Her strategic thinking and flawless execution helped us scale from $500K to $3M in revenue. She&apos;s not just a VA, she&apos;s a business partner.",
      rating: 5,
      image: "MT",
      result: "500% Revenue Growth"
    },
    {
      name: "Sarah Chen",
      role: "Founder",
      company: "LuxeLife E-commerce",
      content: "Working with Adeola was the best investment I&apos;ve ever made. She built systems that run like clockwork and her attention to detail is unmatched. Our customer satisfaction scores increased by 40% in just 3 months.",
      rating: 5,
      image: "SC",
      result: "40% Higher Customer Satisfaction"
    },
    {
      name: "David Rodriguez",
      role: "Managing Director",
      company: "Global Ventures Capital",
      content: "Adeola&apos;s ability to handle complex projects while maintaining the highest standards is remarkable. She managed our portfolio company communications flawlessly during our $50M acquisition deal.",
      rating: 5,
      image: "DR",
      result: "$50M Deal Success"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">Loading Excellence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Cursor Effect */}
      <div 
        className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: 'radial-gradient(circle, rgba(96,165,250,0.8) 0%, rgba(168,85,247,0.8) 100%)',
          borderRadius: '50%',
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900/60 to-purple-900/80 relative overflow-hidden">
        {/* Navigation */}
        <nav className="fixed top-[1%] w-[90%] backdrop-blur-xl border-b border-purple-500/20 border-t border-blue-800/20 z-40 shadow-2xl m-auto left-[5%] rounded-full">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-18">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                ADEOLA TINUOYE
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex space-x-10">
                {['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize transition-all duration-300 font-semibold relative group ${
                      activeSection === section 
                        ? 'text-blue-400' 
                        : 'text-white hover:text-blue-400'
                    }`}
                  >
                    {section}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full ${activeSection === section ? 'w-full' : ''}`}></span>
                  </button>
                ))}
              </div>

              <div className="hidden lg:flex items-center space-x-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Let&apos;s Talk
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-blue-400 transition-colors p-2"
                >
                  {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden bg-black/98 backdrop-blur-xl border-b border-purple-500/20">
              <div className="px-6 pt-4 pb-6 space-y-3">
                {['home', 'about', 'services', 'portfolio', 'testimonials', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block w-full text-left px-4 py-3 text-white hover:text-blue-400 capitalize font-semibold hover:bg-blue-500/10 rounded-lg transition-all duration-300"
                  >
                    {section}
                  </button>
                ))}
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold mt-4"
                >
                  Let&apos;s Talk
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-[1400px] mt-[9rem] mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-blue-400 font-bold text-lg">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <span className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Strategic Business Partner</span>
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Adeola
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Tinuoye
                </span>
              </h1>
              
              <div className="block bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
                <div className="text-2xl inline font-bold text-blue-300 mb-2">
                  EXECUTIVE VIRTUAL ASSISTANT & <br />
                </div>
                <div className="text-2xl inline font-bold text-purple-300">
                  STRATEGIC BUSINESS PARTNER
                </div>
              </div>
            </div>

            <p className="text-xl lg:text-2xl text-gray-100 leading-relaxed max-w-2xl">
              I don&apos;t just manage tasks—I transform businesses. As your strategic partner, I help ambitious entrepreneurs and executives 
              <span className="text-blue-400 font-semibold"> scale from 6 to 7 figures</span> through systematic optimization, 
              strategic operations, and relentless execution excellence.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                <p className="text-blue-300 font-bold text-lg flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Transforming one business empire at a time!</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-3"
              >
                <span>Start Your Transformation</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Play className="w-5 h-5" />
                <span>See Success Stories</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full h-[600px] mx-auto">
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 z-10 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-4 animate-float">
                <div className="text-blue-400 text-sm font-semibold">150+ Clients Served</div>
                <div className="text-white text-2xl font-bold">99.8% Success Rate</div>
              </div>
              
              <div className="absolute bottom-20 left-10 z-10 bg-gradient-to-r from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-4 animate-float" style={{animationDelay: '1s'}}>
                <div className="text-purple-400 text-sm font-semibold">Average Growth</div>
                <div className="text-white text-2xl font-bold">340%+ Revenue</div>
              </div>

              {/* Main Image Container */}
              <div className="mx-auto bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-end justify-center border-2 border-blue-400/30 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 animate-pulse"></div>
                <Image 
                  className="relative z-10 w-full h-full object-cover" 
                  src="/assets/pic.png" 
                  alt="Adeola Tinuoye" 
                  width={600}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              The Strategic Mind Behind Your Success
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed">
                  With over <span className="text-blue-400 font-bold">8 years of elite experience</span> transforming businesses from the inside out, 
                  I&apos;m not your typical virtual assistant. I&apos;m a strategic business partner who specializes in turning ambitious visions into 
                  profitable realities.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed">
                  My approach combines <span className="text-purple-400 font-bold">Fortune 500-level strategic thinking</span> with startup agility. 
                  I don&apos;t just execute—I optimize, innovate, and scale. Every system I build, every process I design, and every strategy I implement 
                  is engineered for one purpose: <span className="text-pink-400 font-bold">exponential growth</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Shield className="w-6 h-6" />, text: "Strategic Problem Solver" },
                  { icon: <Rocket className="w-6 h-6" />, text: "Growth Accelerator" },
                  { icon: <Zap className="w-6 h-6" />, text: "Innovation Catalyst" },
                  { icon: <Target className="w-6 h-6" />, text: "Results Obsessed" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                    <div className="text-blue-400">{item.icon}</div>
                    <span className="text-gray-300 font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl p-6 border border-blue-400/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
                  <span>Elite Certifications & Training</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    'Google Analytics Certified',
                    'HubSpot Marketing Certified', 
                    'Salesforce Admin Certified',
                    'Project Management Professional',
                    'Digital Marketing Specialist',
                    'Business Process Optimization'
                  ].map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-blue-400/30 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-white mb-8 text-center">Core Expertise</h3>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { skill: 'Business Strategy', percentage: 98, color: 'from-blue-400 to-blue-600' },
                  { skill: 'Operations Excellence', percentage: 99, color: 'from-purple-400 to-purple-600' },
                  { skill: 'Marketing Systems', percentage: 95, color: 'from-pink-400 to-pink-600' },
                  { skill: 'Client Relations', percentage: 100, color: 'from-green-400 to-green-600' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={`url(#gradient${index + 1})`}
                          strokeWidth="3"
                          strokeDasharray={`${item.percentage}, 100`}
                          strokeLinecap="round"
                          className="animate-pulse"
                        />
                        <defs>
                          <linearGradient id={`gradient${index + 1}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={item.color.split(' ')[0].replace('from-', '#')} />
                            <stop offset="100%" stopColor={item.color.split(' ')[1].replace('to-', '#')} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.percentage}%</span>
                      </div>
                    </div>
                    <span className="text-gray-300 text-sm text-center font-semibold">{item.skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              Elite Business Transformation Services
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Premium, results-driven services designed for ambitious entrepreneurs and executives 
              ready to scale their operations and multiply their impact.
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mt-8 rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-blue-400 p-3 bg-blue-400/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <div className="text-blue-400 font-bold text-lg">{service.price}</div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  {service.description}
                </p>
                
                <ul className="space-y-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-4 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              Transformation Success Stories
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Real businesses. Real results. Real transformation. Here&apos;s how I&apos;ve helped visionary leaders 
              build million-dollar operations and scale beyond their wildest dreams.
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-blue-400/20 overflow-hidden hover:border-blue-400/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-left">
                      <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 text-sm font-bold px-4 py-2 rounded-full border border-blue-400/30">
                        {item.category}
                      </div>
                      <div className="text-sm ml-2 text-gray-400 mt-2">{item.duration}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{item.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {item.metrics}
                    </div>
                    <div className="text-sm text-gray-400 font-semibold">Key Achievement</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {item.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tools.map((tool, toolIndex) => (
                      <span key={toolIndex} className="bg-blue-500/10 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-400/30 font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              What Visionary Leaders Say
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Don&apos;t just take my word for it. Here&apos;s what industry leaders and successful entrepreneurs 
              have to say about the transformative impact of our partnership.
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-500 hover:transform hover:scale-105">
                <div className="flex mb-6">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-8 italic leading-relaxed text-lg">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                        <div className="text-blue-300 font-semibold">{testimonial.role}</div>
                        <div className="text-gray-400 text-sm">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">{testimonial.result}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">
              Ready to Scale Beyond Your Dreams?
            </h2>
            <p className="text-xl lg:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
              Let&apos;s have a strategic conversation about how I can help you build systems that scale, 
              optimize operations that drive growth, and create the business empire you&apos;ve always envisioned.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Strategic Consultation</h3>
                <p className="text-white/80">Free 30-minute strategy session to discuss your goals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Clock className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Quick Response</h3>
                <p className="text-white/80">2-hour response time for all inquiries</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">100% Confidential</h3>
                <p className="text-white/80">Your business information is completely secure</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="mailto:adeola@tinuoyeconsulting.com"
                className="group bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center transform hover:scale-105 shadow-2xl"
              >
                <Mail className="mr-3 w-6 h-6" />
                <span>adeola@tinuoyeconsulting.com</span>
              </a>
              <a 
                href="tel:+1-555-ADEOLA-1"
                className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center transform hover:scale-105"
              >
                <Phone className="mr-3 w-6 h-6" />
                <span>+1 (555) ADEOLA-1</span>
              </a>
              <button className="border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center transform hover:scale-105">
                <Calendar className="mr-3 w-6 h-6" />
                <span>Book Strategy Call</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 border-t border-blue-400/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                ADEOLA TINUOYE
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                Strategic Business Partner & Executive Virtual Assistant dedicated to transforming 
                ambitious businesses into industry-leading empires through systematic optimization 
                and strategic excellence.
              </p>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'Instagram'].map((social, index) => (
                  <button key={index} className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-blue-300 text-xl">Elite Services</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Email & Communication Management</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Executive Calendar & Scheduling</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Business Operations & Growth</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Marketing & Brand Management</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-blue-300 text-xl">Quick Access</h4>
              <ul className="space-y-3 text-gray-300">
                {['About', 'Services', 'Portfolio', 'Testimonials', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => scrollToSection(link.toLowerCase())} 
                      className="hover:text-blue-400 transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-400/30 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              &copy; 2025 Adeola Tinuoye Consulting. All rights reserved. | 
              <span className="text-blue-400 font-semibold"> Transforming Businesses. Multiplying Success.</span>
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}