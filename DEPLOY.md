# デプロイ手順（本番寄り）

Flask アプリを WSGI サーバー（Waitress）で動かし、必要に応じてリバースプロキシを前段に置く構成です。データは SQLite `data/app.db`、アップロードは `uploads/` に保存されます。

## 前提
- Python 3.10+（開発と同じ系）
- `pip install -r requirements.txt`（`waitress` も含む）
- ポート: アプリ内部は既定で 5000。プロキシを置くなら外向け 80/443 を利用。

## 環境変数とパス
- プロジェクト直下に `.env`（任意）:
  ```
  HOST=0.0.0.0
  PORT=5000
  SECRET_KEY=change-me
  ```
- パス: `data/`（SQLite）、`uploads/`（ファイル）。サービス実行ユーザーが書き込み可能にする。

## Waitress で直接起動（プロキシなし）
```bash
cd /path/to/iTraNavi
python -m venv .venv
./.venv/Scripts/Activate.ps1   # Windows PowerShell
# source .venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
waitress-serve --host=0.0.0.0 --port=5000 "server.app:app"
```

## リバースプロキシ併用（例: nginx）
- バックエンド: Waitress を `127.0.0.1:5000` で待受。
- nginx の例（イメージ）:
  ```
  server {
    listen 80;
    server_name _;
    location / { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host; }
    location /uploads/ { proxy_pass http://127.0.0.1:5000; }
    # 必要に応じて TLS, gzip, 認証を追加
  }
  ```

## サービス化の例
- Windows: タスクスケジューラやサービスラッパーで上記 Waitress コマンドを常駐。作業ディレクトリをリポジトリ直下に設定し、`.venv` の python をフルパス指定。
- Linux (systemd 例):
  ```
  [Unit]
  Description=iTraNavi API
  After=network.target

  [Service]
  WorkingDirectory=/opt/iTraNavi
  Environment="HOST=0.0.0.0" "PORT=5000" "SECRET_KEY=change-me"
  ExecStart=/opt/iTraNavi/.venv/bin/waitress-serve --host=0.0.0.0 --port=5000 server.app:app
  Restart=always

  [Install]
  WantedBy=multi-user.target
  ```

## 注意点
- バックアップ: `data/app.db` と `uploads/` をセットでバックアップ。
- ログ: Waitress は stdout/stderr に出力するので、systemd やラッパーで収集。プロキシ（nginx）があればアクセス/エラーログはそちらで管理。
- HTTPS: 本番ではプロキシ側で TLS を終端するのがおすすめ。
