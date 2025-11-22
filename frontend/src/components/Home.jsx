import React from "react";
import { motion } from "framer-motion";
import "./Home.css";

export default function Home({ onNavigate }) {
  const sections = [
    {
      id: "evm",
      title: "EVM Based",
      subtitle: "Ethereum Virtual Machine",
      description: "Create keys, sign transactions, and broadcast to EVM networks",
      icon: "⚡",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      available: true,
    },
    {
      id: "bitcoin",
      title: "Bitcoin Based",
      subtitle: "Bitcoin Testnet",
      description: "Create keys, sign transactions, and broadcast to Bitcoin network",
      icon: "₿",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      available: true,
    },
    {
      id: "github",
      title: "GitHub Repository",
      subtitle: "View Source Code",
      description: "Explore the open-source code and contribute",
      icon: "🐙",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      link: "https://github.com/Heykaranraj/coldvault-open-source-wallet",
    },
    {
      id: "sandbox",
      title: "Sandbox Environment",
      subtitle: "GitHub Codespaces",
      description: "Test and develop in a cloud-based development environment",
      icon: "🧪",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      link: "https://github.com/codespaces",
    },
    {
      id: "education",
      title: "Educational Hub",
      subtitle: "Learn & Explore",
      description: "Hardware schematics, tutorials, and interactive README guide",
      icon: "📚",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      available: true,
    },
    {
      id: "community",
      title: "Community Chat",
      subtitle: "Connect & Discuss",
      description: "Join our community to chat, share ideas, and get help from other users",
      icon: "💬",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      available: true,
    },
  ];

  const handleSectionClick = (section) => {
    if (section.link) {
      window.open(section.link, "_blank");
    } else if (section.available) {
      onNavigate(section.id);
    }
  };

  return (
    <div className="home-container">
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="logo-container"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="logo-icon">🧊</span>
        </motion.div>
        <h1 className="hero-title">
          Cold<span className="vault-text">Vault</span>
        </h1>
        <p className="hero-subtitle">
          Your Secure Hardware Cold Wallet Interface
        </p>
        <div className="hero-description">
          <p>
            Open-source Arduino-powered cold wallet with support for multiple
            blockchain networks
          </p>
        </div>
      </motion.div>

      <div className="sections-grid">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className={`section-card ${!section.available && !section.link ? "disabled" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => handleSectionClick(section)}
          >
            <div
              className="section-gradient"
              style={{ background: section.gradient }}
            />
            <div className="section-content">
              <span className="section-icon">{section.icon}</span>
              <h2 className="section-title">{section.title}</h2>
              <p className="section-subtitle">{section.subtitle}</p>
              <p className="section-description">{section.description}</p>
              {!section.available && !section.link && (
                <span className="coming-soon-badge">Coming Soon</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="footer-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://github.com/Heykaranraj"
            target="_blank"
            rel="noopener noreferrer"
          >
            @teamcoldvault
          </a>
        </p>
      </motion.div>
    </div>
  );
}
