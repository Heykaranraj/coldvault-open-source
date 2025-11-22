#!/usr/bin/env python3
"""
2get_walletbtc2.py
Load wallet info from btc_wallet_info.json and display it
"""
import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
os.environ["PYTHONUNBUFFERED"] = "1"

import json
import time
from pathlib import Path
from bit import PrivateKeyTestnet


BASE_DIR = Path(__file__).resolve().parent
WALLET_FILE = BASE_DIR / "btc_wallet_info.json"


def load_wallet_info():
    """Load wallet information from file"""
    try:
        if not WALLET_FILE.exists():
            print("❌ No wallet file found!")
            print("   Please create a wallet first using 'Create New Key'")
            return None
        
        wallet_data = json.loads(WALLET_FILE.read_text())
        return wallet_data
    except Exception as e:
        print(f"❌ Failed to load wallet: {e}")
        return None


def verify_wallet(wallet_data):
    """Verify wallet data and display information"""
    try:
        wif = wallet_data.get("private_key_wif")
        if not wif:
            print("❌ No WIF found in wallet file")
            return False

        key = PrivateKeyTestnet(wif)
        address = key.address
        priv_hex = key.to_hex()

        print("\n" + "=" * 60)
        print("BITCOIN TESTNET WALLET INFORMATION")
        print("=" * 60)
        print(f"✅ Address: {address}")
        print(f"🔑 Private Key (HEX): {priv_hex}")
        print(f"🔑 Private Key (WIF): {wif}")
        print(f"🔐 Public Key: {key.public_key.hex()}")
        print(f"🌐 Network: {wallet_data.get('network', 'bitcoin-testnet')}")
        
        if 'retrieved_at' in wallet_data:
            timestamp = time.strftime('%Y-%m-%d %H:%M:%S', 
                                     time.localtime(wallet_data['retrieved_at']))
            print(f"📅 Created/Retrieved: {timestamp}")
        
        print("=" * 60)
        print("\n✅ Wallet loaded successfully!")
        print("💡 You can now sign transactions with this wallet")
        
        return True

    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False


def main():
    print("=" * 60)
    print("LOADING BITCOIN TESTNET WALLET")
    print("=" * 60)
    
    wallet_data = load_wallet_info()
    if not wallet_data:
        return
    
    verify_wallet(wallet_data)


if __name__ == '__main__':
    main()
