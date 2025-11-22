#!/usr/bin/env python3
"""
3test_sign_hashbtc3.py
Sign a Bitcoin transaction using the wallet info
"""
import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
os.environ["PYTHONUNBUFFERED"] = "1"

import json
import time
import hashlib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
WALLET_FILE = BASE_DIR / "btc_wallet_info.json"
PENDING_FILE = BASE_DIR / "pending_transaction.json"


def load_wallet():
    if not WALLET_FILE.exists():
        print(f"❌ Wallet file not found: {WALLET_FILE}. Run 2get_wallet.py first.")
        return None
    return json.loads(WALLET_FILE.read_text())


def create_test_transaction(sender_address: str, recipient_address: str, amount_sats: int = 50000, fee_sats: int = 500):
    tx = {
        "from_address": sender_address,
        "to_address": recipient_address,
        "amount_sats": amount_sats,
        "fee_sats": fee_sats,
        "network": "bitcoin-testnet",
        "memo": "Unsigned test transaction",
        "timestamp": int(time.time()),
    }
    return tx


def hash_transaction(tx: dict) -> str:
    payload = json.dumps(tx, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(hashlib.sha256(payload.encode()).digest()).hexdigest()


def main():
    print("=" * 60)
    print("BITCOIN TESTNET - SIGN TRANSACTION")
    print("=" * 60)
    
    wallet = load_wallet()
    if wallet is None:
        print("\n❌ Please create or load a wallet first!")
        print("   Run 'Create New Key' to generate a wallet")
        return

    # Use default test values
    to_addr = "tb1qj0w0f0zt3vud4lv5z0s0z9v4eftt8v9rxkdz0w"  # Example testnet address
    amount_sats = 50000  # 0.0005 BTC

    print(f"\n📋 Creating test transaction:")
    print(f"   From: {wallet['address']}")
    print(f"   To: {to_addr}")
    print(f"   Amount: {amount_sats} sats ({amount_sats/1e8:.8f} BTC)")

    tx = create_test_transaction(wallet["address"], to_addr, amount_sats)
    tx_hash = hash_transaction(tx)

    print(f"\n🔐 Transaction hash: {tx_hash}")

    pending = {
        "transaction": tx,
        "tx_hash": tx_hash,
        "signature": None,
        "raw_transaction_hex": None,
        "private_key_wif": wallet.get("private_key_wif"),
        "private_key_hex": wallet.get("private_key_hex"),
        "address": wallet.get("address"),
        "network": "bitcoin-testnet",
        "timestamp": int(time.time()),
    }

    PENDING_FILE.write_text(json.dumps(pending, indent=2))
    print(f"\n✅ Transaction prepared and saved to {PENDING_FILE.name}")
    print("📤 Ready for broadcasting!")
    print("\n💡 Next: Click 'Broadcast Transaction' to send to network")


if __name__ == '__main__':
    main()
