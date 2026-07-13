import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link2, Zap, Settings2, Database, Search, Filter, Plus, ChevronRight, Activity, Shield, Key, Webhook, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { ConnectorsView } from './ConnectorsView';
import { SkillsView } from './SkillsView';
import { InstructionsView } from './InstructionsView';

interface PlatformManagerProps {
  initialView: 'connectors' | 'skills' | 'instructions' | 'memory' | null;
  onClose: () => void;
}

export function PlatformManager({ initialView, onClose }: PlatformManagerProps) {
  const [activeTab, setActiveTab] = useState(initialView || 'connectors');

  const tabs = [
    { id: 'connectors', label: 'Conectores', icon: Link2, desc: 'Integrações externas' },
    { id: 'skills', label: 'Skills', icon: Zap, desc: 'Especialistas IA' },
    { id: 'instructions', label: 'Instruções', icon: Settings2, desc: 'Regras e contexto' },
    { id: 'memory', label: 'Memória', icon: Database, desc: 'Contexto de longo prazo' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[85vh] bg-[#0d0e15] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.02] p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-8">
              <div className="text-blue-400 font-bold tracking-widest uppercase text-sm">
                Plataforma
              </div>
              <button 
                onClick={onClose}
                className="md:hidden text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left whitespace-nowrap shrink-0",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <Icon size={18} />
                    <div>
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-[10px] opacity-70 hidden md:block mt-0.5">{tab.desc}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
            
            <div className="mt-auto hidden md:block pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                <span>Uso da Plataforma</span>
                <span>42%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#13141c] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 shrink-0 hidden md:flex">
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <button 
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === 'connectors' && <ConnectorsView />}
              {activeTab === 'skills' && <SkillsView />}
              {activeTab === 'instructions' && <InstructionsView />}
              {activeTab === 'memory' && (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <Database size={48} className="mb-4 opacity-20" />
                  <p>Central de Memória em desenvolvimento...</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
