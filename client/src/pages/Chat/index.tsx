import React, { useState, useEffect, useRef, useContext } from 'react';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import InputBar from './components/InputBar';
import MobileHeader from './components/MobileHeader';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { AuthContext } from '../../contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { ChatSession, ChatMessage as ServerMessage } from '@/types';

type UIMessage = { id: string; text: string; isAI: boolean; createdAt?: string };

export default function ChatPage() {
  const { processFile: _processFile } = useAI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [rewritingMessageId, setRewritingMessageId] = useState<string | null>(null);
  const { user, signOut } = useContext(AuthContext);

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<string[]>([]);
  const [_uploadProgress, _setUploadProgress] = useState<number>(0);
  const [_filePreview, _setFilePreview] = useState<{ name: string; type: string; url?: string; uploadedName?: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const sendAbortControllerRef = useRef<AbortController | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mode, setMode] = useState<'quick' | 'deep' | 'auto'>('auto');
  const [showModeMenu, setShowModeMenu] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);

  // Helper to get a normalized access token from Supabase and log the raw response for debugging
  const getSupabaseAccessToken = async () => {
    try {
      const res: any = await supabase.auth.getSession();
      console.log('supabase.auth.getSession ->', res);
      // Different supabase versions return the session/token in different shapes; normalize here
      if (res && res.data) {
        // common shape: res.data.session.access_token
        if (res.data.session && typeof res.data.session.access_token === 'string') return res.data.session.access_token;
        // alternate: res.data.access_token
        if (typeof res.data.access_token === 'string') return res.data.access_token;
        // sometimes libraries return session directly
        if (res.session && typeof res.session.access_token === 'string') return res.session.access_token;
      }
      return null;
    } catch (err) {
      console.error('Error fetching supabase session:', err);
      return null;
    }
  };

  const { currentChatId, chatSessions, setChatSessions, setCurrentChatId } = useApp();
  const [, setLocation] = useLocation();

  // Load messages for a chat
  const loadMessagesForChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/messages/${chatId}`);
      if (res.ok) {
        const json = await res.json();
        const serverMessages: ServerMessage[] = json.messages || [];
        const uiMessages: UIMessage[] = serverMessages
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((m) => ({ id: m.id, text: m.content, isAI: m.role === 'assistant', createdAt: m.createdAt }));
        setMessages(uiMessages);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  useEffect(() => {
    const lastChatId = localStorage.getItem('lastChatId');
    if (lastChatId) setCurrentChatId(lastChatId);
  }, [setCurrentChatId]);

  useEffect(() => {
    if (currentChatId) loadMessagesForChat(currentChatId);
    else setMessages([]);
  }, [currentChatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setIsDesktop(window.innerWidth >= 768);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' as ScrollBehavior });
  }, [messages]);

  const navigateTo = (p: string) => { setLocation(p); setSidebarOpen(false); };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      _setFilePreview({ name: file.name, type: file.type, url });
    } else _setFilePreview({ name: file.name, type: file.type });

    _setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id);

    try {
      const token = await getSupabaseAccessToken();
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => { if (e.lengthComputable) _setUploadProgress(Math.round((e.loaded / e.total) * 100)); });
      const result: any = await new Promise((resolve, reject) => {
        xhr.onload = () => xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject(new Error('Upload failed'));
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', '/upload');
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
      if (result.status === 'success' && result.file_info?.file_info?.filename) {
        // Store only the latest uploaded filename for auto-inclusion
        setPendingFiles([result.file_info.file_info.filename]);
        _setFilePreview((fp: { name: string; type: string; url?: string; uploadedName?: string } | null) => fp ? { ...fp, uploadedName: result.file_info.file_info.filename } : fp);
        toast({ title: 'File uploaded', description: 'File has been uploaded and will be used in the next message' });
        setShowAttachMenu(false);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: 'Upload failed', description: 'Failed to upload file', variant: 'destructive' });
      _setFilePreview(null);
    } finally { _setUploadProgress(0); }
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText ?? message)?.trim();
    if (!textToSend) return;
    if (!user) { navigateTo('/login'); return; }

        // If there is a file preview, include it in the message
        let attachedFile = null;
        if (_filePreview && _filePreview.uploadedName) {
          attachedFile = { name: _filePreview.name, type: _filePreview.type, uploadedName: _filePreview.uploadedName, url: _filePreview.url };
        }
        // Remove file preview immediately after extracting
        _setFilePreview(null);
        const userMessage = {
          id: String(Date.now()),
          text: textToSend,
          isAI: false,
          file: attachedFile
        };
    setMessages(m => {
      if (rewritingMessageId) {
        const rewriteIndex = m.findIndex(msg => msg.id === rewritingMessageId);
        if (rewriteIndex !== -1) return [...m.slice(0, rewriteIndex), userMessage];
      }
      return [...m, userMessage];
    });
    if (overrideText === undefined) setMessage('');
    setRewritingMessageId(null);
    setSending(true);

    let conversationId = currentChatId;
    try {
      if (!conversationId) {
        const token = await getSupabaseAccessToken();
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const createRes = await fetch('/api/chats', { method: 'POST', headers, body: JSON.stringify({ userId: user.id, title: userMessage.text }) });
        if (createRes.ok) { const json = await createRes.json(); const chat = json.chat as ChatSession; if (chat?.id) { conversationId = chat.id; setCurrentChatId(chat.id); setChatSessions([chat, ...(chatSessions || [])]); } }
      }

      // Auto-include uploaded file in completions if present
      const payload = {
        messages: [ { role: 'user', content: userMessage.text } ],
        conversation_id: conversationId,
        user_id: user?.id || 'anonymous',
        enhanced: true,
        enhanced_v2: true,
        mode: mode === 'quick' ? 'fast' : mode === 'deep' ? 'heavy' : 'auto',
        files: pendingFiles.length > 0 ? pendingFiles : undefined
      };
      console.log('[ZenuxChat] Completion request payload:', JSON.stringify(payload, null, 2));
      const controller = new AbortController(); sendAbortControllerRef.current = controller;
      const token2 = await getSupabaseAccessToken();
      const headers: Record<string,string> = { 'Content-Type': 'application/json' };
      if (token2) headers['Authorization'] = `Bearer ${token2}`;
      const res = await fetch('/api/ai/chat', { method: 'POST', headers, body: JSON.stringify(payload), signal: controller.signal });
      if (!res.ok) { throw new Error('AI response failed'); }

      const reader = res.body?.getReader();
      if (!reader) {
        const json = await res.json(); let aiContent = '';
        if (json && json.choices && Array.isArray(json.choices) && json.choices[0]?.message?.content) aiContent = json.choices[0].message.content;
        else if (json.response) aiContent = json.response; else if (json.text) aiContent = json.text; else if (json.content) aiContent = json.content;
        setMessages(m => [...m, { id: String(Date.now()+1), text: aiContent, isAI: true }]); setSending(false); return;
      }

      const decoder = new TextDecoder(); let aiText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        let anyDelta = false;
        for (const l of lines) {
          if (!l.toLowerCase().startsWith('data:')) continue;
          const line = l.replace(/^(?:data:\s*)+/i, '').trim();
          if (!line || line === '[DONE]') continue;
          try {
            let jsonLine = line;
            try {
              const obj = JSON.parse(jsonLine);
              if (obj.choices && Array.isArray(obj.choices)) {
                if (obj.choices[0]?.delta?.content) { aiText += obj.choices[0].delta.content; anyDelta = true; }
                else if (obj.choices[0]?.message?.content) { aiText = obj.choices[0].message.content; anyDelta = true; }
              } else if (obj.content) { aiText += obj.content; anyDelta = true; }
            } catch (parseErr) {
              void parseErr;
              const firstBrace = jsonLine.indexOf('{');
              if (firstBrace !== -1) jsonLine = jsonLine.slice(firstBrace);
              const obj = JSON.parse(jsonLine);
              if (obj.choices && Array.isArray(obj.choices)) {
                if (obj.choices[0]?.delta?.content) { aiText += obj.choices[0].delta.content; anyDelta = true; }
                else if (obj.choices[0]?.message?.content) { aiText = obj.choices[0].message.content; anyDelta = true; }
              } else if (obj.content) { aiText += obj.content; anyDelta = true; }
            }
          } catch (err) {
            console.error('Error parsing streaming response:', err);
            continue;
          }
        }
        if (anyDelta) {
          setMessages(m => { const withoutPlaceholder = m.filter(mm => mm.id !== '__stream_ai'); return [...withoutPlaceholder, { id: '__stream_ai', text: aiText, isAI: true }]; });
        }
      }

      const finalMsg = aiText && aiText.trim().length > 0 ? aiText.trim() : 'AI did not return a response.';
      setMessages(m => { const withoutPlaceholder = m.filter(mm => mm.id !== '__stream_ai'); return [...withoutPlaceholder, { id: String(Date.now()+1), text: finalMsg, isAI: true }]; });
  setPendingFiles([]); // Clear after send so next message is normal
      try { if (conversationId && finalMsg) await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chatId: conversationId, role: 'assistant', content: finalMsg }) }); } catch (_err) { void _err; }
      sendAbortControllerRef.current = null;
    } catch (err: any) {
      if (err?.name === 'AbortError') { setMessages(m => m.filter(mm => mm.id !== '__stream_ai')); setSending(false); sendAbortControllerRef.current = null; return; }
      console.error('Chat API error:', err); setMessages(m => [...m, { id: String(Date.now()+2), text: 'Sorry, something went wrong with the AI response. Please try again later.', isAI: true }]);
    }
    setSending(false);
  };

  const cancelSend = () => { if (sendAbortControllerRef.current) { try { sendAbortControllerRef.current.abort(); } catch (_e) { void _e; } sendAbortControllerRef.current = null; } setSending(false); setMessages(m => m.filter(mm => mm.id !== '__stream_ai')); };

  const handleResendAI = (aiMsgId: string) => { const idx = messages.findIndex(m => m.id === aiMsgId); if (idx === -1) return; const prevUser = [...messages].slice(0, idx).reverse().find(m => !m.isAI); if (!prevUser) return; void sendMessage(prevUser.text); };

  const handleRewriteUser = (userMsgText: string, msgId: string) => { setMessage(userMsgText); setRewritingMessageId(msgId); setTimeout(() => textareaRef.current?.focus(), 50); };

  const handleCopy = async (text: string) => { try { await navigator.clipboard.writeText(text || ''); toast({ title: 'Copied!', duration: 2000 }); } catch (err) { console.error('Failed to copy', err); toast({ title: 'Error', description: 'Failed to copy text', variant: 'destructive', duration: 3000 }); } };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-[env(safe-area-inset-bottom)]">
      <MobileHeader title="Zenux AI" onToggle={() => setSidebarOpen(v => !v)} />
      <div className="flex-1 flex flex-row bg-gray-50 dark:bg-gray-900">
        {(sidebarOpen || isDesktop) && (
          <Sidebar
            chatSessions={chatSessions}
            onNewChat={() => { setMessages([]); setCurrentChatId(null); localStorage.removeItem('lastChatId'); }}
            onSelectChat={(id: string) => { setCurrentChatId(id); void loadMessagesForChat(id); }}
            user={user}
            onSignOut={signOut}
            navigateTo={navigateTo}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative h-screen">
          <div className="flex-none hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Zenux AI Chat</span>
            <button onClick={() => navigateTo('/settings')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">Settings</button>
          </div>

          <div ref={messagesRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
            <MessageList messages={messages} onCopy={handleCopy} onResend={handleResendAI} onRewrite={handleRewriteUser} />
          </div>

          {/* File preview UI above input area */}
          {_filePreview && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
              {_filePreview.url && _filePreview.type.startsWith('image/') ? (
                <img src={_filePreview.url} alt={_filePreview.name} className="w-12 h-12 object-cover rounded" />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded text-gray-500 dark:text-gray-400">
                  <span className="text-xs">{_filePreview.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-100">{_filePreview.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{_filePreview.type}</span>
                {_filePreview.uploadedName && (
                  <span className="text-xs text-green-600 dark:text-green-400">Uploaded as: {_filePreview.uploadedName}</span>
                )}
              </div>
              <button
                className="ml-auto px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => _setFilePreview(null)}
              >Remove</button>
            </div>
          )}

          <InputBar message={message} setMessage={setMessage} sending={sending} onSend={() => void sendMessage()} fileInputRef={fileInputRef} showAttachMenu={showAttachMenu} setShowAttachMenu={setShowAttachMenu} handleFileUpload={handleFileUpload} mode={mode} setMode={setMode} showModeMenu={showModeMenu} setShowModeMenu={setShowModeMenu} cancelSend={cancelSend} />
        </div>
      </div>
    </div>
  );
}
