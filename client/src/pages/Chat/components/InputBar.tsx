import React, { useRef } from 'react';
import { Paperclip, Camera, ImageIcon as Image, FileIcon as File, Zap, Brain, Rocket, Send } from 'lucide-react';

export default function InputBar({
  message,
  setMessage,
  sending,
  onSend,
  fileInputRef,
  showAttachMenu,
  setShowAttachMenu,
  handleFileUpload,
  mode,
  setMode,
  showModeMenu,
  setShowModeMenu,
  cancelSend,
}: any) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex-none bg-gray-50 dark:bg-gray-900 px-4 pb-4 mb-[70px]">
      <div className="w-full rounded-2xl bg-gray-100 dark:bg-gray-800 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent resize-none border-none focus:outline-none text-base text-gray-800 dark:text-gray-100 px-3 py-2 rounded-md mb-3"
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          disabled={sending}
          style={{ maxHeight: '240px', minHeight: '36px', overflowY: 'auto' }}
        />
        <div className="flex items-center justify-between pt-2">
          <div className="relative flex items-center">
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx,.txt,.js,.py,.html,.css,.json" />
            <button className="p-2.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" type="button" tabIndex={-1} disabled={sending} onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ minHeight: '44px', minWidth: '44px' }}>
              <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[200px] transform transition-all duration-200 ease-out origin-bottom-left z-20">
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => alert('Camera coming soon')}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Camera size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Camera</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                  const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.onchange = (e) => handleFileUpload(e as any); input.click();
                }}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Image size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Photos</span>
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => {
                  const input = document.createElement('input'); input.type = 'file'; input.accept = '.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx'; input.onchange = (e) => handleFileUpload(e as any); input.click();
                }}>
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <File size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Files</span>
                </button>
              </div>
            )}
            <div className="ml-2 relative">
              <button className="pl-3 pr-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center gap-2 min-w-[44px] min-h-[44px]" onClick={() => setShowModeMenu((v: boolean) => !v)} type="button" aria-label="Select mode">
                {mode === 'quick' && <Zap size={20} className="text-blue-500" />}
                {mode === 'deep' && <Brain size={20} className="text-purple-500" />}
                {mode === 'auto' && <Rocket size={20} className="text-green-500" />}
                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200 capitalize">{mode === 'quick' ? 'Fast' : mode === 'deep' ? 'Heavy' : 'Auto'}</span>
              </button>
              {showModeMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[220px] z-30 border border-gray-200 dark:border-gray-700">
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'quick' ? 'bg-blue-50 dark:bg-blue-900' : ''}`} onClick={() => { setMode('quick'); setShowModeMenu(false); }}>
                    <Zap size={20} className="text-blue-500" />
                    <div><div className="font-semibold text-sm">Fast</div><div className="text-xs opacity-70">Quick</div></div>
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'deep' ? 'bg-purple-50 dark:bg-purple-900' : ''}`} onClick={() => { setMode('deep'); setShowModeMenu(false); }}>
                    <Brain size={20} className="text-purple-500" />
                    <div><div className="font-semibold text-sm">Heavy</div><div className="text-xs opacity-70">Deep / Expert</div></div>
                  </button>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${mode === 'auto' ? 'bg-green-50 dark:bg-green-900' : ''}`} onClick={() => { setMode('auto'); setShowModeMenu(false); }}>
                    <Rocket size={20} className="text-green-500" />
                    <div><div className="font-semibold text-sm">Auto</div><div className="text-xs opacity-70">Smart Auto (default)</div></div>
                  </button>
                </div>
              )}
            </div>
          </div>
          <button className="p-2.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={(e) => { e.preventDefault(); onSend(); }} style={{ minHeight: '44px', minWidth: '44px' }}>
            {!sending ? (<Send size={20} className="text-gray-600 dark:text-gray-400" />) : (
              <div onClick={(e) => { e.stopPropagation(); cancelSend(); }} aria-label="Cancel send" className="inline-flex items-center justify-center w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-300"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
