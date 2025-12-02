import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2, Settings2, Info, Globe } from 'lucide-react';
import { useLiveSession } from './hooks/useLiveSession';
import { ChatMessage } from './components/ChatMessage';
import { ConnectionState, AppMode, Language } from './types';

const API_KEY = process.env.API_KEY || '';

const App: React.FC = () => {
  const { status, connect, disconnect, volume, messages, clearMessages } = useLiveSession(API_KEY);
  const [mode, setMode] = useState<AppMode>(AppMode.CONVERSATION);
  const [language, setLanguage] = useState<Language>('burmese');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleConnection = () => {
    if (status === ConnectionState.CONNECTED || status === ConnectionState.CONNECTING) {
      disconnect();
    } else {
      connect(mode, language);
    }
  };

  const isConnected = status === ConnectionState.CONNECTED;
  const isConnecting = status === ConnectionState.CONNECTING;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-slate-50 shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <span className="font-burmese font-bold text-xl">မ</span>
          </div>
          <div>
             <h1 className="font-bold text-slate-800 text-lg leading-tight hidden sm:block">Burmese Speak & Scribe</h1>
             <h1 className="font-bold text-slate-800 text-lg leading-tight sm:hidden">BSS</h1>
             <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
               <span className="text-xs text-slate-500 font-medium">
                 {isConnected ? 'Live Connected' : 'Ready to Connect'}
               </span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 relative">
             <div className="relative flex items-center">
               <Globe size={16} className="absolute left-2.5 text-slate-500 pointer-events-none" />
               <select 
                   value={language}
                   onChange={(e) => !isConnected && setLanguage(e.target.value as Language)}
                   disabled={isConnected}
                   className="pl-8 pr-2 py-1.5 rounded-md text-xs font-medium bg-transparent text-slate-700 focus:outline-none disabled:opacity-50 appearance-none cursor-pointer hover:bg-slate-200/50 transition-colors border-none"
               >
                   <option value="burmese">Burmese</option>
                   <option value="english">English</option>
               </select>
             </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => !isConnected && setMode(AppMode.CONVERSATION)}
               disabled={isConnected}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === AppMode.CONVERSATION ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50 hidden sm:block`}
             >
               Conversation
             </button>
             <button 
               onClick={() => !isConnected && setMode(AppMode.CONVERSATION)}
               disabled={isConnected}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === AppMode.CONVERSATION ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50 sm:hidden`}
             >
               Chat
             </button>
             
             <button 
               onClick={() => !isConnected && setMode(AppMode.DICTATION)}
               disabled={isConnected}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === AppMode.DICTATION ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50`}
             >
               Dictation
             </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto px-4 md:px-8 py-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 px-6 text-center">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <Mic size={40} className="text-slate-300" />
               </div>
               <p className="font-burmese text-xl mb-2">
                  {language === 'burmese' ? 'မင်္ဂလာပါ' : 'Hello'}
               </p>
               <p className="text-sm max-w-xs">
                 Select a language and mode above, then tap the microphone to start.
               </p>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((msg, idx) => (
                <ChatMessage key={msg.id + idx} message={msg} />
              ))}
              {/* Invisible spacer for auto-scroll */}
              <div className="h-4" />
            </div>
          )}
        </div>

        {/* Floating Controls (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pointer-events-none">
           <div className="flex flex-col items-center gap-4 pointer-events-auto">
             
             {/* Visualizer Ring (Only visible when connected) */}
             <div className={`relative transition-all duration-300 ${isConnected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 h-0 overflow-hidden'}`}>
                {/* Dynamically scaled ring based on volume */}
                <div 
                  className="w-64 h-64 rounded-full bg-blue-500/5 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                  style={{ transform: `translate(-50%, -50%) scale(${1 + volume * 2})` }}
                />
             </div>

             {/* Main Control Bar */}
             <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full shadow-xl border border-slate-100">
                
                <button
                  onClick={clearMessages}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Clear Conversation"
                >
                  <Trash2 size={20} />
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <button
                  onClick={toggleConnection}
                  disabled={isConnecting}
                  className={`
                    group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 active:scale-95
                    ${isConnected 
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                    }
                    shadow-lg
                  `}
                >
                  {isConnecting ? (
                     <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : isConnected ? (
                    <>
                      <Square size={20} fill="currentColor" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic size={24} />
                      <span>Start Speaking</span>
                    </>
                  )}
                </button>

                {isConnected && (
                  <div className="flex items-center gap-2 px-3">
                     <div className="flex gap-1 h-4 items-end">
                        <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite]" style={{height: `${20 + volume * 80}%`, animationDelay: '0ms'}}></div>
                        <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite]" style={{height: `${30 + volume * 60}%`, animationDelay: '100ms'}}></div>
                        <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite]" style={{height: `${15 + volume * 90}%`, animationDelay: '200ms'}}></div>
                     </div>
                  </div>
                )}
             </div>
             
             {/* Status Text */}
             <p className="text-xs text-slate-400 font-medium h-4">
               {isConnecting && "Connecting to Gemini Live..."}
               {isConnected && mode === AppMode.DICTATION && "Listening & Transcribing..."}
               {isConnected && mode === AppMode.CONVERSATION && "Listening..."}
             </p>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;