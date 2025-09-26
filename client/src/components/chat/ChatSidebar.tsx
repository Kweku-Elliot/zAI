import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { Plus, MessageCircle, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onBillingClick: () => void;
}

export function ChatSidebar({ onNewChat, onChatSelect, onBillingClick }: ChatSidebarProps) {
  const { chatSessions, currentChatId, user, sidebarOpen, setSidebarOpen } = useApp();

  const handleChatClick = (chatId: string) => {
    onChatSelect(chatId);
  };

  const usagePercentage = user ? (user.plan.messagesUsed / user.plan.messagesLimit) * 100 : 0;

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 max-w-xs bg-card dark:bg-card border-r border-border dark:border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-border bg-background dark:bg-background">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary dark:bg-primary flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground dark:text-foreground">Zenux AI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              data-testid="button-close-sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 rounded-xl py-3 font-semibold"
              onClick={onNewChat}
              data-testid="button-new-chat"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              <div className="text-muted-foreground dark:text-muted-foreground text-xs font-semibold px-2 py-2">
                RECENT CHATS
              </div>
              
              {chatSessions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">No chats yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start a conversation!</p>
                </div>
              ) : (
                chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center p-2 rounded-lg hover:bg-accent dark:hover:bg-accent cursor-pointer transition-colors",
                      currentChatId === chat.id && "bg-accent dark:bg-accent border border-primary/20 dark:border-primary/30"
                    )}
                    onClick={() => handleChatClick(chat.id)}
                    data-testid={`chat-item-${chat.id}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted dark:bg-muted items-center justify-center mr-2 flex">
                      <span className="text-muted-foreground dark:text-muted-foreground font-medium text-sm">C</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-foreground dark:text-foreground text-sm font-medium truncate block">
                        {chat.title}
                      </span>
                      <span className="text-muted-foreground dark:text-muted-foreground text-xs">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Plan Indicator */}
          <div className="p-4 border-t border-border dark:border-border">
            <div
              className="bg-muted dark:bg-muted rounded-lg p-3 cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/80 transition-colors"
              onClick={onBillingClick}
            >
              <div className="text-foreground dark:text-foreground text-sm font-medium">Plan: {user?.plan?.type || 'Free'}</div>
              <div className="text-muted-foreground dark:text-muted-foreground text-xs mt-1">Upgrade for more features</div>
              {user && (
                <div className="mt-2">
                  <Progress 
                    value={usagePercentage} 
                    className="h-2" 
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {user.plan.messagesUsed}/{user.plan.messagesLimit} messages used
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
