#!/bin/bash

# 推送代码到 GitHub 的脚本
# 使用方法：bash push-now.sh

echo "准备推送代码到 GitHub..."
echo "仓库：https://github.com/PrimePlayer2098/PlayerChat.git"
echo ""
echo "执行推送命令..."
echo "当提示输入用户名时，请输入：PrimePlayer2098"
echo "当提示输入密码时，请粘贴你的 Personal Access Token"
echo ""

cd "/Users/liyangyang/Documents/cursor/日常项目/chat-app"
git push -u origin main

echo ""
if [ $? -eq 0 ]; then
    echo "✅ 代码推送成功！"
    echo ""
    echo "下一步：告诉我推送已完成，我会帮你部署应用！"
else
    echo "❌ 推送失败，请检查 token 是否正确"
fi

