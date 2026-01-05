'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import { Conversation, Message, Model } from '@/types';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('supermind-agent-v1');
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 加载模型列表
  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data) => {
        setModels(data.data || []);
      })
      .catch((error) => {
        console.error('Failed to load models:', error);
      });
  }, []);

  // 从 localStorage 加载对话历史
  useEffect(() => {
    const saved = localStorage.getItem('conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0 && !currentConversationId) {
          setCurrentConversationId(parsed[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // 保存对话到 localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const createNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: '新对话',
      messages: [],
      model: currentModel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newId);
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setCurrentModel(conversation.model);
    }
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (currentConversationId === id) {
      setCurrentConversationId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversationId) {
      createNewConversation();
      // 等待新对话创建
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const conversationId = currentConversationId || `conv_${Date.now()}`;
    let conversation = conversations.find((c) => c.id === conversationId);

    // 如果对话不存在，创建新对话（使用当前选择的模型）
    if (!conversation) {
      conversation = {
        id: conversationId,
        title: '新对话', // 临时标题，收到回复后会更新
        messages: [],
        model: currentModel, // 使用当前选择的模型
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations([conversation, ...conversations]);
      setCurrentConversationId(conversationId);
    }

    // 添加用户消息
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = [...conversation.messages, userMessage];

    // 更新对话（标题会在收到助手回复后更新）
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? updatedConversation : c))
    );

    setIsLoading(true);

    try {
      // 准备 API 消息格式
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 调用 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: currentModel,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantContent = data.choices[0]?.message?.content || '';

      // 添加助手回复
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      
      // 如果是第一条消息（在添加用户消息之前对话为空），生成标题总结
      let finalTitle = updatedConversation.title;
      const isFirstMessage = conversation.messages.length === 0;
      if (isFirstMessage) {
        try {
          const summarizeResponse = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: content }),
          });
          if (summarizeResponse.ok) {
            const summarizeData = await summarizeResponse.json();
            finalTitle = summarizeData.title || content.slice(0, 15) || '新对话';
          } else {
            // 如果 API 调用失败，使用截取的前15个字符
            finalTitle = content.slice(0, 15) || '新对话';
          }
        } catch (error) {
          console.error('Failed to generate title:', error);
          // 如果出错，使用截取的前15个字符
          finalTitle = content.slice(0, 15) || '新对话';
        }
      }

      const finalConversation = {
        ...updatedConversation,
        title: finalTitle,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? finalConversation : c))
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // 添加错误消息
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: '抱歉，发送消息时出现错误。请稍后重试。',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      
      // 如果是第一条消息，即使出错也要更新标题
      let finalTitle = updatedConversation.title;
      const isFirstMessage = conversation.messages.length === 0;
      if (isFirstMessage) {
        finalTitle = content.slice(0, 15) || '新对话';
      }
      
      const finalConversation = {
        ...updatedConversation,
        title: finalTitle,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? finalConversation : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId);
    if (currentConversationId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId ? { ...c, model: modelId } : c
        )
      );
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!currentConversationId) return;

    const conversation = conversations.find((c) => c.id === currentConversationId);
    if (!conversation) return;

    // 找到要编辑的消息的索引
    const messageIndex = conversation.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // 删除编辑消息之后的所有消息（包括助手回复）
    const messagesBeforeEdit = conversation.messages.slice(0, messageIndex);
    
    // 更新被编辑的消息
    const editedMessage: Message = {
      ...conversation.messages[messageIndex],
      content: newContent,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messagesBeforeEdit, editedMessage];

    // 更新对话
    const updatedConversation = {
      ...conversation,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    setConversations((prev) =>
      prev.map((c) => (c.id === currentConversationId ? updatedConversation : c))
    );

    // 重新发送编辑后的消息
    setIsLoading(true);
    try {
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: conversation.model,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantContent = data.choices[0]?.message?.content || '';

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === currentConversationId ? finalConversation : c))
      );
    } catch (error) {
      console.error('Failed to resend message:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: '抱歉，重新发送消息时出现错误。请稍后重试。',
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === currentConversationId ? finalConversation : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string) => {
    // 复制功能已在组件内部实现，这里可以添加额外的反馈
    console.log('Message copied:', content);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />
      <ChatArea
        messages={currentConversation?.messages || []}
        currentModel={currentModel}
        models={models}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        onModelChange={handleModelChange}
        onEditMessage={handleEditMessage}
        onCopyMessage={handleCopyMessage}
      />
    </div>
  );
}
