#!/usr/bin/env python3
"""
CloudIDE ダッシュボードアプリケーション
アプリケーションサーバーのメインエントリーポイント
"""

import argparse
import os
import socket

from dotenv import load_dotenv

# .env を読み込んで HOST / PORT を反映させる
load_dotenv()

from app import create_app

# アプリケーションインスタンスの作成
app = create_app()


def _parse_cli_args(default_host: str, default_port: int):
    """Allow overriding host/port via CLI flags"""
    parser = argparse.ArgumentParser(description="CloudIDE dashboard server")
    parser.add_argument(
        "--host",
        dest="host",
        default=default_host,
        help="Host/IP to bind (default: HOST env or 0.0.0.0)",
    )
    parser.add_argument(
        "--port",
        dest="port",
        type=int,
        default=default_port,
        help="Port to bind (default: PORT env or 5000)",
    )
    return parser.parse_args()


def _access_host(host: str) -> str:
    """Show a reachable IP when binding to all interfaces"""
    if host != "0.0.0.0":
        return host
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "localhost"


if __name__ == "__main__":
    # デバッグモード（開発環境）で起動
    debug_mode = os.getenv("FLASK_ENV", "development") == "development"
    default_port = int(os.getenv("PORT", 5000))
    default_host = os.getenv("HOST", "0.0.0.0")
    args = _parse_cli_args(default_host, default_port)
    host = args.host
    port = args.port
    access_host = _access_host(host)

    # PowerShell の既定コードページで文字化けしないよう、絵文字は使わない
    print("Starting dashboard application...")
    print(f"Access URL: http://{access_host}:{port}")
    print(f"Debug mode: {debug_mode}")

    app.run(debug=debug_mode, host=host, port=port)
