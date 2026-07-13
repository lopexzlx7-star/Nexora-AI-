import React, { useState } from 'react';
import { Search, Filter, Plus, Key, Webhook, Activity, Shield, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
  'Todos', 'Desenvolvimento', 'Marketing', 'CRM', 'Banco de Dados', 'Cloud',
  'Produtividade', 'Financeiro', 'E-commerce', 'Redes Sociais', 'IA'
];

const CONNECTORS = [
  { id: 'github', name: 'GitHub', category: 'Desenvolvimento', status: 'connected', desc: 'Acessar repositórios e PRs' },
  { id: 'gitlab', name: 'GitLab', category: 'Desenvolvimento', status: 'available', desc: 'Gerenciamento de código fonte' },
  { id: 'vercel', name: 'Vercel', category: 'Cloud', status: 'connected', desc: 'Deploy e hospedagem frontend' },
  { id: 'supabase', name: 'Supabase', category: 'Banco de Dados', status: 'available', desc: 'Banco de dados e autenticação' },
  { id: 'google-drive', name: 'Google Workspace', category: 'Produtividade', status: 'connected', desc: 'Drive, Docs, Sheets e Calendar' },
  { id: 'notion', name: 'Notion', category: 'Produtividade', status: 'available', desc: 'Bases de conhecimento e projetos' },
  { id: 'stripe', name: 'Stripe', category: 'Financeiro', status: 'error', desc: 'Pagamentos e assinaturas' },
  { id: 'meta-ads', name: 'Meta Ads', category: 'Marketing', status: 'available', desc: 'Gestão de campanhas no Facebook/Instagram' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'available', desc: 'Marketing, vendas e atendimento' },
  { id: 'discord', name: 'Discord', category: 'Comunicação', status: 'connected', desc: 'Acessar servidores e mensagens' },
  { id: 'slack', name: 'Slack', category: 'Comunicação', status: 'available', desc: 'Comunicação corporativa' },
  { id: 'openai', name: 'OpenAI', category: 'IA', status: 'connected', desc: 'Modelos GPT-4 e embeddings' },
];

export function ConnectorsView() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<any>(null);

  const filteredConnectors = CONNECTORS.filter(c => 
    (activeCategory === 'Todos' || c.category === activeCategory) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Buscar conectores..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-white/30"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
            <Filter size={16} />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus size={16} />
            <span className="hidden sm:inline">Adicionar API</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeCategory === cat 
                ? "bg-white text-black" 
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid & Details */}
      <div className="flex gap-6 flex-1 min-h-0 relative">
        <div className={clsx(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max overflow-y-auto pr-2 content-start w-full",
          selectedConnector ? "hidden lg:grid lg:w-2/3" : "grid"
        )}>
          {filteredConnectors.map((connector) => (
            <div 
              key={connector.id}
              onClick={() => setSelectedConnector(connector)}
              className={clsx(
                "p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all cursor-pointer",
                selectedConnector?.id === connector.id ? "border-blue-500 bg-blue-500/5" : "border-white/5"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{connector.name.charAt(0)}</span>
                </div>
                {connector.status === 'connected' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Conectado
                  </span>
                )}
                {connector.status === 'error' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full border border-rose-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Falha
                  </span>
                )}
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{connector.name}</h3>
              <p className="text-white/40 text-xs line-clamp-2">{connector.desc}</p>
            </div>
          ))}
        </div>

        {/* Selected Connector Panel */}
        {selectedConnector && (
          <div className="flex w-full lg:w-1/3 flex-col bg-[#0d0e15] border border-white/10 rounded-2xl p-5 overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setSelectedConnector(null)}
                className="lg:hidden p-2 -ml-2 text-white/50 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-2xl">{selectedConnector.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">{selectedConnector.name}</h2>
                <p className="text-xs text-white/50">{selectedConnector.category}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {selectedConnector.status === 'connected' ? (
                <>
                  <button className="flex-1 py-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white border border-white/10 text-xs font-medium rounded-lg transition-colors">
                    Desconectar
                  </button>
                  <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">
                    Reautenticar
                  </button>
                </>
              ) : (
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                  Conectar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><Key size={14} /> Credenciais & Permissões</h4>
                <div className="text-[11px] text-white/50 space-y-1">
                  <div className="flex justify-between"><span>Tipo:</span> <span className="text-white">OAuth 2.0</span></div>
                  <div className="flex justify-between"><span>Escopo:</span> <span className="text-white">Leitura/Escrita</span></div>
                  <div className="flex justify-between"><span>Status Token:</span> <span className="text-emerald-400">Válido</span></div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><Activity size={14} /> Monitoramento</h4>
                <div className="text-[11px] text-white/50 space-y-1">
                  <div className="flex justify-between"><span>Último sync:</span> <span className="text-white">Há 2 minutos</span></div>
                  <div className="flex justify-between"><span>Requisições (24h):</span> <span className="text-white">1.243</span></div>
                  <div className="flex justify-between"><span>Erros:</span> <span className="text-white">0%</span></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] font-medium rounded transition-colors flex items-center justify-center gap-1">
                    <RefreshCw size={12} /> Sync Manual
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><Webhook size={14} /> Eventos e Logs</h4>
                <div className="space-y-2 mt-2">
                  <div className="text-[10px] font-mono text-white/40 border-l-2 border-emerald-500/50 pl-2">
                    <span className="text-white/20">14:32:01</span> [SYNC] Dados atualizados com sucesso
                  </div>
                  <div className="text-[10px] font-mono text-white/40 border-l-2 border-blue-500/50 pl-2">
                    <span className="text-white/20">14:30:12</span> [WEBHOOK] Evento recebido: item.created
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
