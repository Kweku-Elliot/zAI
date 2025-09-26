import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { offlineAI } from '@/lib/offlineAI';
import { useApp } from '@/contexts/AppContext';

interface AIResponse {
  content: string;
  metadata?: any;
}

interface TransactionValidation {
  isValid: boolean;
  confidence: number;
  reason: string;
  suggestions?: string[];
}

export function useAI() {
  const { isOnline } = useApp();
  const { user } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  // Send message to AI with streaming support
  const sendMessage = useCallback(async (
    message: string, 
    chatId: string, 
    options?: {
      onStreamUpdate?: (content: string) => void;
      onStreamEnd?: () => void;
      onError?: (error: Error) => void;
    }
  ) => {
    if (!isOnline) {
      throw new Error('AI chat requires internet connection');
    }

    const payload = {
      message,
      conversation_id: chatId,
      user_id: user?.id || 'anonymous',
      enhanced: true,
      enhanced_v2: true,
    };

    setIsProcessing(true);

    try {
      const response = await apiRequest('POST', '/api/ai/chat', payload);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) {
        throw new Error('Response body is null');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          options?.onStreamEnd?.();
          setIsProcessing(false);
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data && data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                fullContent += data;
                options?.onStreamUpdate?.(fullContent);
              } catch (e) {
                // If it's not JSON, treat as plain text
                fullContent += data;
                options?.onStreamUpdate?.(fullContent);
              }
            }
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      return { content: fullContent };

    } catch (error: any) {
      setIsProcessing(false);
      options?.onError?.(error);
      throw error;
    }
  }, [isOnline, user?.id]);

  // Generate image
  const generateImage = useMutation({
    mutationFn: async ({ prompt }: { prompt: string }) => {
      if (!isOnline) {
        throw new Error('Image generation requires internet connection');
      }

      const response = await apiRequest('POST', '/api/ai/generate-image', {
        prompt,
      });

      return await response.json();
    },
  });

  // Generate video
  const generateVideo = useMutation({
    mutationFn: async ({ prompt, duration = 5 }: { prompt: string; duration?: number }) => {
      if (!isOnline) {
        throw new Error('Video generation requires internet connection');
      }

      const response = await apiRequest('POST', '/api/ai/generate-video', {
        prompt,
        duration,
      });

      return await response.json();
    },
  });

  // Offline transaction validation
  const validateTransaction = useCallback(async (transactionData: any): Promise<TransactionValidation> => {
    setIsProcessing(true);
    
    try {
      if (isOnline) {
        // Use online AI validation
        const response = await apiRequest('POST', '/api/ai/validate-transaction', transactionData);
        const result = await response.json();
        return result;
      } else {
        // Use offline AI validation
        return await offlineAI.validateTransaction(transactionData);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isOnline]);

  // Generate confirmation prompt
  const generateConfirmationPrompt = useCallback(async (transactionData: any): Promise<string> => {
    if (isOnline) {
      try {
        const response = await apiRequest('POST', '/api/ai/confirmation-prompt', transactionData);
        const result = await response.json();
        return result.prompt;
      } catch {
        // Fallback to offline
        return await offlineAI.generateConfirmationPrompt(transactionData);
      }
    }
    
    return await offlineAI.generateConfirmationPrompt(transactionData);
  }, [isOnline]);

  // Validate message content
  const validateMessage = useCallback(async (content: string) => {
    return await offlineAI.validateMessage(content);
  }, []);

  // Generate smart replies
  const generateSmartReplies = useCallback(async (message: string): Promise<string[]> => {
    if (isOnline) {
      try {
        const response = await apiRequest('POST', '/api/ai/smart-replies', { message });
        const result = await response.json();
        return result.replies;
      } catch {
        // Fallback to offline
        return await offlineAI.generateSmartReplies(message);
      }
    }
    
    return await offlineAI.generateSmartReplies(message);
  }, [isOnline]);

  // Process file with AI
  const processFile = useMutation({
    mutationFn: async ({ file, prompt }: { file: File; prompt?: string }) => {
      if (!isOnline) {
        throw new Error('File processing requires internet connection');
      }

      const formData = new FormData();
      formData.append('file', file);
      if (prompt) formData.append('prompt', prompt);

      const response = await fetch('/api/ai/process-file', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('File processing failed');
      }

      return await response.json();
    },
  });

  // Transcribe audio
  const transcribeAudio = useMutation({
    mutationFn: async ({ audioBlob }: { audioBlob: Blob }) => {
      if (!isOnline) {
        throw new Error('Audio transcription requires internet connection');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Audio transcription failed');
      }

      return await response.json();
    },
  });

  return {
    // Mutations
    sendMessage,
    generateImage,
    generateVideo,
    processFile,
    transcribeAudio,
    
    // Functions
    validateTransaction,
    generateConfirmationPrompt,
    validateMessage,
    generateSmartReplies,
    
    // State
    isProcessing,
    isOnline,
  };
}
