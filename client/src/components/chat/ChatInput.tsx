import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Mic, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text') => void;
  onSendFile: (file: File) => void;
  onStartVoiceRecording: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  onSendFile, 
  disabled = false,
  placeholder = "Type your message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message, 'text');
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
      e.target.value = ''; // Reset input
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setMessage(textarea.value);
  };

  return (
    <div className="border-t border-border p-4 bg-card">
      <div className="flex items-end">
        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={message}
            onChange={adjustTextareaHeight}
            onKeyPress={handleKeyPress}
            className={cn(
              "w-full pr-12 bg-muted border-0 rounded-xl resize-none focus:ring-2 focus:ring-primary min-h-[48px] max-h-[120px]",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            disabled={disabled}
            data-testid="input-message"
          />
        </div>
        {/* Conditional buttons based on input state */}
        {message.trim() ? (
          <>
            <Button
              size="sm"
              className="p-2 ml-2 rounded-full bg-blue-600"
              onClick={handleSend}
              disabled={disabled}
              data-testid="button-send"
            >
              {/* You may want to add a loading spinner here if sending */}
              <Send size={20} color="white" />
            </Button>
            <Button
              size="sm"
              className="p-2 ml-2 rounded-full hover:bg-gray-100"
              onClick={() => setMessage('')}
              disabled={disabled}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#4B5563" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              className="p-2 ml-2 rounded-full hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              data-testid="button-attach-file"
            >
              <Paperclip size={20} color="#4B5563" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.js,.py,.html,.css,.json"
              className="hidden"
              data-testid="input-file"
            />
            <Button
              size="sm"
              className="p-2 ml-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsRecording(r => !r)}
              disabled={disabled}
              data-testid="button-voice-record"
            >
              <Mic size={20} color={isRecording ? "#EF4444" : "#4B5563"} fill={isRecording ? "#EF4444" : "none"} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
