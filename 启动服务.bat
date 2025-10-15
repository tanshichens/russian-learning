@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   俄语学习网站 - 启动服务
echo ========================================
echo.

echo [1/2] 启动后端API服务器...
cd backend
start "后端API服务器" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
cd ..

echo [2/2] 启动前端开发服务器...
start "前端开发服务器" cmd /k "npm run dev"

echo.
echo ========================================
echo   服务启动成功！
echo ========================================
echo.
echo   本机访问地址:
echo   http://localhost:5173
echo.

REM 获取局域网IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set ip=%%a
    set ip=!ip:~1!
    echo   手机/平板访问地址:
    echo   http://!ip!:5173
    echo.
)

echo   后端API运行在:
echo   http://localhost:3001
echo.
echo ========================================
echo   提示:
echo   1. 保持打开的两个窗口运行
echo   2. 手机需连接同一WiFi
echo   3. 如手机无法访问，检查防火墙设置
echo ========================================
echo.
pause

