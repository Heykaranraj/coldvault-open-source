import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Terminal from "../Terminal";
import "./EVMWallet.css";

export default function EVMWallet({ onBack }) {
  const termRef = useRef();
  const wsUrl = "ws://localhost:8000/ws/run";
  const [showQR, setShowQR] = useState(false);

  const operations = [
    {
      id: "create_key",
      title: "Create New Key",
      icon: "",
      description: "Generate a new Ethereum private key on Arduino",
      color: "#667eea",
    },
    {
      id: "get_wallet",
      title: "Get Wallet Info",
      icon: "",
      description: "Retrieve wallet address and balance",
      color: "#4facfe",
    },
    {
      id: "sign_hash",
      title: "Sign Transaction",
      icon: "",
      description: "Sign a transaction hash with your private key",
      color: "#f093fb",
    },
    {
      id: "broadcast_tx",
      title: "Broadcast Transaction",
      icon: "",
      description: "Broadcast signed transaction to the network",
      color: "#43e97b",
    },
  ];

  return (
    <div className="evm-container">
      <motion.button
        className="back-button"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Home
      </motion.button>

      <motion.div
        className="evm-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="evm-icon">⚡</span>
        <h1 className="evm-title">EVM Based Wallet</h1>
        <p className="evm-subtitle">
          Ethereum Virtual Machine Cold Wallet Operations
        </p>
      </motion.div>

      <div className="evm-content">
        <motion.div
          className="operations-panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="panel-title">Operations</h2>
          <div className="operations-grid">
            {operations.map((op, index) => (
              <motion.button
                key={op.id}
                className="operation-card"
                style={{ "--op-color": op.color }}
                onClick={() => {
                  termRef.current?.runCmd(op.id);
                  if (op.id === "get_wallet") {
                    setShowQR(true);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="operation-icon">{op.icon}</span>
                <h3 className="operation-title">{op.title}</h3>
                <p className="operation-description">{op.description}</p>
              </motion.button>
            ))}
          </div>

          {showQR && (
            <motion.div
              className="qr-code-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="qr-title">Wallet QR Code</h3>
              <img src="/qqre.png" alt="Wallet QR Code" className="qr-image" />
              <button 
                className="close-qr-button"
                onClick={() => setShowQR(false)}
              >
                ✕ Close
              </button>
            </motion.div>
          )}

          <motion.button
            className="clear-button"
            onClick={() => {
              termRef.current?.clear();
              setShowQR(false);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🧹 Clear Terminal
          </motion.button>
        </motion.div>

        <motion.div
          className="terminal-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="terminal-header">
            <h2 className="panel-title">Activity Log</h2>
            <div className="terminal-indicators">
              <span className="indicator red"></span>
              <span className="indicator yellow"></span>
              <span className="indicator green"></span>
            </div>
          </div>
          <p className="terminal-description">
            Real-time output from Arduino cold wallet scripts
          </p>
          <div className="terminal-wrapper">
            <Terminal ref={termRef} wsUrl={wsUrl} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
