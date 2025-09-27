import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Send, Eye, ChevronDown } from 'lucide-react';
import TopBar from '@/components/TopBar';

const ScaffoldGenerator: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your UI assistant. What kind of project would you like to create?", sender: 'ai' },
    { id: 2, text: "I want to create a React Native app with a clean dashboard", sender: 'user' },
    { id: 3, text: "Great! I've generated a dashboard with home, profile, and settings screens. You can preview or edit any page.", sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');
  const [pages] = useState([
    { id: 1, name: 'Home', type: 'Home' },
    { id: 2, name: 'Profile', type: 'Profile' },
    { id: 3, name: 'Settings', type: 'Settings' },
    { id: 4, name: 'Dashboard', type: 'Dashboard' },
  ]);
  const [activePage, setActivePage] = useState(4); // Set to Dashboard by default
  const [activeView, setActiveView] = useState<'chat' | 'preview'>('preview');
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [showPreviewMenu, setShowPreviewMenu] = useState(false);
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeout = useRef<number | null>(null);

  // Auto-scroll when messages change or when switching to chat view.
  useEffect(() => {
    const el = scrollViewRef.current;
    if (!el) return;
    // only auto-scroll when in chat view so we don't unexpectedly jump when preview is active
    if (activeView !== 'chat') return;
    // scroll to bottom
    el.scrollTop = el.scrollHeight;
  }, [messages, activeView]);

  // Compute preview card height as viewport minus header and nav heights.
  useLayoutEffect(() => {
    const setPreviewHeight = () => {
      const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
      const navH = navRef.current ? navRef.current.offsetHeight : 0;
      const margin = 24; // extra spacing above/below
      const available = Math.max(280, window.innerHeight - headerH - navH - margin);
      if (previewCardRef.current) {
        previewCardRef.current.style.setProperty('--preview-height', `${available}px`);
        // ensure the card has a bottom gap at least equal to nav height + small offset
        previewCardRef.current.style.setProperty('--preview-bottom-gap', `${navH + 12}px`);
      }
    };

    setPreviewHeight();

    const handleResize = () => {
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
      resizeTimeout.current = window.setTimeout(() => setPreviewHeight(), 80);
    };

    window.addEventListener('resize', handleResize);

    // observe header/nav size changes
    const ro = new ResizeObserver(() => setPreviewHeight());
    if (headerRef.current) ro.observe(headerRef.current);
    if (navRef.current) ro.observe(navRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
      if (resizeTimeout.current) window.clearTimeout(resizeTimeout.current);
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I've updated the page as requested. You can preview the changes now.",
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Removed unused handlePageSelect function

  const handleCopyCode = () => {
    const code = `// Generated UI Code\nimport React from 'react';\n// ...`;
    try {
      navigator.clipboard.writeText(code);
      // optional: show toast (not implemented)
    } catch (e) {
      console.error('copy failed', e);
    }
  };

  const handleEditPage = (pageName: string) => {
    setInputText(`@${pageName}: `);
  };

  const dashboardData = {
    stats: [
      { title: 'Total Users', value: '12,361', change: '+12.3%' },
      { title: 'Revenue', value: '$24,780', change: '+8.2%' },
      { title: 'Conversion', value: '4.7%', change: '+1.1%' },
      { title: 'Active Sessions', value: '1,294', change: '+3.4%' },
    ],
    chartData: [
      { month: 'Jan', value: 4000 },
      { month: 'Feb', value: 3000 },
      { month: 'Mar', value: 2000 },
      { month: 'Apr', value: 2780 },
      { month: 'May', value: 1890 },
      { month: 'Jun', value: 2390 },
    ]
  };

  const renderDashboardPreview = () => (
    <div className="p-4">
      <div className="flex flex-row flex-wrap gap-4 mb-6">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="flex-1 min-w-[40%] bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-green-500 text-sm mt-1">{stat.change} from last month</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-row justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-800">Performance Overview</span>
          <button className="flex flex-row items-center">
            <span className="text-blue-500 mr-1">Monthly</span>
            <ChevronDown color="#3B82F6" size={16} />
          </button>
        </div>
        <div className="h-48 bg-gray-100 rounded-lg flex justify-center items-center">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RGF0YSUyMGFuYWx5dGljc3xlbnwwfHwwfHx8MA%3D%3D" 
            alt="Chart" 
            style={{ width: '80%', height: 180, objectFit: 'contain' }}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <span className="text-lg font-semibold text-gray-800 mb-4 block">Recent Activity</span>
        <div className="flex flex-row items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex justify-center items-center mr-3">
            <span className="text-blue-500 font-bold">JD</span>
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-800">John Doe</span>
            <span className="text-gray-500 text-sm block">Updated the dashboard UI</span>
          </div>
          <span className="text-gray-400 text-sm">2h ago</span>
        </div>
        <div className="flex flex-row items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex justify-center items-center mr-3">
            <span className="text-green-500 font-bold">SA</span>
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-800">Sarah Adams</span>
            <span className="text-gray-500 text-sm block">Created new user profile</span>
          </div>
          <span className="text-gray-400 text-sm">4h ago</span>
        </div>
        <div className="flex flex-row items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex justify-center items-center mr-3">
            <span className="text-purple-500 font-bold">MJ</span>
          </div>
          <div className="flex-1">
            <span className="font-medium text-gray-800">Mike Johnson</span>
            <span className="text-gray-500 text-sm block">Fixed authentication bug</span>
          </div>
          <span className="text-gray-400 text-sm">1d ago</span>
        </div>
      </div>
    </div>
  );

  const renderCodePreview = () => (
    <div className="p-4">
      <div className="bg-gray-900 rounded-xl p-4">
        <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
{`// Generated UI Code\nimport React from 'react';\nimport { View, Text, ScrollView } from 'react-native';\n\nexport default function Dashboard() {\n  return (\n    <ScrollView className="flex-1 p-4">\n      <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>\n      <Text className="text-gray-500 mt-1">Welcome back, John!</Text>\n\n      {/* Stats Cards */}\n      <View className="flex-row flex-wrap gap-4 mt-6">\n        <View className="flex-1 min-w-[40%] bg-white rounded-xl p-4">\n          <Text className="text-gray-500 text-sm">Total Users</Text>\n          <Text className="text-2xl font-bold">12,361</Text>\n          <Text className="text-green-500 text-sm">+12.3% from last month</Text>\n        </View>\n        {/* More stat cards here */}\n      </View>\n\n      {/* Chart Section */}\n      <View className="bg-white rounded-xl p-4 mt-6">\n        <Text className="text-lg font-semibold">Performance Overview</Text>\n        {/* Chart implementation */}\n      </View>\n\n      {/* Recent Activity */}\n      <View className="bg-white rounded-xl p-4 mt-6">\n        <Text className="text-lg font-semibold mb-4">Recent Activity</Text>\n        {/* Activity items */}\n      </View>\n    </ScrollView>\n  );\n}`}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header (TopBar) */}
      <TopBar ref={headerRef} title="UI Scaffold Generator" />
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Chat Panel */}
        <div className={`absolute inset-0 flex flex-col bg-gray-50 transition-transform duration-300 transform ${activeView === 'chat' ? 'translate-x-0' : 'translate-x-full'}`}>
          <div 
            ref={scrollViewRef}
            className="flex-1 p-4 overflow-y-auto pb-20"
          >
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : ''}`}
              >
                <div 
                  className={`p-3 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 rounded-tr-none' 
                      : 'bg-gray-100 rounded-tl-none'
                  }`}
                >
                  <span 
                    className={`${
                      message.sender === 'user' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex flex-row items-center space-x-2">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type your request..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 resize-none focus:outline-none"
                rows={1}
              />
              <button 
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 rounded-full p-2.5 text-white"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        {/* Preview Panel */}
        <div className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 transform ${activeView === 'preview' ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Preview Header removed - controls will be placed elsewhere */}
          {/* Preview Content - render inside a centered phone-like card */}
          <div className="flex-1 overflow-hidden relative">
            {/* top-right preview menu (three dots) */}
            <div className="absolute top-3 right-3 z-20">
              <div className="relative">
                <button
                  onClick={() => setShowPreviewMenu(prev => !prev)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label="Preview menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </button>
                {showPreviewMenu && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <button onClick={() => { handleCopyCode(); setShowPreviewMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Copy code</button>
                    <button onClick={() => { setIsPreviewMode(prev => !prev); setShowPreviewMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Toggle view</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center p-6">
        <div ref={previewCardRef} className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ marginBottom: 'var(--preview-bottom-gap, 24px)' }}>
                {/* Phone screen area - fixed height but capped to viewport minus header/nav so it never overlaps nav */}
       <div className="bg-white overflow-hidden flex flex-col mt-4 mb-20"
         style={{ height: 'var(--preview-height)', maxHeight: 'calc(100vh - 80px)' }}>
                  {/* Scrollable phone screen content area with fixed height */}
                  <div className="flex-1 h-full overflow-y-auto">
                    {isPreviewMode ? renderDashboardPreview() : renderCodePreview()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
  <div ref={navRef} className="bg-white h-14 flex items-center justify-between px-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${activeView === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Send size={18} />
            <span className="text-sm font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${activeView === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Eye size={18} />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </div>
        
      {/* Page Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600"
            onClick={() => setShowPageMenu((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className="font-medium">Pages</span>
          </button>
          {showPageMenu && (
            <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => { setActivePage(page.id); setShowPageMenu(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 ${activePage === page.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                  >
                    {page.name}
                  </button>
                ))}
                <button
                  onClick={() => { handleEditPage(pages.find(p => p.id === activePage)?.name || ''); setShowPageMenu(false); }}
                  className="w-full text-left px-4 py-3 text-gray-400 hover:bg-gray-50"
                >
                  + Add Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScaffoldGenerator;


