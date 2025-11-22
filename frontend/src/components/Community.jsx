import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Community.css";

export default function Community({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "System",
      text: "Welcome to ColdVault Community! Feel free to discuss, ask questions, and share experiences.",
      timestamp: new Date().toLocaleTimeString(),
      isSystem: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cleanup WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connectWebSocket = () => {
    const websocket = new WebSocket("ws://localhost:8000/ws/chat");

    websocket.onopen = () => {
      console.log("Connected to chat server");
      // Send join message
      websocket.send(JSON.stringify({
        type: "join",
        username: username
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "history":
          // Load message history
          const historyMessages = data.messages.map((msg, index) => ({
            id: messageIdRef.current++,
            user: msg.user || "System",
            text: msg.text,
            timestamp: msg.timestamp,
            isSystem: msg.type === "system",
            isOwn: msg.user === username
          }));
          setMessages(prev => [...prev, ...historyMessages]);
          break;
          
        case "message":
          // New message from user
          setMessages(prev => [...prev, {
            id: messageIdRef.current++,
            user: data.user,
            text: data.text,
            timestamp: data.timestamp,
            isOwn: data.user === username
          }]);
          break;
          
        case "system":
          // System message (join/leave)
          setMessages(prev => [...prev, {
            id: messageIdRef.current++,
            user: "System",
            text: data.text,
            timestamp: data.timestamp,
            isSystem: true
          }]);
          break;
          
        case "warning":
          // Warning message for filtered content
          setMessages(prev => [...prev, {
            id: messageIdRef.current++,
            user: "System",
            text: data.text,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true,
            isWarning: true
          }]);
          break;
          
        case "user_list":
          // Update online users
          setOnlineUsers(data.users);
          break;
          
        case "error":
          alert(data.message);
          setIsJoined(false);
          break;
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessages(prev => [...prev, {
        id: messageIdRef.current++,
        user: "System",
        text: "Connection error. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
    };

    websocket.onclose = () => {
      console.log("Disconnected from chat server");
      setMessages(prev => [...prev, {
        id: messageIdRef.current++,
        user: "System",
        text: "Disconnected from chat. Please refresh to reconnect.",
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
    };

    setWs(websocket);
  };

  const handleJoin = () => {
    if (!username.trim()) return;
    
    setIsJoined(true);
    connectWebSocket();
  };

  const handleSend = () => {
    if (!input.trim() || !ws) return;

    // Send message through WebSocket
    ws.send(JSON.stringify({
      type: "message",
      text: input
    }));
    
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isJoined) {
        handleSend();
      } else {
        handleJoin();
      }
    }
  };

  if (!isJoined) {
    return (
      <div className="community-container">
        <motion.button
          className="back-button"
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Home
        </motion.button>

        <motion.div
          className="join-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="join-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💬
          </motion.div>
          <h1 className="join-title">Join ColdVault Community</h1>
          <p className="join-subtitle">
            Connect with other users, share experiences, and get help
          </p>

          <div className="join-form">
            <input
              type="text"
              className="username-input"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={20}
            />
            <motion.button
              className="join-button"
              onClick={handleJoin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!username.trim()}
            >
              Join Chat
            </motion.button>
          </div>

          <div className="join-features">
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span className="feature-text">Real-time Chat</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <span className="feature-text">Active Community</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💡</span>
              <span className="feature-text">Share Knowledge</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="community-container">
      <motion.button
        className="back-button"
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back to Home
      </motion.button>

      <motion.div
        className="community-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="community-icon">💬</span>
        <div className="header-info">
          <h1 className="community-title">Community Chat</h1>
          <p className="community-subtitle">
            <span className="online-dot"></span>
            {onlineUsers.length} members online
          </p>
        </div>
      </motion.div>

      <div className="chat-layout">
        <motion.div
          className="sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="sidebar-title">Online Users</h3>
          <div className="users-list">
            {onlineUsers.map((user, index) => (
              <motion.div
                key={index}
                className={`user-item ${user === username ? "current-user" : ""}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="user-status"></span>
                <span className="user-name">{user}</span>
              </motion.div>
            ))}
          </div>

          <div className="sidebar-info">
            <h4 className="info-title">Chat Guidelines</h4>
            <ul className="guidelines-list">
              <li>Be respectful and helpful</li>
              <li>Stay on topic (ColdVault)</li>
              <li>No spam or advertisements</li>
              <li>Share knowledge freely</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="chat-main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="messages-container">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.isSystem ? "system-message" : ""} ${
                    msg.isOwn ? "own-message" : ""
                  } ${msg.isWarning ? "warning-message" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {!msg.isSystem && (
                    <div className="message-header">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                  )}
                  <div className="message-content">{msg.text}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <motion.button
              className="send-button"
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!input.trim()}
            >
              <span className="send-icon">📤</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
