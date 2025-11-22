import sys
import io
import os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', line_buffering=True)
os.environ["PYTHONUNBUFFERED"] = "1"

import json
import time
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict

import requests
from bit import PrivateKeyTestnet

BASE_DIR = Path(__file__).resolve().parent
PENDING_FILE = BASE_DIR / "pending_transaction.json"
BLOCKSTREAM_TESTNET_API = "https://blockstream.info/testnet/api/tx"


def satoshis_to_btc(satoshis: int) -> Decimal:
    return Decimal(satoshis) / Decimal(100_000_000)


def load_pending_transaction() -> Dict[str, Any] | None:
    if not PENDING_FILE.exists():
        print("❌ No pending Bitcoin transaction found! Run 3test_sign_hash.py first.")
        return None
    try:
        return json.loads(PENDING_FILE.read_text())
    except Exception as e:
        print("❌ Error loading pending transaction:", e)
        return None


def verify_transaction_data(tx_data: Dict[str, Any]) -> bool:
    required = ["transaction", "private_key_wif", "address"]
    for r in required:
        if r not in tx_data:
            print(f"❌ Missing field: {r}")
            return False
    tx = tx_data["transaction"]
    for f in ("from_address", "to_address", "amount_sats"):
        if f not in tx:
            print(f"❌ Transaction missing: {f}")
            return False
    return True


def broadcast_raw_transaction(raw_tx_hex: str) -> str | None:
    try:
        response = requests.post(BLOCKSTREAM_TESTNET_API, data=raw_tx_hex, headers={"Content-Type": "text/plain"}, timeout=30)
        if response.status_code == 200:
            txid = response.text.strip()
            print("✅ Raw transaction broadcasted! TXID:", txid)
            print("Explorer:", f"https://blockstream.info/testnet/tx/{txid}")
            return txid
        print("❌ Broadcast failed:", response.status_code, response.text)
        return None
    except requests.RequestException as e:
        print("❌ Network error:", e)
        return None


def python_fallback_broadcast(transaction: Dict[str, Any], wif: str, fee_sats: int | None) -> str | None:
    try:
        key = PrivateKeyTestnet(wif)
    except Exception as e:
        print("❌ Could not load WIF:", e)
        return None

    outputs = [
        (transaction["to_address"], satoshis_to_btc(transaction["amount_sats"]), "btc")
    ]

    try:
        if fee_sats:
            print("📡 Broadcasting with explicit fee via bit library...")
            tx_hex = key.send(outputs, fee=fee_sats, absolute_fee=True)
        else:
            print("📡 Broadcasting via bit library...")
            tx_hex = key.send(outputs)
    except Exception as e:
        print("❌ Python signing/broadcast failed:", e)
        return None

    print("✅ Broadcasted via bit library. TXID:", tx_hex)
    print("Explorer:", f"https://blockstream.info/testnet/tx/{tx_hex}")
    return tx_hex


def cleanup_pending():
    try:
        PENDING_FILE.unlink()
        print("🧹 Removed pending file")
    except Exception:
        pass


def main():
    print("=" * 60)
    print("BITCOIN TESTNET - BROADCAST TRANSACTION")
    print("=" * 60)
    
    tx_data = load_pending_transaction()
    if not tx_data:
        return

    if not verify_transaction_data(tx_data):
        return

    tx = tx_data["transaction"]
    sig = tx_data.get("signature")

    print("\n📋 Transaction Details:")
    print(f"   From: {tx['from_address']}")
    print(f"   To: {tx['to_address']}")
    print(f"   Amount: {tx['amount_sats']} sats ({satoshis_to_btc(tx['amount_sats']):.8f} BTC)")
    print(f"   Fee: {tx.get('fee_sats', 0)} sats")
    print(f"   Signed: {'yes' if sig else 'no'}")
    
    print("\n⚠️  Broadcasting to Bitcoin TESTNET network...")

    # If Arduino-signed raw hex provided, try broadcast that
    if tx_data.get("raw_transaction_hex"):
        print("\n📡 Attempting to broadcast raw Arduino-signed transaction...")
        txid = broadcast_raw_transaction(tx_data["raw_transaction_hex"])
        if txid:
            cleanup_pending()
            return

    # Otherwise use Python fallback
    print("\n📡 Using Python fallback broadcast...")
    fee = tx.get("fee_sats")
    txid = python_fallback_broadcast(tx, tx_data.get("private_key_wif"), fee)
    if txid:
        cleanup_pending()
        print("\n✅ Transaction successfully broadcasted!")
    else:
        print("\n❌ Broadcast failed")


if __name__ == '__main__':
    main()