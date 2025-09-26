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
  onStartVoiceRecording,
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

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    onStartVoiceRecording();
  };

  return (
    <div className="border-t border-border p-4 bg-card safe-area-bottom">
      <div className="flex items-center gap-2">
        {/* Message Input Container */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={message}
            onChange={adjustTextareaHeight}
            onKeyPress={handleKeyPress}
            className={cn(
              "w-full pr-4 bg-muted border-border rounded-xl resize-none focus:ring-2 focus:ring-primary min-h-[48px] max-h-[120px] text-base",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
            disabled={disabled}
            data-testid="input-message"
          />
        </div>
        
        {/* Action Buttons Container - Properly aligned in center */}
        <div className="flex items-center gap-2">
          {message.trim() ? (
            // When text is present: Send button only
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center"
              onClick={handleSend}
              disabled={disabled}
              data-testid="button-send"
            >
              <Send size={18} className="text-primary-foreground" />
            </Button>
          ) : (
            // When no text: File attachment and voice recording buttons
            <>
              <Button
                size="icon" 
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                data-testid="button-attach-file"
              >
                <Paperclip size={18} className="text-muted-foreground" />
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
                size="icon"
                variant="ghost"
                className={cn(
                  "h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center",
                  isRecording && "bg-destructive hover:bg-destructive/90"
                )}
                onClick={handleVoiceRecording}
                disabled={disabled}
                data-testid="button-voice-record"
              >
                <Mic 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isRecording ? "text-destructive-foreground" : "text-muted-foreground"
                  )}
                  fill={isRecording ? "currentColor" : "none"}
                />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
