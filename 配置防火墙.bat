@echo off
echo ========================================
echo   配置Windows防火墙
echo   允许手机访问俄语学习网站
echo ========================================
echo.
echo 需要管理员权限...
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 错误：需要管理员权限！
    echo 请右键此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

echo 正在添加防火墙规则...
echo.

REM 添加前端端口规则
netsh advfirewall firewall add rule name="俄语学习网站-前端" dir=in action=allow protocol=TCP localport=5173
echo ✓ 已允许端口 5173（前端）

REM 添加后端端口规则
netsh advfirewall firewall add rule name="俄语学习网站-后端API" dir=in action=allow protocol=TCP localport=3001
echo ✓ 已允许端口 3001（后端API）

echo.
echo ========================================
echo   防火墙配置完成！
echo.
echo   已允许的端口：
echo   - 5173（前端网站）
echo   - 3001（后端API）
echo.
echo   现在手机应该可以访问了！
echo ========================================
echo.
pause

