import axios from "axios";
import FormData from "form-data";

const ZENUX_API_KEY =  process.env.VITE_ZENUX_API_KEY;
const ZENUX_CHAT_API_URL = process.env.VITE_ZENUX_CHAT_API_URL;
const ZENUX_FILE_API_URL = process.env.VITE_ZENUX_FILE_API_URL;
const ZENUX_ANALYTICS_URL = process.env.VITE_ZENUX_ANALYTICS_URL;

if (!ZENUX_API_KEY) {
  throw new Error("Missing required Zenux API key: VITE_ZENUX_API_KEY");
}

interface ChatResponse {
  content: string;
  metadata?: any;
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reason: string;
  suggestions?: string[];
}

interface FileAnalysisResult {
  analysis: string;
  metadata?: any;
}

interface TranscriptionResult {
  text: string;
  duration?: number;
}

class ZenuxAIService {
  async generateChatResponse(message: string): Promise<ChatResponse> {
    try {
      console.log('[ZenuxAI] Sending chat request:', { message });
      
      const response = await axios.post(
        ZENUX_CHAT_API_URL!,
        {
          model: "zenux-0",
          messages: [
            {
              role: "system",
              content:
                "You are Zenux AI, an intelligent assistant that helps users with various tasks including mobile money transactions, offline AI validation, and general questions. Be helpful, accurate, and concise in your responses.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_completion_tokens: 2048,
        },
        {
          headers: {
            Authorization: `Bearer ${ZENUX_API_KEY}`,
          },
        }
      );

      console.log('[ZenuxAI] Raw response:', JSON.stringify(response.data, null, 2));
      
      const content = response.data.choices?.[0]?.message?.content;
      console.log('[ZenuxAI] Extracted content:', content);
      
      if (!content) {
        console.warn('[ZenuxAI] No content found in response');
      }

      const result = {
        content: content || "I apologize, but I couldn't generate a response. Please try again.",
        metadata: {
          model: "zenux-0",
          tokens: response.data.usage?.total_tokens || 0,
          timestamp: new Date().toISOString(),
        },
      };

      console.log('[ZenuxAI] Sending response:', result);
      return result;
    } catch (error: any) {
      console.error("Zenux chat error:", error);
      throw new Error("Failed to generate AI response: " + error.message);
    }
  }

  async generateImage(prompt: string): Promise<{ url: string }> {
    try {
      const response = await axios.post(
        ZENUX_CHAT_API_URL!,
        {
          model: "zenux-dalle-3",
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          type: "image",
        },
        {
          headers: {
            Authorization: `Bearer ${ZENUX_API_KEY}`,
          },
        }
      );
      return { url: response.data.data?.[0]?.url || "" };
    } catch (error: any) {
      console.error("Zenux image generation error:", error);
      throw new Error("Failed to generate image: " + error.message);
    }
  }

  async analyzeFile(file: Express.Multer.File, prompt?: string): Promise<FileAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append("file", file.buffer, file.originalname);
      formData.append("prompt", prompt || "Analyze this file and provide a detailed summary of its contents.");
      const response = await axios.post(ZENUX_FILE_API_URL!, formData, {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
          ...formData.getHeaders()
        },
      });
      return {
        analysis: response.data.analysis || "Could not analyze the file.",
        metadata: {
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error("Zenux file analysis error:", error);
      throw new Error("Failed to analyze file: " + error.message);
    }
  }

  async transcribeAudio(audioFile: Express.Multer.File): Promise<TranscriptionResult> {
    try {
      const formData = new FormData();
      formData.append("file", audioFile.buffer, audioFile.originalname);
      formData.append("model", "zenux-whisper-1");
      const response = await axios.post(ZENUX_FILE_API_URL!, formData, {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
          ...formData.getHeaders()
        },
      });
      return {
        text: response.data.text,
        duration: response.data.duration || 0,
      };
    } catch (error: any) {
      console.error("Zenux transcription error:", error);
      throw new Error("Failed to transcribe audio: " + error.message);
    }
  }

  async validateTransaction(transactionData: any): Promise<ValidationResult> {
    try {
      const response = await axios.post(
        ZENUX_ANALYTICS_URL!,
        {
          type: "validate-transaction",
          transaction: transactionData,
        },
        {
          headers: {
            Authorization: `Bearer ${ZENUX_API_KEY}`,
          },
        }
      );
      const result = response.data;
      return {
        isValid: result.isValid || false,
        confidence: Math.max(0, Math.min(1, result.confidence || 0)),
        reason: result.reason || "Transaction validation completed",
        suggestions: result.suggestions || [],
      };
    } catch (error: any) {
      console.error("Zenux transaction validation error:", error);
      return this.basicTransactionValidation(transactionData);
    }
  }

  private basicTransactionValidation(data: any): ValidationResult {
    if (!data.amount || data.amount <= 0) {
      return {
        isValid: false,
        confidence: 0.95,
        reason: "Invalid amount: must be greater than zero",
      };
    }
    if (data.amount > 50000) {
      return {
        isValid: false,
        confidence: 0.9,
        reason: "Amount exceeds daily limit",
        suggestions: ["Split into smaller transactions", "Contact support for higher limits"],
      };
    }
    if (data.userBalance !== undefined && data.amount > data.userBalance) {
      return {
        isValid: false,
        confidence: 0.98,
        reason: "Insufficient balance",
        suggestions: ["Add funds to your account", "Reduce transaction amount"],
      };
    }
    return {
      isValid: true,
      confidence: 0.85,
      reason: "Transaction appears valid",
    };
  }

  async generateConfirmationPrompt(transactionData: any): Promise<string> {
    try {
      const response = await axios.post(
        ZENUX_ANALYTICS_URL!,
        {
          type: "confirmation-prompt",
          transaction: transactionData,
        },
        {
          headers: {
            Authorization: `Bearer ${ZENUX_API_KEY}`,
          },
        }
      );
      return response.data.prompt || `Confirm sending ${transactionData.currency} ${transactionData.amount.toFixed(2)} via ${transactionData.paymentMethod || "mobile money"}?`;
    } catch (error: any) {
      console.error("Zenux confirmation prompt error:", error);
      return `Confirm sending ${transactionData.currency} ${transactionData.amount.toFixed(2)} via ${transactionData.paymentMethod || "mobile money"}?`;
    }
  }

  async generateSmartReplies(message: string): Promise<string[]> {
    try {
      const response = await axios.post(
        ZENUX_CHAT_API_URL!,
        {
          model: "zenux-0",
          messages: [
            {
              role: "system",
              content: "Generate 3 helpful, contextually relevant smart reply suggestions for the user's message. Keep them concise and actionable. Respond in JSON format with a 'replies' array.",
            },
            {
              role: "user",
              content: `Generate smart replies for this message: "${message}"`,
            },
          ],
          response_format: { type: "json_object" },
        },
        {
          headers: {
            Authorization: `Bearer ${ZENUX_API_KEY}`,
          },
        }
      );
      const result = response.data;
      return result.replies || ["Tell me more", "How can I help?", "What would you like to know?"];
    } catch (error: any) {
      console.error("Zenux smart replies error:", error);
      // Fallback smart replies
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("transaction") || lowerMessage.includes("payment")) {
        return ["Need help with payments?", "Check transaction status", "View payment methods"];
      }
      if (lowerMessage.includes("error") || lowerMessage.includes("problem")) {
        return ["What specific error occurred?", "Can you share more details?", "Let me help troubleshoot"];
      }
      if (lowerMessage.includes("balance") || lowerMessage.includes("wallet")) {
        return ["Check current balance", "View transaction history", "Add funds to wallet"];
      }
      return ["Tell me more", "How can I help?", "What would you like to know?"];
    }
  }
}

export const zenuxAIService = new ZenuxAIService();

// --- Enhanced v2 ZenuxAIService ---

class ZenuxAIV2Service {
  async generateImageFromPrompt({ messages, user_id, conversation_id, model, stream }: {
    messages: { role: string; content: string }[];
    user_id: string;
    conversation_id?: string;
    model?: string;
    stream?: boolean;
  }): Promise<any> {
    const url = process.env.VITE_ZENUX_CHAT_API_URL || 'http://localhost:5000/z1/chat/completions';
    const apiKey = process.env.VITE_ZENUX_API_KEY;
    const payload = {
      messages,
      user_id,
      conversation_id,
      model: model || 'zenux-z0-zeni',
      stream: !!stream
    };
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    const response = await (await import('axios')).default.post(url, payload, { headers });
    return response.data;
  }
  async codezCodeExecution({ code, language, user_id, conversation_id }: {
    code: string;
    language: string;
    user_id: string;
    conversation_id?: string;
  }): Promise<any> {
    const CODEZ_API_URL = process.env.VITE_CODEZ_API_URL || 'http://localhost:5000/z0/codez';
    const CODEZ_API_KEY = process.env.VITE_CODEZ_API_KEY;
    const payload = { code, language, user_id, conversation_id };
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CODEZ_API_KEY) headers['Authorization'] = `Bearer ${CODEZ_API_KEY}`;
  const response = await (await import('axios')).default.post(CODEZ_API_URL, payload, { headers });
    return response.data;
  }
  async uploadFile(file: Express.Multer.File, user_id: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
    formData.append("user_id", user_id);

    const response = await axios.post(
      ZENUX_FILE_API_URL!,
      formData,
      {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );

    return response.data;
  }

  async chat({ messages, user_id, conversation_id, files, stream = false, mode = 'auto' }: {
    messages: any[];
    user_id: string;
    conversation_id: string;
    files?: string[];
    stream?: boolean;
    mode?: 'fast' | 'heavy' | 'auto';
  }): Promise<any> {
    // Select model based on mode
    let model = 'zenux-1o-alpha';
    if (mode === 'fast') model = 'zenux-1o-fast';
    else if (mode === 'heavy') model = 'zenux-1o-heavy';
    // Send request in OpenAI format with files support
    const payload: any = {
      messages,
      user_id,
      conversation_id,
      enhanced: true,
      enhanced_v2: true,
      model,
      stream,
      temperature: 0.7,
      max_tokens: 1000
    };
    if (files && files.length > 0) payload.files = files;
    const response = await axios.post(
      ZENUX_CHAT_API_URL!,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
        },
        responseType: stream ? 'stream' : 'json',
      }
    );
    return response.data;
  }

  async analyzeFile({ file, prompt, user_id, conversation_id }: {
    file: Express.Multer.File;
    prompt?: string;
    user_id: string;
    conversation_id: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    if (prompt) formData.append("prompt", prompt);
    formData.append("user_id", user_id);
    formData.append("conversation_id", conversation_id);
    formData.append("enhanced_v2", "true");
    const response = await axios.post(
      ZENUX_FILE_API_URL!,
      formData,
      {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );
    return response.data;
  }

  async generateImage({ prompt, user_id }: {
    prompt: string;
    user_id: string;
  }): Promise<{ url: string }[]> {
    const response = await axios.post(
      ZENUX_FILE_API_URL!.replace('/upload', '/v1/images/generate'),
      {
        prompt,
        model: "zenux-dalle-3",
        n: 1,
        size: "1024x1024",
        quality: "standard",
        user_id,
        enhanced_v2: true
      },
      {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
        },
      }
    );
    return response.data.data || [];
  }

  async research({ query, user_id }: {
    query: string;
    user_id: string;
  }): Promise<any> {
    const response = await axios.post(
      ZENUX_ANALYTICS_URL!.replace('/api/analytics', '/api/research'),
      {
        query,
        user_id,
        enhanced_v2: true
      },
      {
        headers: {
          Authorization: `Bearer ${ZENUX_API_KEY}`,
        },
      }
    );
    return response.data;
  }
}

export const zenuxAIV2Service = new ZenuxAIV2Service();
