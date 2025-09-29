// Extract readable message from Python-style dicts
function extractAssistantText(str: string): string {
	// Match all dicts and extract 'content' from 'delta'
	const regex = /'delta': ?\{([^}]*)\}/g;
	let result = '';
	let match;
	while ((match = regex.exec(str)) !== null) {
		const contentMatch = /'content': ?'([^']*)'/.exec(match[1]);
		if (contentMatch && contentMatch[1]) {
			result += contentMatch[1];
		}
	}
	return result || str;
}
import React, { useState, useEffect, useRef, useContext } from 'react';
import { MarkdownMessage } from '../../components/MarkdownMessage';
import { Settings2, Paperclip, Send, Plus, Sparkles, Users, X, Wallet, Code, Trophy, Layers } from 'lucide-react';
// Custom mobile sidebar icon SVG
const MobileMenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
	</svg>
);
import { useLocation } from 'wouter';
import { AuthContext } from '../../contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { ChatSession, ChatMessage as ServerMessage } from '@/types';

export default function ChatPage() {
	const [message, setMessage] = useState('');
	// UI message type (simplified)
	type UIMessage = { id: string; text: string; isAI: boolean; createdAt?: string };
	const [messages, setMessages] = useState<UIMessage[]>([]);
	const [sending, setSending] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

	// Auth context - show logout when user is signed in
	const { user, signOut } = useContext(AuthContext);
	const { currentChatId } = useApp();
	    // Mode switch state
		    // ...existing code...

	// recent chats will be loaded from the server (Supabase storage via /api/chats/:userId)
	const { chatSessions, setChatSessions, setCurrentChatId } = useApp();

	// Local loading state for chats/messages
	const [, setLoadingChats] = useState(false);
	const [_loadingMessages, setLoadingMessages] = useState(false);

	// Load messages for a chat and map them to UIMessage
	const loadMessagesForChat = async (chatId: string) => {
		setLoadingMessages(true);
		try {
			const res = await fetch(`/api/messages/${chatId}`);
			if (res.ok) {
				const json = await res.json();
				const serverMessages: ServerMessage[] = json.messages || [];
				const uiMessages: UIMessage[] = serverMessages
					.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
					.map((m) => ({ id: m.id, text: m.content, isAI: m.role === 'assistant', createdAt: m.createdAt }));
				setMessages(uiMessages);
			} else {
				console.warn('Failed to load messages for chat', chatId);
			}
		} catch (err) {
			console.error('Error loading messages:', err);
		}
		setLoadingMessages(false);
	};

	// load recent chats for the signed-in user
	useEffect(() => {
		const loadChats = async () => {
			if (!user) return;
			setLoadingChats(true);
			try {
				const res = await fetch(`/api/chats/${user.id}`);
				if (res.ok) {
					const json = await res.json();
					setChatSessions(json.chats || []);
				}
			} catch (err) {
				console.error('Failed to load chats:', err);
			}
			setLoadingChats(false);
		};
		loadChats();
	}, [user, setChatSessions]);

	// When currentChatId changes, load its messages
	useEffect(() => {
		if (currentChatId) {
			void loadMessagesForChat(currentChatId);
		} else {
			setMessages([]);
		}
	}, [currentChatId]);

	// On mount, restore last chat session from localStorage (if available)
	useEffect(() => {
		const lastChatId = localStorage.getItem('lastChatId');
		if (lastChatId) {
			setCurrentChatId(lastChatId);
		}
	}, [setCurrentChatId]);

	// Whenever currentChatId changes, persist to localStorage
	useEffect(() => {
		if (currentChatId) {
			localStorage.setItem('lastChatId', currentChatId);
		}
	}, [currentChatId]);

	// Auto-scroll messages area to bottom whenever messages change
	useEffect(() => {
		const el = messagesRef.current;
		if (el) {
			// scroll to bottom smoothly
			el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' as ScrollBehavior });
		}
	}, [messages]);

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const scrollHeight = textareaRef.current.scrollHeight;
			const lineHeight = 24; // px, adjust if needed
			const maxHeight = lineHeight * 10;
			textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
			textareaRef.current.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
		}
	}, [message]);

	const sendMessage = async () => {
		if (!message.trim()) return;
		if (!user) {
			// require sign in to persist chats
			navigateTo('/login');
			return;
		}
		const userMessage = { id: String(Date.now()), text: message.trim(), isAI: false };
		setMessages((m) => [...m, userMessage]);
		setMessage('');
		setSending(true);

	// Use the app's current chat/session id when available so conversation threading works
	// If there is no current chat we must create one on the server and use the first user message as the title
	let conversationId = currentChatId;
	try {
		if (!conversationId) {
			// create chat on server with title = first user message
			setLoadingChats(true);
			const { data: sessionData } = await supabase.auth.getSession();
			const token = sessionData?.session?.access_token;
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;

			const createRes = await fetch('/api/chats', {
				method: 'POST',
				headers,
				body: JSON.stringify({ userId: user.id, title: userMessage.text }),
			});
				if (createRes.ok) {
					const json = await createRes.json();
					const chat = json.chat as ChatSession;
					if (chat && chat.id) {
						conversationId = chat.id;
						setCurrentChatId(chat.id);
						// update local sessions list
						setChatSessions([chat, ...(chatSessions || [])]);
					}
				} else {
				console.warn('Failed to create chat on server', createRes.statusText);
			}
			setLoadingChats(false);
			// persist user's message to server messages store
			try {
				if (conversationId) {
					await fetch('/api/messages', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ chatId: conversationId, role: 'user', content: userMessage.text }),
					});
				}
			} catch (_err) { void _err; }
		}
	} catch (err) {
		console.error('Error creating chat:', err);
	}

		const payload = {
			message: userMessage.text,
			conversation_id: conversationId,
			user_id: user?.id || 'anonymous',
			enhanced: true,
			enhanced_v2: true,
		};

		try {
			// Use the enhanced v2 server route that streams SSE back to the client
			// Attach Supabase access token as Authorization header when available
			const { data: sessionData } = await supabase.auth.getSession();
			const token = sessionData?.session?.access_token;
			const headers: Record<string, string> = { 'Content-Type': 'application/json' };
			if (token) headers['Authorization'] = `Bearer ${token}`;

			// DEBUG: log payload and whether Authorization header is present
			try {
				// print lightweight info to avoid leaking secrets in logs
				console.log('[client] POST /api/ai/chat payload preview:', { message: payload.message, conversation_id: payload.conversation_id, user_id: payload.user_id });
				console.log('[client] Authorization header present:', !!headers['Authorization']);
			} catch (_e) { void _e; }

			const res = await fetch('/api/ai/chat', {
				method: 'POST',
				headers,
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				console.error('AI chat error', res.status, res.statusText);
				setMessages((m) => [...m, { id: String(Date.now() + 2), text: 'AI service error. Try again later.', isAI: true }]);
				setSending(false);
				return;
			}

			// Handle server-sent stream (text/event-stream)
			const reader = res.body?.getReader();
			if (!reader) {
				const json = await res.json();
				console.log('[AI RAW RESPONSE]', json); // Log raw response for debugging
				// Robustly extract OpenAI-style assistant message
				let aiContent = '';
				if (json && json.choices && Array.isArray(json.choices) && json.choices[0]?.message?.content) {
					aiContent = json.choices[0].message.content;
				} else if (json.response) {
					aiContent = json.response;
				} else if (json.text) {
					aiContent = json.text;
				} else if (json.content) {
					aiContent = json.content;
				}
				setMessages((m) => [...m, { id: String(Date.now() + 1), text: aiContent, isAI: true }]);
				setSending(false);
				return;
			}

			const decoder = new TextDecoder();
			let aiText = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				// The backend streams SSE-like "data: {...}" lines. Extract each 'data:' line robustly.
				// Split chunk into lines and find lines starting with 'data:'
				const lines = chunk.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
				let anyDeltaAppended = false;
				for (const l of lines) {
					if (!l.toLowerCase().startsWith('data:')) continue;
					const line = l.replace(/^data:\s*/i, '').trim();
					if (!line || line === '[DONE]') continue;
					try {
						const obj = JSON.parse(line);
						// Prefer delta.content for streaming chunks
						if (obj.choices && Array.isArray(obj.choices)) {
							const delta = obj.choices[0]?.delta || {};
							if (typeof delta.content === 'string' && delta.content.length > 0) {
								aiText += delta.content;
								anyDeltaAppended = true;
							}
						}
					} catch (_err) {
						// ignore non-JSON data lines
						void _err;
						continue;
					}
				}
				// update ephemeral partial message only when we appended new delta content
				if (anyDeltaAppended) {
					setMessages((m) => {
						// remove any previous streaming placeholder
						const withoutPlaceholder = m.filter(mm => mm.id !== '__stream_ai');
						return [...withoutPlaceholder, { id: '__stream_ai', text: aiText, isAI: true }];
					});
				}
			}

									// Clean up streamed AI message for readability
									let finalMsgRaw = aiText && aiText.trim().length > 0 ? aiText : 'AI did not return a response.';
									// Remove any JSON or chunk metadata, keep only readable text
									finalMsgRaw = finalMsgRaw.replace(/\{[^}]*\}/g, '').replace(/"content":/g, '').replace(/"role":\s*"assistant",?/g, '').replace(/"delta":/g, '').replace(/"object":\s*"chat\.completion\.chunk",?/g, '').replace(/"model":.*?,?/g, '').replace(/"provider":.*?,?/g, '').replace(/"version":.*?,?/g, '').replace(/"enhanced_v2":.*?,?/g, '').replace(/"choices":.*?,?/g, '').replace(/"id":.*?,?/g, '').replace(/"created":.*?,?/g, '').replace(/"finish_reason":.*?,?/g, '').replace(/"index":.*?,?/g, '').replace(/"stop":.*?,?/g, '').replace(/\[DONE\]/g, '').replace(/data:/g, '').replace(/\n/g, '\n').trim();
									const finalMsg = extractAssistantText(finalMsgRaw);
									setMessages((m) => m.map(mm => mm.id === '__stream_ai' ? { ...mm, id: String(Date.now() + 1), text: finalMsg } : mm));
									// persist assistant message to server for the conversation, if we have an id
									try {
											if (conversationId && finalMsg) {
													await fetch('/api/messages', {
															method: 'POST',
															headers: { 'Content-Type': 'application/json' },
															body: JSON.stringify({ chatId: conversationId, role: 'assistant', content: finalMsg }),
													});
											}
									} catch (_err) { void _err; }
		} catch (err: any) {
			console.error('Chat API error:', err);
			setMessages((m) => [
				...m,
				{
					id: String(Date.now() + 2),
					text: 'Sorry, something went wrong with the AI response. Please try again later.',
					isAI: true,
				},
			]);
		}
		setSending(false);
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const [, setLocation] = useLocation();

	const navigateTo = (path: string) => {
		setLocation(path);
		// close the sidebar on mobile after navigation
		setSidebarOpen(false);
	};

	// Responsive sidebar: update isDesktop on resize
	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 768);
		};
		window.addEventListener('resize', handleResize);
		// Initial check
		setIsDesktop(window.innerWidth >= 768);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Prevent background scrolling when sidebar (mobile) is open
	useEffect(() => {
		if (sidebarOpen && !isDesktop) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = prev || '';
			};
		}
		document.body.style.overflow = '';
		return () => {};
	}, [sidebarOpen, isDesktop]);

		const renderMessage = (msg: any) => (
		<div
			key={msg.id}
			className={`flex my-2 mx-4 ${msg.isAI ? 'justify-start' : 'justify-end'}`}
		>
			<div
				className={`max-w-[85%] rounded-2xl p-4 ${msg.isAI ? 'bg-gray-100 rounded-tl-none' : 'bg-blue-600 rounded-br-none'}`}
			>
				{msg.isAI ? (
					<MarkdownMessage text={msg.text} />
				) : (
					<span className={`text-sm ${msg.isAI ? 'text-gray-800' : 'text-white'}`}>{msg.text}</span>
				)}
			</div>
		</div>
	);

	    return (
		    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-[env(safe-area-inset-bottom)]">
			{/* Mobile Header */}
			<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
				<button onClick={toggleSidebar} className="p-2">
					<MobileMenuIcon />
				</button>
				<span className="text-lg font-bold text-gray-800 dark:text-gray-100">Zenux AI</span>
				<div className="w-6" />
			</div>

			<div className="flex-1 flex flex-row bg-gray-50 dark:bg-gray-900">
		    {/* Sidebar - Hidden on mobile by default */}
			    {(sidebarOpen || isDesktop) && (
							<div className={`absolute md:relative z-10 md:z-0 ${sidebarOpen ? 'left-0' : '-left-full'} md:left-0 inset-y-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0 md:flex transition-all duration-300 overflow-hidden`}>
						{/* Sidebar Header */}
						<div className="p-4 border-b border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<span className="text-lg font-bold text-gray-800 dark:text-gray-100">Zenux AI</span>
								<button className="md:hidden p-2" onClick={toggleSidebar}>
									<X size={24} color="#4B5563" />
								</button>
							</div>
							<button className="flex items-center justify-center bg-blue-600 rounded-lg p-3 mt-4 w-full hover:bg-blue-700 dark:hover:bg-blue-800">
								<Plus size={20} stroke="white" />
								<span className="text-white font-semibold ml-2">New Chat</span>
							</button>
						</div>

						{/* Stacked Horizontal Icons */}
						<div className="grid grid-cols-4 gap-y-2 gap-x-2 p-3 border-b border-gray-200 dark:border-gray-700">
							<button onClick={() => navigateTo('/image-video-gen')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
								<div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
									<Sparkles size={20} color="#3B82F6" />
								</div>
								<span className="text-gray-600 dark:text-gray-300 text-xs">Generate</span>
							</button>
							<button onClick={() => navigateTo('/credit')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
								<div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
									<Wallet size={20} color="#10B981" />
								</div>
								<span className="text-gray-600 dark:text-gray-300 text-xs">Credit</span>
							</button>
										<button onClick={() => navigateTo('/code-execution')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
											<div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
												<Code size={20} color="#EF4444" />
											</div>
											<span className="text-gray-600 dark:text-gray-300 text-xs">Codez</span>
										</button>
										<button onClick={() => navigateTo('/project-setup')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
											<div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-1">
												<Layers size={20} color="#6366F1" />
											</div>
											<span className="text-gray-600 dark:text-gray-300 text-xs">Projects</span>
										</button>
							<button onClick={() => navigateTo('/settings')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
								<div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1">
									<Settings2 size={20} color="#4B5563" />
								</div>
								<span className="text-gray-600 dark:text-gray-300 text-xs">Settings</span>
							</button>
							{user ? (
								<button onClick={() => { signOut(); navigateTo('/'); }} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full">
									<div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
										<Trophy size={20} color="#EF4444" />
									</div>
									<span className="text-gray-600 dark:text-gray-300 text-xs">Logout</span>
								</button>
							) : (
								<button onClick={() => navigateTo('/login')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full">
									<div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
										<Users size={20} color="#3B82F6" />
									</div>
									<span className="text-gray-600 dark:text-gray-300 text-xs">Login</span>
								</button>
							)}
						</div>

						{/* Chat History */}
						<div className="flex-1 p-2 overflow-y-auto min-h-0">
							<span className="text-gray-500 dark:text-gray-400 text-xs font-semibold px-2 py-2 block">RECENT CHATS</span>
							{chatSessions && chatSessions.length > 0 ? (
								chatSessions.map((chat: ChatSession) => (
									<button
										key={chat.id}
										onClick={() => { setCurrentChatId(chat.id); void loadMessagesForChat(chat.id); }}
										className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
									>
										<div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
											<span className="text-gray-600 dark:text-gray-300 font-medium">{chat.title?.charAt(0) || '?'}</span>
										</div>
										<div className="flex-1">
											<span className="text-gray-800 dark:text-gray-100 text-sm font-medium truncate block">{chat.title}</span>
											<span className="text-gray-500 dark:text-gray-400 text-xs block">{new Date(chat.lastMessageAt || chat.createdAt).toLocaleString()}</span>
										</div>
									</button>
								))
							) : (
								<div className="px-2 text-xs text-gray-500">No recent chats yet. Start a conversation to create one.</div>
							)}
						</div>

						{/* Plan Section - pinned footer */}
						<div className="flex-none p-4 border-t border-gray-200 dark:border-gray-700">
							<div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
								<div className="flex items-center justify-between">
									<div>
										<span className="text-gray-700 dark:text-gray-200 text-sm font-medium">Plan: Free</span>
										<span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">Upgrade for more features</span>
									</div>
									<button onClick={() => navigateTo('/billing')} className="ml-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-sm">Upgrade</button>
								</div>
							</div>
							{/* wallet removed on user request */}
						</div>
					</div>
				)}

				{/* Main Chat Area */}
				<div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
					{/* Desktop Header */}
					<div className="hidden md:flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
						<span className="text-xl font-bold text-gray-800 dark:text-gray-100">Zenux AI Chat</span>
						<button onClick={() => navigateTo('/settings')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
							<Settings2 size={20} color="#4B5563" />
						</button>
					</div>

																						{/* Messages Area */}
																						<div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-end px-4 pb-28">
																									{messages.map(renderMessage)}
																						</div>

																		{/* Input + Icons Container (fixed at bottom of chat area) */}
																											<div className="w-full flex-none sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-4 pt-2 pb-4" style={{ zIndex: 20 }}>
																												<div className="w-full flex items-center rounded-2xl bg-gray-100 dark:bg-gray-800 px-3 py-2" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
																				<textarea
																					ref={textareaRef}
																					className="flex-1 bg-transparent resize-none border-none focus:outline-none text-base text-gray-800 dark:text-gray-100 px-3 py-2 rounded-md"
																					placeholder="Ask anything"
																					value={message}
																					onChange={e => setMessage(e.target.value)}
																					rows={1}
																					disabled={sending}
																					style={{maxHeight: '240px', minHeight: '36px', overflowY: 'auto'}}
																				/>
																				<div className="flex items-center gap-2 ml-3">
																					<button
																						className="p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 shadow"
																						type="button"
																						tabIndex={-1}
																						disabled={sending}
																					>
																						<Paperclip size={20} color="#4B5563" />
																					</button>
																					<button
																						className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow"
																						onClick={sendMessage}
																						disabled={sending}
																					>
																						{sending ? (
																							<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
																						) : (
																							<Send size={20} color="#fff" />
																						)}
																					</button>
																				</div>
																			</div>
																		</div>
				</div>
			</div>
		</div>
	);
}
