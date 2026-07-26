import { Link } from 'react-router-dom';
import {
  MdAnalytics,
  MdPeople,
  MdSpeed,
  MdSecurity,
  MdDevices,
  MdBarChart,
  MdArrowForward,
  MdEmail,
  MdPhone,
  MdLocationOn,
} from 'react-icons/md';

// ─── Hero Section ─────────────────────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950">
    {/* Animated background orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
    </div>

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-8 backdrop-blur-sm">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        Real-time Visitor Intelligence
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
        Know Your{' '}
        <span className="gradient-text">Visitors</span>
        <br />
        Like Never Before
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
        Track every visitor automatically. Get deep insights into browsers, devices,
        locations, and behavior — all in one beautiful dashboard.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/login"
          className="group flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95"
        >
          Open Dashboard
          <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <a
          href="#features"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 backdrop-blur-sm border border-white/10"
        >
          Explore Features
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-6 mt-16 max-w-sm mx-auto">
        {[
          { label: 'Data Points', value: '15+' },
          { label: 'Real-time', value: '30s' },
          { label: 'Charts', value: '8+' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
      <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
        <div className="w-1 h-2 bg-white/50 rounded-full" />
      </div>
    </div>
  </section>
);

// ─── Features Section ─────────────────────────────────────────────────────────
const features = [
  { icon: MdAnalytics, title: 'Real-Time Analytics', desc: 'See visitor activity as it happens with 30-second auto-refresh.' },
  { icon: MdPeople, title: 'Visitor Tracking', desc: 'Automatically record browser, OS, device, language, timezone and more.' },
  { icon: MdBarChart, title: '8 Chart Types', desc: 'Daily, weekly, monthly, browser, device, OS, pages, and peak hours.' },
  { icon: MdDevices, title: 'Device Insights', desc: 'Understand the split between Desktop, Mobile, and Tablet visitors.' },
  { icon: MdSecurity, title: 'Secure Dashboard', desc: 'JWT-protected admin area with session management and password hashing.' },
  { icon: MdSpeed, title: 'Fast & Lightweight', desc: 'Optimized MongoDB aggregations for instant chart loading.' },
];

const Features = () => (
  <section id="features" className="py-24 bg-white dark:bg-dark-900">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Everything You Need
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          A complete analytics suite built with Node.js, React, and MongoDB.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="card p-6 hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Icon className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── About Section ────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" className="py-24 bg-gray-50 dark:bg-dark-850">
    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Built for Modern Web Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          VisitorIQ is a self-hosted analytics solution that gives you complete ownership
          of your visitor data. No subscriptions, no third-party tracking, no privacy issues.
        </p>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Powered by Node.js, Express, and MongoDB — it scales with your traffic
          and provides actionable insights to grow your business.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { label: 'Open Source', value: '100%' },
            { label: 'Self-Hosted', value: 'Always' },
            { label: 'Data Privacy', value: 'Yours' },
            { label: 'Cost', value: '$0' },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4">
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Live Dashboard Preview</span>
            <span className="flex items-center gap-1 text-xs text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          {[
            { label: 'Total Visitors', value: '12,847', color: 'bg-primary-500' },
            { label: 'Today', value: '342', color: 'bg-green-500' },
            { label: 'Active Now', value: '28', color: 'bg-blue-500' },
            { label: 'Bounce Rate', value: '24.3%', color: 'bg-orange-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Contact Section ──────────────────────────────────────────────────────────
const Contact = () => (
  <section id="contact" className="py-24 bg-white dark:bg-dark-900">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
        Have questions about the platform? We'd love to hear from you.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: MdEmail, label: 'Email', value: 'admin@analytics.com' },
          { icon: MdPhone, label: 'Phone', value: '+1 (555) 000-0000' },
          { icon: MdLocationOn, label: 'Location', value: 'Worldwide' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{value}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-dark-950 py-8 text-center">
    <p className="text-gray-500 text-sm">
      © {new Date().getFullYear()} VisitorIQ Analytics. All rights reserved.
    </p>
    <div className="flex items-center justify-center gap-6 mt-3">
      <a href="#features" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Features</a>
      <a href="#about" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">About</a>
      <a href="#contact" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact</a>
      <Link to="/login" className="text-xs text-primary-500 hover:text-primary-400 transition-colors">Admin Login</Link>
    </div>
  </footer>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;
