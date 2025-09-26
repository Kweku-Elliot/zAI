import { openAIService } from '../../../server/services/openai';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

/**
 * Generates a chat title based on the first 3 messages in a conversation
 * @param messages Array of messages (should be first 3 user messages)
 * @returns A concise, descriptive chat title
 */
export function generateChatTitle(messages: Message[]): string {
  // Filter to get only user messages and take first 3
  const userMessages = messages
    .filter(msg => msg.role === 'user')
    .slice(0, 3)
    .map(msg => msg.content);

  if (userMessages.length === 0) {
    return 'New Chat';
  }

  // Combine the messages and extract key topics
  const combinedText = userMessages.join(' ');
  
  // Extract title using simple keywords and heuristics
  const title = extractTitleFromText(combinedText);
  
  return title;
}

/**
 * Generates an AI-powered chat title using OpenAI (when available)
 * @param messages Array of messages
 * @returns Promise with a descriptive chat title
 */
export async function generateAIChatTitle(messages: Message[]): Promise<string> {
  try {
    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(0, 3)
      .map(msg => msg.content);

    if (userMessages.length === 0) {
      return 'New Chat';
    }

    const combinedText = userMessages.join('\n');
    
    // Check if OpenAI is available (we'll use a simple heuristic for now)
    // In a real implementation, this would call the OpenAI service
    
    // For now, use the simpler title extraction
    return extractTitleFromText(combinedText);
    
  } catch (error) {
    console.warn('AI title generation failed, using fallback:', error);
    return generateChatTitle(messages);
  }
}

/**
 * Extracts a concise title from text using keyword analysis
 * @param text Combined text from first few messages
 * @returns A descriptive title (max 50 characters)
 */
function extractTitleFromText(text: string): string {
  const cleanText = text.toLowerCase().trim();
  
  // Common patterns and their corresponding titles
  const patterns = [
    // Payment and financial
    { keywords: ['payment', 'pay', 'bill', 'money', 'transfer'], title: 'Payment Discussion' },
    { keywords: ['airtime', 'data', 'bundle'], title: 'Telecom Services' },
    { keywords: ['electricity', 'water', 'utility'], title: 'Utility Bills' },
    { keywords: ['mtn', 'vodafone', 'airteltigo'], title: 'Mobile Money' },
    
    // AI and tech
    { keywords: ['ai', 'artificial intelligence', 'machine learning'], title: 'AI Discussion' },
    { keywords: ['code', 'programming', 'development'], title: 'Programming Help' },
    { keywords: ['help', 'support', 'problem'], title: 'Support Request' },
    
    // Business and work
    { keywords: ['business', 'company', 'work'], title: 'Business Inquiry' },
    { keywords: ['price', 'cost', 'buy', 'purchase'], title: 'Pricing Inquiry' },
    
    // Personal
    { keywords: ['hello', 'hi', 'greet'], title: 'General Chat' },
    { keywords: ['thank', 'thanks'], title: 'Appreciation' },
  ];

  // Check for patterns
  for (const pattern of patterns) {
    if (pattern.keywords.some(keyword => cleanText.includes(keyword))) {
      return pattern.title;
    }
  }

  // Try to extract main topic from first sentence
  const firstSentence = text.split(/[.!?]/)[0].trim();
  if (firstSentence.length > 0) {
    // Extract meaningful words (remove common words)
    const words = firstSentence
      .split(/\s+/)
      .filter(word => !isCommonWord(word))
      .filter(word => word.length > 2)
      .slice(0, 3);

    if (words.length > 0) {
      let title = words.join(' ');
      // Capitalize first letter of each word
      title = title.replace(/\b\w/g, l => l.toUpperCase());
      
      // Limit to 50 characters
      if (title.length > 50) {
        title = title.substring(0, 47) + '...';
      }
      
      return title;
    }
  }

  // Fallback to generic title with timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  return `Chat ${timeStr}`;
}

/**
 * Checks if a word is a common word that shouldn't be used in titles
 * @param word Word to check
 * @returns True if it's a common word
 */
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'what', 'when', 'where', 'why', 'how', 'my', 'your', 'his', 'her',
    'its', 'our', 'their'
  ]);
  
  return commonWords.has(word.toLowerCase());
}

/**
 * Updates chat title automatically when enough messages are present
 * @param messages Current messages in the chat
 * @param currentTitle Current title of the chat
 * @returns New title if update is needed, null otherwise
 */
export function shouldUpdateChatTitle(messages: Message[], currentTitle: string): string | null {
  // Only update if we have at least 2 user messages and current title is generic
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length >= 2 && (
    currentTitle === 'New Chat' || 
    currentTitle.startsWith('Chat ') ||
    currentTitle === ''
  )) {
    return generateChatTitle(messages);
  }
  
  return null;
}

/**
 * Schedules automatic title update for a chat
 * @param chatId Chat ID to update
 * @param messages Current messages
 * @param updateCallback Callback to update the chat title
 */
export function scheduleAutomaticTitleUpdate(
  chatId: string, 
  messages: Message[], 
  updateCallback: (chatId: string, newTitle: string) => void
): void {
  // Update title after 3 user messages
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  if (userMessages.length === 3) {
    const newTitle = generateChatTitle(messages);
    updateCallback(chatId, newTitle);
  }
}