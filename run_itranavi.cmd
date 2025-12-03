@echo off
setlocal

REM 作業フォルダを固定（超重要：importや相対パスが安定する）
cd /d D:\Apps\iTraNavi

REM 必要なら環境変数（任意）
REM set HOST=127.0.0.1
REM set PORT=5000
REM set SECRET_KEY=change-me

REM ログフォルダ
if not exist logs mkdir logs

REM Waitress起動（IISリバプロ前提なら 127.0.0.1 推奨）
"D:\Apps\iTraNavi\.venv\Scripts\waitress-serve.exe" --listen=127.0.0.1:5000 server.app:app ^
  >> "D:\Apps\iTraNavi\logs\stdout.log" 2>> "D:\Apps\iTraNavi\logs\stderr.log"
