<#
.SYNOPSIS
  run.ps1 - Flask アプリを PowerShell から簡単に起動するスクリプト

.DESCRIPTION
  - 仮想環境 (venv) を自動作成・有効化
  - requirements.txt をインストール（存在しない場合は警告）
  - 開発モードでは python app.py を起動
  - 本番モードでは waitress-serve を使って起動

.PARAMETERS
  -Mode: 'dev' (default) or 'prod'
  -Port: ポート番号（default 5000）
  -Host: バインドするホスト（default 0.0.0.0）
#>

param(
  [ValidateSet('dev','prod')]
  [string]$Mode = 'dev',
  [int]$Port = 5000,
  [string]$BindHost = '0.0.0.0'
)

# スクリプトの場所へ移動
Set-Location $PSScriptRoot

Write-Host "run.ps1 starting (Mode=$Mode, BindHost=$BindHost, Port=$Port)" -ForegroundColor Cyan

# 実行ポリシーを一時的に緩和
try { Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force } catch { }

# 仮想環境の作成
if (-not (Test-Path .\venv)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# 仮想環境有効化
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
. .\venv\Scripts\Activate.ps1

# pip と依存のインストール
Write-Host "Upgrading pip and installing requirements..." -ForegroundColor Yellow
python -m pip install --upgrade pip
if (Test-Path .\requirements.txt) {
    pip install -r requirements.txt
} else {
    Write-Host "requirements.txt not found; skipping pip install." -ForegroundColor Red
}

# Bind host/port so app.py picks them up in dev mode as well
$env:HOST = $BindHost
$env:PORT = $Port

if ($Mode -eq 'prod') {
  Write-Host "Starting in production mode (Waitress)..." -ForegroundColor Green
  python -m pip install --upgrade waitress > $null 2>&1
  waitress-serve --call "app:create_app" --host $BindHost --port $Port
} else {
  Write-Host "Starting in development mode (python app.py)..." -ForegroundColor Green
  python app.py --host $BindHost --port $Port
}

Write-Host "run.ps1 finished." -ForegroundColor Cyan
