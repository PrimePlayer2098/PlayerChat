# 推送代码到 GitHub

由于需要 GitHub 认证，请按照以下步骤操作：

## 方法 1：使用 Personal Access Token（推荐）

### 1. 创建 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 设置：
   - Note: `PlayerChat Deployment`
   - Expiration: 选择合适的时间（建议 90 天）
   - 权限：至少勾选 `repo` 权限
4. 点击 "Generate token"
5. **重要**：复制生成的 token（只显示一次，请保存好）

### 2. 推送代码

在终端执行以下命令：

```bash
cd "/Users/liyangyang/Documents/cursor/日常项目/chat-app"
git push -u origin main
```

当提示输入用户名时，输入：`PrimePlayer2098`
当提示输入密码时，**粘贴刚才复制的 token**（不是你的 GitHub 密码）

## 方法 2：使用 GitHub CLI（如果已安装）

```bash
gh auth login
git push -u origin main
```

## 推送完成后

告诉我推送已完成，我就可以帮你部署了！

部署信息：
- GitHub 仓库：https://github.com/PrimePlayer2098/PlayerChat.git
- 分支：main
- 服务名称：需要你提供一个（例如：`player-chat`）

