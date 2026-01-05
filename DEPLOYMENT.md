# 部署说明

## 部署前准备

1. **确保代码已提交到 GitHub**
   - 所有更改必须提交并推送到 GitHub
   - 部署系统会从 GitHub 拉取代码

2. **环境变量**
   - `AI_BUILDER_TOKEN` 会在部署时自动注入，无需手动配置
   - `NEXT_PUBLIC_API_BASE_URL` 使用默认值 `https://space.ai-builders.com/backend/v1`

3. **部署所需信息**
   - GitHub 仓库 URL（例如：`https://github.com/username/repo-name`）
   - 服务名称（将作为子域名，例如：`my-chat-app`）
   - Git 分支（例如：`main`）

## 部署步骤

部署后，你的应用将在 `https://{service-name}.ai-builders.space` 可访问。

部署通常需要 5-10 分钟完成。

