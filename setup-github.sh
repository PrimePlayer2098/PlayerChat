#!/bin/bash

# GitHub 仓库设置脚本
# 使用方法：bash setup-github.sh <你的GitHub用户名> <仓库名称>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "使用方法: bash setup-github.sh <GitHub用户名> <仓库名称>"
    echo "例如: bash setup-github.sh yourusername chat-app"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2

echo "正在设置 GitHub 仓库..."
echo "GitHub 用户名: $GITHUB_USER"
echo "仓库名称: $REPO_NAME"

# 检查是否已经有远程仓库
if git remote get-url origin 2>/dev/null; then
    echo "检测到已存在的远程仓库，是否要更新？(y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        echo "已取消"
        exit 0
    fi
    git remote remove origin
fi

# 添加远程仓库
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo ""
echo "✅ 远程仓库已添加"
echo ""
echo "下一步："
echo "1. 请先在 GitHub 上创建仓库: https://github.com/new"
echo "   仓库名称: $REPO_NAME"
echo "   选择 Public（公开）"
echo "   不要勾选 'Initialize this repository with a README'"
echo ""
echo "2. 创建完成后，运行以下命令推送代码："
echo "   git push -u origin main"
echo ""
echo "或者，如果你想让我帮你推送，请告诉我仓库已创建完成"

