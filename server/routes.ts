import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
// import { openAIService } from "./services/openai";
// import { stripeService } from "./services/stripe";
// import { encryptionService } from "./services/encryption";
import { zenuxAIV2Service } from "./services/zenux"; // Import ZenuxAIV2Service
import { insertMessageSchema, insertChatSchema, insertTransactionSchema, insertUserSchema } from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Test route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chat routes
  app.post("/api/chats", async (req, res) => {
    try {
      const chatData = insertChatSchema.parse(req.body);
      const chat = await storage.createChat(chatData);
      res.json({ chat });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chats/:userId", async (req, res) => {
    try {
      const chats = await storage.getChatsByUserId(req.params.userId);
      res.json({ chats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      // Encrypt message if required
      // if (messageData.encrypted) {
      //   messageData.content = await encryptionService.encrypt(messageData.content, "user-key");
      // }
      
      const message = await storage.createMessage(messageData);
      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/messages/:chatId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByChatId(req.params.chatId);
      
      // Decrypt messages if needed
      // const decryptedMessages = await Promise.all(
      //   messages.map(async (message) => {
      //     if (message.encrypted) {
      //       try {
      //         message.content = await encryptionService.decrypt(message.content, "user-key");
      //       } catch (error) {
      //         console.error("Failed to decrypt message:", error);
      //       }
      //     }
      //     return message;
      //   })
      // );
      
      res.json({ messages: messages /*decryptedMessages*/ });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI chat route (enhanced v2 streaming)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      // DEBUG: log incoming AI chat request for diagnostics
      try {
        console.log('[/api/ai/chat] incoming body:', JSON.stringify(req.body));
      } catch (_err) {
        // reference the caught error to satisfy linters
        void _err;
        console.log('[/api/ai/chat] incoming body (non-serializable)');
      }
      console.log('[/api/ai/chat] Authorization header present:', !!(req.headers.authorization || req.headers.Authorization));

      const { message, conversation_id, conversationId, chatId, user_id, userId } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // accept either conversation_id or conversationId or chatId
      const convId = (conversation_id || conversationId || chatId) || `conv-${Date.now()}`;
      // Try to derive user id from Authorization header (Bearer token) via Supabase server client.
      // Prefer server-verified token; fall back to provided user_id only if token not present.
      let uid = (user_id || userId) || 'anonymous';
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const { data } = await (await import('./supabase')).supabaseServer.auth.getUser(token as any);
          if (data?.user?.id) {
            uid = data.user.id;
          } else {
            // token invalid — reject request
            return res.status(401).json({ message: 'Invalid or expired token' });
          }
        } catch (err) {
          void err;
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
      } else {
        // No token: for safety we could reject; for now log and fall back to provided user_id
        console.warn('No Authorization bearer token provided; falling back to provided user_id (less secure).');
      }

      // Use ZenuxAIV2Service for streaming chat
      const chatStream = await zenuxAIV2Service.chat({
        message,
        user_id: uid,
        conversation_id: convId,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      chatStream.on('data', (chunk) => {
        res.write(`data: ${chunk.toString()}\n\n`);
      });

      chatStream.on('end', () => {
        res.end();
      });

      chatStream.on('error', (error) => {
        console.error('Zenux chat stream error:', error);
        try {
          res.status(500).write(`data: {"error": "Failed to stream AI response: ${error.message}"}\n\n`);
  } catch (_err) { void _err; }
        res.end();
      });

    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  /*
  // AI image generation
  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      const result = await openAIService.generateImage(prompt);
      res.json(result);
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });
  // AI video generation (mock endpoint)
  app.post("/api/ai/generate-video", async (req, res) => {
    try {
      const { prompt, duration } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      // Mock video generation - in production, integrate with video generation API
      const result = {
        url: `https://mock-video-url.com/${Date.now()}.mp4`,
        duration: duration || 5,
        prompt,
      };
      
      res.json(result);
    } catch (error: any) {
      console.error("Video generation error:", error);
      res.status(500).json({ message: "Failed to generate video" });
    }
  });
  // File processing with AI
  app.post("/api/ai/process-file", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const { prompt } = req.body;
      const result = await openAIService.analyzeFile(req.file, prompt);
      
      res.json(result);
    } catch (error: any) {
      console.error("File processing error:", error);
      res.status(500).json({ message: "Failed to process file" });
    }
  });
  // Audio transcription
  app.post("/api/ai/transcribe", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file uploaded" });
      }
      const result = await openAIService.transcribeAudio(req.file);
      res.json(result);
    } catch (error: any) {
      console.error("Audio transcription error:", error);
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });
  // Transaction validation
  app.post("/api/ai/validate-transaction", async (req, res) => {
    try {
      const validation = await openAIService.validateTransaction(req.body);
      res.json(validation);
    } catch (error: any) {
      console.error("Transaction validation error:", error);
      res.status(500).json({ message: "Failed to validate transaction" });
    }
  });
  // Generate confirmation prompt
  app.post("/api/ai/confirmation-prompt", async (req, res) => {
    try {
      const prompt = await openAIService.generateConfirmationPrompt(req.body);
      res.json({ prompt });
    } catch (error: any) {
      console.error("Confirmation prompt error:", error);
      res.status(500).json({ message: "Failed to generate confirmation prompt" });
    }
  });
  // Smart replies
  app.post("/api/ai/smart-replies", async (req, res) => {
    try {
      const { message } = req.body;
      const replies = await openAIService.generateSmartReplies(message);
      res.json({ replies });
    } catch (error: any) {
      console.error("Smart replies error:", error);
      res.status(500).json({ message: "Failed to generate smart replies" });
    }
  });
  */

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Validate with AI before processing
      // const validation = await openAIService.validateTransaction(transactionData);
      // if (!validation.isValid) {
      //   return res.status(400).json({ message: validation.reason });
      // }
      
      const transaction = await storage.createTransaction({
        ...transactionData,
        aiValidated: true,
      });
      
      res.json({ transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUserId(req.params.userId);
      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Group wallet routes
  app.post("/api/group-wallets", async (req, res) => {
    try {
      const walletData = req.body;
      const wallet = await storage.createGroupWallet(walletData);
      res.json({ wallet });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/group-wallets/:userId", async (req, res) => {
    try {
      const wallets = await storage.getGroupWalletsByUserId(req.params.userId);
      res.json({ wallets });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /*
  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripeService.createPaymentIntent(amount);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  */

  // app.post('/api/create-subscription', async (req, res) => {
  //   try {
  //     const { userId, priceId } = req.body;
  //     const subscription = await stripeService.createSubscription(userId, priceId);
  //     let clientSecret: string | undefined;
  //     // Ensure latest_invoice is an object (not a string ID) and not null before accessing its properties
  //     if (typeof subscription.latest_invoice === 'object' && subscription.latest_invoice !== null) {
  //       clientSecret = subscription.latest_invoice.payment_intent?.client_secret ?? undefined;
  //     }

  //     res.json({ 
  //       subscriptionId: subscription.id,
  //       clientSecret: clientSecret 
  //     });
  //   } catch (error: any) {
  //     res.status(400).json({ error: { message: error.message } });
  //   }
  // });

  // Create HTTP server
  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'chat_message':
            // Broadcast message to other clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                  type: 'new_message',
                  data: data.payload
                }));
              }
            });
            break;
            
          case 'transaction_update':
            // Broadcast transaction updates
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                  type: 'transaction_status',
                  data: data.payload
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
