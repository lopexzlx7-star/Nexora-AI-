import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, AudioLines, User, X, MessageSquare, Plus, Link2, Zap, Settings2, ChevronLeft, MoreHorizontal, Copy, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'openai' | 'mistral'>('mistral');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nexora_sessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexora_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const createNewSession = () => {
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const selectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    
    let targetSessionId = currentSessionId;
    let updatedSessions = [...sessions];

    if (!targetSessionId) {
      targetSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: targetSessionId,
        title: userMessage.content.slice(0, 30) + (userMessage.content.length > 30 ? '...' : ''),
        messages: [userMessage],
        updatedAt: Date.now()
      };
      updatedSessions = [newSession, ...updatedSessions];
      setCurrentSessionId(targetSessionId);
    } else {
      updatedSessions = updatedSessions.map(s => 
        s.id === targetSessionId 
          ? { ...s, messages: [...s.messages, userMessage], updatedAt: Date.now() }
          : s
      );
    }
    
    setSessions(updatedSessions);
    setInput('');
    setIsThinking(true);

    try {
      const currentHistory = updatedSessions.find(s => s.id === targetSessionId)?.messages || [userMessage];
      const historyPayload = currentHistory.slice(0, -1);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history: historyPayload, model: selectedModel }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Network response was not ok');
      }
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Silence.',
      };
      
      setSessions(prev => prev.map(s => 
        s.id === targetSessionId 
          ? { ...s, messages: [...s.messages, assistantMessage], updatedAt: Date.now() }
          : s
      ));
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I lost connection for a moment. Please try again.',
      };
      setSessions(prev => prev.map(s => 
        s.id === targetSessionId 
          ? { ...s, messages: [...s.messages, errorMessage], updatedAt: Date.now() }
          : s
      ));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-[#050505] overflow-hidden flex flex-col font-sans text-gray-100 selection:bg-blue-500/30 selection:text-white">
      
      {/* Background Radial Glow */}
      <div className={clsx(
        "absolute inset-0 transition-opacity duration-1000 pointer-events-none z-0",
        messages.length === 0 ? "opacity-100" : "opacity-40"
      )}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.08)_0%,rgba(5,5,5,0)_60%)]" />
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-[100] w-72 sm:w-80 bg-[#0a0a0a] border-r border-white/5 transform transition-transform duration-500 ease-[0.16,1,0.3,1] flex flex-col shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <button 
            onClick={createNewSession}
            className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Novo Chat
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-3 py-4 space-y-1 border-b border-white/5">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Link2 size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Conectores</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Zap size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Skills</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings2 size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Instruções Personalizadas</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-1">
          <h3 className="text-xs font-medium text-white/30 uppercase tracking-widest px-3 py-2 mb-1 mt-2">Histórico</h3>
          {sessions.length === 0 ? (
            <p className="text-white/20 text-sm px-3 py-4">Nenhum chat anterior.</p>
          ) : (
            sessions.map(session => (
              <button
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={clsx(
                  "w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors",
                  currentSessionId === session.id 
                    ? "bg-blue-500/10 text-blue-400" 
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                )}
              >
                <MessageSquare size={16} className={currentSessionId === session.id ? "text-blue-500" : "text-white/40"} />
                <span className="truncate text-sm font-medium">{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6 sm:px-8 pointer-events-none">
          <div className="pointer-events-auto">
            {messages.length === 0 ? (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-white/70 hover:text-white transition-colors p-2 -ml-2"
              >
                <Menu size={24} />
              </button>
            ) : (
              <button 
                onClick={createNewSession}
                className="text-white/70 hover:text-white transition-colors p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
            <div className="text-blue-400/90 text-sm font-semibold tracking-[0.2em] uppercase">
              Nexora AI
            </div>
          </div>

          <div className="pointer-events-auto">
            {messages.length === 0 ? (
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 backdrop-blur-md">
                <User size={18} className="text-white/70" />
              </div>
            ) : (
              <button className="text-white/70 hover:text-white transition-colors p-2 -mr-2 bg-white/5 hover:bg-white/10 rounded-full">
                <MoreHorizontal size={20} />
              </button>
            )}
          </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 overflow-y-auto hide-scrollbar flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-8 pt-24">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center pointer-events-none mt-[20vh] sm:mt-[25vh]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white max-w-[12ch] sm:max-w-[15ch] leading-tight tracking-tight">
                Como posso te ajudar hoje?
              </h1>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 py-4 min-h-full">
            <div className="flex-1" />
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className={clsx(
                    "flex max-w-[90%] sm:max-w-[85%]",
                    msg.role === 'user' ? "self-end justify-end" : "self-start justify-start"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,150,255,0.3)]">
                        <Zap size={14} className="text-white" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <div className={clsx(
                      "px-5 sm:px-6 py-3 sm:py-4 leading-relaxed text-base sm:text-lg font-light shadow-lg",
                      msg.role === 'user'
                        ? "bg-white text-black rounded-[2rem] rounded-tl-md"
                        : "bg-[#161821] text-white/90 rounded-[2rem] rounded-tr-md border border-white/5"
                    )}>
                      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl prose-img:shadow-lg prose-a:text-blue-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 px-2">
                        <button 
                          onClick={() => navigator.clipboard.writeText(msg.content)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <Copy size={12} /> Copiar
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex max-w-[90%] self-start"
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,150,255,0.5)]">
                      <Zap size={14} className="text-white animate-pulse" fill="currentColor" />
                    </div>
                  </div>
                  <div className="bg-[#161821] px-6 py-4 rounded-[2rem] rounded-tl-md border border-white/5 flex items-center gap-1.5 h-[52px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
            )}
            <div ref={messagesEndRef} className="h-32 sm:h-40 shrink-0" />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none">
        <form 
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative group pointer-events-auto"
        >
          <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] blur-xl transition-all duration-500 group-focus-within:bg-blue-500/15" />
          <div className="relative flex items-center bg-[#0d0d0d]/90 border border-white/5 rounded-[2.5rem] p-1.5 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500/30 focus-within:bg-[#111111] shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-transparent px-5 sm:px-6 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none text-base sm:text-lg font-light w-full"
              disabled={isThinking}
            />
            
            <div className="flex items-center gap-1 pr-2">
              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className={clsx(
                  "p-3 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 w-12 h-12",
                  input.trim() 
                    ? "bg-blue-600 text-white shadow-lg hover:bg-blue-500" 
                    : "bg-white/5 text-white/20"
                )}
              >
                <Send size={18} className={clsx("transition-transform duration-300", input.trim() && !isThinking ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "")} />
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
