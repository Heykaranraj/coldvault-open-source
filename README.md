🧊 ColdVault — Arduino-Based Cold Wallet

ColdVault is a secure, hardware-integrated Ethereum cold wallet that connects an Arduino to a web interface powered by Python scripts, FastAPI, and a Vite-based React frontend.
Every function (Create Key, Get Wallet, Sign Hash, Broadcast Tx) runs through dedicated Python scripts executed on your machine and connected directly to your Arduino device.

🌐 Open-Source & Community Driven
Our project is fully open-source.
We encourage developers to:
Audit the entire codebase
Suggest UI improvements
Enhance cryptographic security
Submit pull requests
Build additional blockchain integrations

⚙️ Features
🔐 Secure private-key generation and storage on Arduino
💻 Run Python scripts directly from the web UI
⚡ Live output via WebSocket (terminal-style streaming)
🧩 FastAPI backend + React (Vite) frontend
🎨 Beautiful UI (pure CSS — no Tailwind)
🪄 One-click actions → each button triggers a backend Python script

📁 Project Structure
coldvault-web/
├── backend/
│   ├── app.py                # FastAPI backend (WebSocket + script execution)
│   ├── 1create_key.py        # Creates new Ethereum wallet
│   ├── 2get_wallet.py        # Fetches wallet info
│   ├── 3test_sign_hash.py    # Signs Ethereum hashes
│   ├── 4broadcast_tx.py      # Broadcasts signed transactions
│   └── .venv/                # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # UI with four action buttons + terminal
│   │   ├── Terminal.jsx      # Live terminal output component
│   │   └── main.jsx
│   ├── index.html
│
└── README.md

🧠 How It Works

Each button in the UI runs a corresponding Python script on the backend:
UI Button	Python Script	Function
🟢 Create Key	1create_key.py	Generates new Ethereum keypair
🔵 Get Wallet	2get_wallet.py	Fetches wallet address & data
🟣 Sign Hash	3test_sign_hash.py	Signs transaction hash using Arduino
🟠 Broadcast Tx	4broadcast_tx.py	Pushes signed transaction to network
Execution Flow

User clicks a button
Frontend sends script command via WebSocket
FastAPI backend starts the Python subprocess
Script communicates with Arduino
Output is streamed live to the web terminal

🧰 Local Setup Guide
1️⃣ Backend Setup
cd backend
python -m venv .venv
.\.venv\Scripts\activate     # On Windows
pip install fastapi uvicorn pyserial

Run the backend
uvicorn app:app --host 127.0.0.1 --port 8000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open the local development URL (usually:
👉 http://localhost:5173
)

💡 Usage

Connect Arduino via USB
Start backend server
Start frontend UI
Click any of the four buttons:
Create Key
Get Wallet
Sign Hash
Broadcast Tx

Watch the live terminal output stream to the screen
🙏 Credits

If you use or modify this project, kindly credit the creators:
@teamcoldvault


