# backend/app.py
import asyncio
import json
import sys
import os
import subprocess
import threading
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from queue import Queue
from chat_server import handle_chat_websocket

ROOT = Path(__file__).parent.resolve()
app = FastAPI(title="ColdVault Backend (Terminal)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # in prod: replace "*" with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# map the simple button keys to script filenames
SCRIPT_MAP = {
    "create_key": "1create_key.py",
    "get_wallet": "2get_wallet.py",
    "sign_hash": "3test_sign_hash.py",
    "broadcast_tx": "4broadcast_tx.py",
    "create_key_btc": "1create_keybtc.py",
    "get_wallet_btc": "2get_walletbtc2.py",
    "sign_hash_btc": "3test_sign_hashbtc3.py",
    "broadcast_tx_btc": "4broadcast_txbtc4.py",
}


def run_script_thread(script_path, python_exe, output_queue, cwd):
    """Run script in a thread and put output lines in queue"""
    try:
        process = subprocess.Popen(
            [python_exe, "-u", str(script_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=str(cwd),
            bufsize=1,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"}
        )
        
        for line in iter(process.stdout.readline, b''):
            try:
                decoded_line = line.decode('utf-8', errors='replace').rstrip()
                output_queue.put(("line", decoded_line))
            except Exception as e:
                output_queue.put(("line", f"[decode error: {e}]"))
        
        process.wait()
        output_queue.put(("exit", process.returncode))
    except Exception as e:
        output_queue.put(("error", repr(e)))


@app.websocket("/ws/run")
async def ws_run(ws: WebSocket):
    """Accepts a single JSON message like {"cmd":"create_key"} then streams live output."""
    await ws.accept()
    thread = None
    try:
        msg = await ws.receive_text()
        try:
            payload = json.loads(msg)
            cmd = payload.get("cmd")
        except Exception:
            await ws.send_text("[error] invalid JSON command")
            await ws.close()
            return

        if cmd not in SCRIPT_MAP:
            await ws.send_text(f"[error] unknown command: {cmd}")
            await ws.close()
            return

        script_path = ROOT / SCRIPT_MAP[cmd]
        if not script_path.exists():
            await ws.send_text(f"[error] script not found: {script_path}")
            await ws.close()
            return

        # Use the Python that runs uvicorn (so environment matches)
        python_exe = sys.executable

        await ws.send_text(f"> Running {SCRIPT_MAP[cmd]} ...")
        print("[DEBUG] launching:", python_exe, script_path)

        # Create queue for thread communication
        output_queue = Queue()
        
        # Start script in thread
        thread = threading.Thread(
            target=run_script_thread,
            args=(script_path, python_exe, output_queue, ROOT),
            daemon=True
        )
        thread.start()

        # Stream output from queue
        try:
            while True:
                # Check queue with timeout to allow websocket disconnect detection
                try:
                    # Process all available messages immediately
                    while not output_queue.empty():
                        msg_type, msg_data = output_queue.get_nowait()
                        
                        if msg_type == "line":
                            await ws.send_text(msg_data)
                        elif msg_type == "exit":
                            await ws.send_text(f"\n[exit] code {msg_data}")
                            await ws.close()
                            return
                        elif msg_type == "error":
                            await ws.send_text(f"[error] {msg_data}")
                            await ws.close()
                            return
                    
                    # Check if thread is still alive
                    if not thread.is_alive() and output_queue.empty():
                        await ws.send_text("\n[exit] Process completed")
                        await ws.close()
                        return
                    
                    # Very small delay to prevent CPU spinning
                    await asyncio.sleep(0.001)
                        
                except asyncio.CancelledError:
                    break
                    
        except WebSocketDisconnect:
            print("Client disconnected")
        except Exception as e:
            await ws.send_text(f"[error] streaming failed: {repr(e)}")
            print("[ERROR] streaming:", repr(e))

    except WebSocketDisconnect:
        print("WebSocket disconnected before command")
    except Exception as e:
        print("Unhandled error in ws_run:", repr(e))
        try:
            await ws.send_text(f"[error] {repr(e)}")
            await ws.close()
        except:
            pass


@app.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    """WebSocket endpoint for community chat"""
    await handle_chat_websocket(websocket)
