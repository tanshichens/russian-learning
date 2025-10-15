@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   俄语学习网站 - 关闭服务
echo ========================================
echo.

echo 正在关闭后端API服务器...
taskkill /FI "WINDOWTITLE eq 后端API服务器*" /F >nul 2>&1

echo 正在关闭前端开发服务器...
taskkill /FI "WINDOWTITLE eq 前端开发服务器*" /F >nul 2>&1

echo 正在关闭Node进程（后端）...
taskkill /IM node.exe /F >nul 2>&1

echo 正在关闭Vite进程（前端）...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo ========================================
echo   所有服务已关闭！
echo ========================================
echo.
pause

