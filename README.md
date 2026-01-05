# AI Chat - ChatGPT 风格对话应用

这是一个基于 Next.js 和 AI Builders API 构建的 ChatGPT 风格对话应用。

## 功能特性

- ✅ 左右两列布局（左侧对话列表，右侧对话界面）
- ✅ 支持多个对话会话管理
- ✅ 支持切换不同的大语言模型
- ✅ 集成 AI Builders API
- ✅ 本地存储对话历史
- ✅ 响应式设计，支持深色模式

## 支持的模型

- **DeepSeek**: 快速且经济的聊天模型
- **Supermind Agent**: 多工具代理，支持网络搜索和 Gemini 切换
- **Gemini 2.5 Pro**: Google Gemini 模型直接访问
- **Gemini 3 Flash**: 快速的 Gemini 推理模型
- **GPT-5**: OpenAI 兼容提供商
- **Grok 4 Fast**: X.AI Grok API 直通

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
AI_BUILDER_TOKEN=your_token_here
NEXT_PUBLIC_API_BASE_URL=https://space.ai-builders.com/backend/v1
```

**重要**: 请将 `your_token_here` 替换为你的实际 AI_BUILDER_TOKEN。

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
chat-app/
├── app/
│   ├── api/
│   │   ├── chat/          # 聊天 API 路由
│   │   └── models/         # 模型列表 API 路由
│   ├── page.tsx            # 主页面
│   ├── layout.tsx          # 布局组件
│   └── globals.css         # 全局样式
├── components/
│   ├── Sidebar.tsx         # 左侧对话列表组件
│   └── ChatArea.tsx        # 右侧对话界面组件
├── types/
│   └── index.ts            # TypeScript 类型定义
└── .env.local              # 环境变量配置（需要手动创建）
```

## 使用说明

1. **新建对话**: 点击左侧的"新建对话"按钮
2. **切换对话**: 点击左侧对话列表中的任意对话
3. **切换模型**: 在顶部选择不同的模型
4. **发送消息**: 在底部输入框输入消息，按 Enter 发送（Shift+Enter 换行）
5. **删除对话**: 鼠标悬停在对话上，点击删除图标

## 技术栈

- **Next.js 16**: React 框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **OpenAI SDK**: AI Builders API 客户端

## 注意事项

- 对话历史保存在浏览器的 localStorage 中
- API 调用需要有效的 AI_BUILDER_TOKEN
- 支持流式响应（当前版本使用非流式，可修改为流式）
