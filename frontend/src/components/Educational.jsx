import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReadmeChatbot from "./ReadmeChatbot";
import "./Educational.css";

export default function Educational({ onBack }) {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "hardware",
      title: "Hardware Schematics",
      icon: "⚙️",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "readme",
      title: "Interactive README",
      icon: "📖",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "security",
      title: "Security Best Practices",
      icon: "🔒",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: "tutorials",
      title: "Video Tutorials",
      icon: "🎬",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const hardwareInfo = {
    components: [
      { name: "Arduino Uno/Mega", description: "Main microcontroller board" },
      { name: "USB Cable", description: "For serial communication" },
      {
        name: "Power Supply",
        description: "5V power adapter or USB power",
      },
      {
        name: "Optional: OLED Display",
        description: "For displaying wallet info",
      },
      {
        name: "Optional: Buttons",
        description: "For hardware-based confirmation",
      },
    ],
    connections: [
      {
        step: 1,
        description: "Connect Arduino to your computer via USB cable",
      },
      {
        step: 2,
        description: "Ensure proper drivers are installed for serial communication",
      },
      {
        step: 3,
        description: "Upload the cold wallet firmware to Arduino",
      },
      {
        step: 4,
        description: "Configure serial port settings (default: 9600 baud)",
      },
    ],
    diagram: `
╔════════════════════════════════════════╗
║         ARDUINO UNO/MEGA              ║
║                                        ║
║  [USB Port] ←→ Computer               ║
║                                        ║
║  Optional Components:                  ║
║  ├─ OLED Display (I2C)                ║
║  ├─ Confirm Button (Pin 2)            ║
║  └─ Status LED (Pin 13)               ║
║                                        ║
╚════════════════════════════════════════╝
           ↓
    [USB Connection]
           ↓
╔════════════════════════════════════════╗
║         YOUR COMPUTER                  ║
║  ColdVault Backend (Python + FastAPI) ║
║  ColdVault Frontend (React + Vite)    ║
╚════════════════════════════════════════╝
    `,
  };

  const securityPractices = [
    {
      title: "Air-Gapped Operation",
      description:
        "For maximum security, use a dedicated computer that never connects to the internet",
      icon: "🔌",
      link: "https://www.micromindercs.com/blog/air-gap-security",
    },
    {
      title: "Verify Transactions",
      description:
        "Always verify transaction details on the Arduino display before signing",
      icon: "✅",
      link: "https://webarchive.inf.unibe.ch/cds/publications/files/Serdil_Mordeniz_Veritaa_Signing_Transactions_on_Arduino.pdf",
    },
    {
      title: "Backup Your Keys",
      description:
        "Store recovery phrases in multiple secure physical locations",
      icon: "💾",
      link: "https://vault12.com/learn/cryptocurrency-security-how-to/recovery-phrase-usb-drive-backup/",
    },
    {
      title: "Keep Firmware Updated",
      description:
        "Regularly update Arduino firmware and Python backend for security patches",
      icon: "🔄",
    },
    {
      title: "Use Strong Passwords",
      description:
        "Protect your setup with strong passwords and encryption where possible",
      icon: "🔐",
      link: "https://www.cisa.gov/secure-our-world/use-strong-passwords",
    },
  ];

  const tutorials = [
    {
      title: "Setting Up ColdVault - Installation Guide",
      description: "Complete installation guide: Arduino setup, Python dependencies, and web interface configuration",
      thumbnail: "🎯",
      category: "setup",
      videoUrl: "", // Add YouTube link here
      topics: ["Arduino Installation", "Python Backend Setup", "Frontend Configuration", "Serial Port Setup"]
    },
    {
      title: "How ColdVault Works - Complete Overview",
      description: "Understanding the architecture, security model, transaction flow, and offline signing process",
      thumbnail: "⚙️",
      category: "working",
      videoUrl: "", // Add YouTube link here
      topics: ["System Architecture", "Security Model", "Transaction Flow", "Offline Signing"]
    },
  ];

  return (
    <div className="educational-container">
      <motion.button
        className="back-button"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Home
      </motion.button>

      <motion.div
        className="educational-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="educational-icon">📚</span>
        <h1 className="educational-title">Educational Hub</h1>
        <p className="educational-subtitle">
          Learn everything about ColdVault hardware and security
        </p>
      </motion.div>

      <div className="sections-selector">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            className={`section-button ${activeSection === section.id ? "active" : ""}`}
            style={{ "--section-gradient": section.gradient }}
            onClick={() => setActiveSection(section.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="section-button-icon">{section.icon}</span>
            <span className="section-button-text">{section.title}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "hardware" && (
          <motion.div
            key="hardware"
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="content-title">Hardware Schematics</h2>

            <div className="hardware-grid">
              <div className="hardware-card">
                <h3 className="hardware-card-title">
                  <span className="hardware-icon">🔧</span>
                  Required Components
                </h3>
                <ul className="components-list">
                  {hardwareInfo.components.map((comp, i) => (
                    <li key={i} className="component-item">
                      <span className="component-name">{comp.name}</span>
                      <span className="component-desc">{comp.description}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hardware-card">
                <h3 className="hardware-card-title">
                  <span className="hardware-icon">🔌</span>
                  Setup Instructions
                </h3>
                <ol className="instructions-list">
                  {hardwareInfo.connections.map((conn, i) => (
                    <li key={i} className="instruction-item">
                      <span className="step-number">Step {conn.step}</span>
                      <span className="step-description">{conn.description}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="diagram-card">
              <h3 className="diagram-title">
                <span className="hardware-icon">📐</span>
                System Architecture
              </h3>
              <div className="architecture-container">
                <img 
                  src="/hardware_schematics.jpeg" 
                  alt="Hardware Schematics" 
                  className="hardware-schematic-image"
                />
                <pre className="diagram-content">{hardwareInfo.diagram}</pre>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "readme" && (
          <motion.div
            key="readme"
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ReadmeChatbot />
          </motion.div>
        )}

        {activeSection === "security" && (
          <motion.div
            key="security"
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="content-title">Security Best Practices</h2>
            <div className="security-grid">
              {securityPractices.map((practice, i) => (
                <motion.div
                  key={i}
                  className="security-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => practice.link && window.open(practice.link, "_blank")}
                  style={{ cursor: practice.link ? "pointer" : "default" }}
                >
                  <span className="security-icon">{practice.icon}</span>
                  <h3 className="security-title">{practice.title}</h3>
                  <p className="security-description">{practice.description}</p>
                  {practice.link && (
                    <span className="learn-more">Learn more →</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "tutorials" && (
          <motion.div
            key="tutorials"
            className="content-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="content-title">Video Tutorials</h2>
            
            <div className="featured-section">
              <h3 className="featured-title">
                <span className="featured-icon">⭐</span>
                Getting Started - Essential Tutorials
              </h3>
              <div className="tutorials-grid featured">
                {tutorials.map((tutorial, i) => (
                  <motion.div
                    key={i}
                    className="tutorial-card featured-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => tutorial.videoUrl && window.open(tutorial.videoUrl, "_blank")}
                    style={{ cursor: tutorial.videoUrl ? "pointer" : "default" }}
                  >
                    <div className="tutorial-thumbnail featured-thumbnail">
                      {tutorial.thumbnail}
                    </div>
                    <div className="tutorial-info">
                      <div className="tutorial-badge">
                        {tutorial.category === "setup" ? "🔧 Setup" : "📚 Overview"}
                      </div>
                      <h3 className="tutorial-title">{tutorial.title}</h3>
                      <p className="tutorial-description">{tutorial.description}</p>
                      <div className="tutorial-topics">
                        {tutorial.topics.map((topic, idx) => (
                          <span key={idx} className="topic-tag">{topic}</span>
                        ))}
                      </div>
                      <div className="tutorial-meta">
                        <button 
                          className="watch-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (tutorial.videoUrl) {
                              window.open(tutorial.videoUrl, "_blank");
                            }
                          }}
                          disabled={!tutorial.videoUrl}
                        >
                          {tutorial.videoUrl ? "Watch on YouTube →" : "Coming Soon"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="tutorials-note">
              <div className="note-icon">📹</div>
              <div className="note-content">
                <h4 className="note-title">Video Tutorials Coming Soon!</h4>
                <p className="note-text">
                  We're currently recording comprehensive video tutorials for all topics. 
                  Follow us on GitHub to get notified when they're available.
                </p>
                <button 
                  className="github-follow-button"
                  onClick={() => window.open("https://github.com/Heykaranraj/ColdVault-Open-Source-Wallet", "_blank")}
                >
                  ⭐ Star on GitHub
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!activeSection && (
          <motion.div
            key="placeholder"
            className="placeholder-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="placeholder-icon">👆</span>
            <p className="placeholder-text">
              Select a section above to start learning
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
