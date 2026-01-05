import { NextResponse } from 'next/server';

// 支持的模型列表
const MODELS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '快速且经济的聊天模型',
  },
  {
    id: 'supermind-agent-v1',
    name: 'Supermind Agent',
    description: '多工具代理，支持网络搜索和 Gemini 切换',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google Gemini 模型直接访问',
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: '快速的 Gemini 推理模型',
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    description: 'OpenAI 兼容提供商',
  },
  {
    id: 'grok-4-fast',
    name: 'Grok 4 Fast',
    description: 'X.AI Grok API 直通',
  },
];

export async function GET() {
  return NextResponse.json({
    object: 'list',
    data: MODELS,
  });
}

