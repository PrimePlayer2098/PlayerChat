# 推送到 GitHub 的步骤

## 1. 在 GitHub 上创建仓库

访问 https://github.com/new 并创建新仓库：
- Repository name: `chat-app`
- Description: `AI Chat - ChatGPT 风格对话应用`
- 选择 **Public**（公开）
- **不要**勾选 "Initialize this repository with a README"
- 点击 "Create repository"

## 2. 推送代码到 GitHub

将下面的 `yourusername` 替换为你的 GitHub 用户名，然后执行：

```bash
# 添加远程仓库
git remote add origin https://github.com/yourusername/chat-app.git

# 推送代码
git push -u origin main
```

如果提示需要认证，请使用 GitHub Personal Access Token 作为密码。

## 3. 获取 Personal Access Token（如果需要）

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 设置权限：至少勾选 `repo` 权限
4. 生成后复制 token（只显示一次）
5. 推送时，用户名使用你的 GitHub 用户名，密码使用这个 token

## 完成后

告诉我你的 GitHub 用户名和仓库名称，我就可以帮你部署了！

