@echo off
title CartCraze WhatsApp Cloudflare Tunnel
echo ===================================================
echo Starting Cloudflare Free Tunnel for OpenWA (Port 2785)
echo ===================================================
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:2785
pause
