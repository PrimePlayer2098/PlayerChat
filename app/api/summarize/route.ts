import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://space.ai-builders.com/backend/v1',
  apiKey: process.env.AI_BUILDER_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // 使用 AI 生成简短的标题总结
    const completion = await openai.chat.completions.create({
      model: 'deepseek', // 使用快速且经济的模型来生成总结
      messages: [
        {
          role: 'system',
          content: '你是一个标题生成助手。请根据用户的第一条消息，生成一个简短的中文标题（不超过15个字）。只返回标题，不要其他内容，不要加引号，不要加任何解释。',
        },
        {
          role: 'user',
          content: `请为以下对话生成一个简短标题：${message}`,
        },
      ],
      max_tokens: 30,
      temperature: 0.7,
    });

    let title = completion.choices[0]?.message?.content?.trim() || '';
    
    // 清理标题：移除可能的引号、标点符号等
    title = title.replace(/^["'「」『』]|["'「」『』]$/g, '').trim();
    
    // 如果标题为空或太长，使用截取的前15个字符
    if (!title || title.length > 20) {
      title = message.slice(0, 15);
    }

    return Response.json({ title });
  } catch (error: any) {
    console.error('Summarize API error:', error);
    // 如果 API 调用失败，尝试从请求中获取消息并返回截取的前15个字符
    try {
      const body = await request.json();
      const { message } = body;
      return Response.json({
        title: message?.slice(0, 15) || '新对话',
      });
    } catch {
      return Response.json({
        title: '新对话',
      });
    }
  }
}

