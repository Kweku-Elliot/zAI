import React, { useState } from 'react';
import { Play, ChevronDown, Copy, Trash2, Clock } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { useApp } from '@/contexts/AppContext';

const CodeExecutionScreen = () => {
  const { user } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('print("Hello, World!")');
  const [output, setOutput] = useState('Hello, World!');
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  const languages = [
    { id: 'python', name: 'Python', color: 'bg-yellow-500' },
    { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-600' },
    { id: 'sql', name: 'SQL', color: 'bg-blue-500' },
    { id: 'java', name: 'Java', color: 'bg-red-500' },
    { id: 'cpp', name: 'C++', color: 'bg-blue-700' },
    { id: 'react', name: 'React', color: 'bg-cyan-500' },
  ];

  const runCode = () => {
    // Send the code to the AI assistant to get execution explanation or simulated output
    (async () => {
      try {
        const conversationId = `code-exec-${Date.now()}`;
        const payload = {
          message: `Execute or explain this ${selectedLanguage} code:\n\n${code}`,
          conversation_id: conversationId,
          user_id: (user as any)?.id || 'anonymous',
          enhanced: true,
          enhanced_v2: true,
        };

        // Attach access token if available
        const { data: sessionData } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        const headers: Record<string,string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          setOutput('AI execution service failed. Showing local simulated output.');
          return;
        }

        const text = await res.text();
        setOutput(text || 'No output from AI');
      } catch (err) { void err; setOutput('Failed to contact AI service. Showing simulated output.'); }
    })();
  };

  const clearOutput = () => {
    setOutput('');
  };

  const copyCode = () => {
    // In a real app, this would copy to clipboard
    console.log('Code copied to clipboard');
  };

  return (
  <div className="flex flex-col min-h-screen bg-background text-foreground mobile-safe-container">
      <TopBar title="Code Executor" />
  <div className="flex-1 p-4 max-w-2xl mx-auto w-full pt-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Code Executor</h1>
          <p className="text-muted-foreground mt-1">Run code in multiple languages</p>
        </div>

        {/* Language Selector */}
        <div className="mb-4">
          <label className="text-foreground font-medium mb-2 block">Language</label>
          <button
            type="button"
            className="flex items-center justify-between bg-muted rounded-xl p-4 border border-border w-full">
            onClick={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)}
          >
            <span className="text-foreground font-medium">
              {languages.find(lang => lang.id === selectedLanguage)?.name}
            </span>
            <ChevronDown
              color="#6b7280"
              size={20}
              className={`${isLanguageSelectorOpen ? 'rotate-180' : ''} transition-transform`}
            />
          </button>

          {isLanguageSelectorOpen && (
            <div className="mt-2 bg-card rounded-lg border border-border shadow-sm">
              {languages.map((language) => (
                <button
                  key={language.id}
                  type="button"
                  className="flex items-center p-3 border-b border-border last:border-b-0 w-full">
                  onClick={() => {
                    setSelectedLanguage(language.id);
                    setIsLanguageSelectorOpen(false);
                  }}
                >
                  <span className={`w-3 h-3 rounded-full ${language.color} mr-3 inline-block`}></span>
                  <span className="text-card-foreground">{language.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="mb-4 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Code Editor</span>
            <div className="flex">
              <button onClick={copyCode} className="mr-3 p-1" title="Copy code">
                <Copy color="#6b7280" size={18} />
              </button>
              <button onClick={() => setCode('')} className="p-1" title="Clear code">
                <Trash2 color="#6b7280" size={18} />
              </button>
            </div>
          </div>
          <textarea
            className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 font-mono text-gray-800 dark:text-gray-100 text-base flex-1 resize-none min-h-[120px]"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter your code here..."
          />
        </div>

        {/* Run Button */}
        <button
          className="bg-blue-500 rounded-xl py-4 mb-4 flex items-center justify-center w-full"
          onClick={runCode}
        >
          <Play color="white" size={20} className="mr-2" />
          <span className="text-white font-bold text-lg">Run Code</span>
        </button>

        {/* Output Panel */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 dark:text-gray-200 font-medium">Output</span>
            <button onClick={clearOutput} className="p-1" title="Clear output">
              <Trash2 color="#6b7280" size={18} />
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[80px]">
            <div className="p-4">
              {output ? (
                <pre className="font-mono text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="flex items-center py-8">
                  <Clock color="#9ca3af" size={20} className="mr-2" />
                  <span className="text-gray-400 dark:text-gray-500">Run code to see output</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExecutionScreen;
