import React, { useState } from 'react';
import { Search, Plus, Filter, Play, Settings, BookOpen, GitBranch } from 'lucide-react';
import clsx from 'clsx';

const SKILLS = [
  { id: 'dev', name: 'Arquiteto de Software', category: 'Desenvolvimento', active: true, desc: 'Planeja e estrutura sistemas complexos escaláveis.' },
  { id: 'designer', name: 'UI/UX Designer', category: 'Design', active: true, desc: 'Especialista em interfaces e experiência do usuário.' },
  { id: 'copy', name: 'Copywriter Sênior', category: 'Marketing', active: false, desc: 'Cria textos persuasivos para vendas e engajamento.' },
  { id: 'seo', name: 'Especialista SEO', category: 'Marketing', active: true, desc: 'Otimiza conteúdo para motores de busca.' },
  { id: 'dados', name: 'Analista de Dados', category: 'Analytics', active: true, desc: 'Analisa métricas e gera insights de negócios.' },
  { id: 'devops', name: 'Engenheiro DevOps', category: 'Cloud', active: false, desc: 'Configura CI/CD e infraestrutura em nuvem.' },
];

export function SkillsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const filteredSkills = SKILLS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Buscar skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-white/30"
          />
        </div>
        
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} />
          <span>Nova Skill</span>
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 relative">
        <div className={clsx(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max overflow-y-auto pr-2 content-start w-full",
          selectedSkill ? "hidden lg:grid lg:w-2/3" : "grid"
        )}>
          {filteredSkills.map((skill) => (
            <div 
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className={clsx(
                "p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative",
                selectedSkill?.id === skill.id ? "border-blue-500 bg-blue-500/5" : "border-white/5"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{skill.category}</span>
                <div className={clsx("w-2 h-2 rounded-full", skill.active ? "bg-emerald-400" : "bg-white/20")}></div>
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{skill.name}</h3>
              <p className="text-white/40 text-xs line-clamp-2">{skill.desc}</p>
            </div>
          ))}
        </div>

        {selectedSkill && (
          <div className="flex w-full lg:w-1/3 flex-col bg-[#0d0e15] border border-white/10 rounded-2xl p-5 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => setSelectedSkill(null)}
                  className="lg:hidden p-1 -ml-1 text-white/50 hover:text-white"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div>
                  <h2 className="text-lg font-medium text-white">{selectedSkill.name}</h2>
                  <p className="text-xs text-white/50">{selectedSkill.category}</p>
                </div>
              </div>
              <div className="relative cursor-pointer w-9 h-5 rounded-full bg-blue-500 shrink-0">
                 <span className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow translate-x-4"></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><BookOpen size={14} /> Prompt Base</h4>
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                  "Você é um {selectedSkill.name} extremamente qualificado. Seu objetivo é analisar os requisitos e..."
                </p>
                <button className="mt-2 text-blue-400 text-[10px] font-medium hover:underline">Editar Prompt</button>
              </div>

              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><Settings size={14} /> Configurações do Modelo</h4>
                <div className="text-[11px] text-white/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Modelo:</span> 
                    <select className="bg-black border border-white/10 rounded px-1 py-0.5 text-white outline-none">
                      <option>GPT-4o</option>
                      <option>Mistral Large</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Temperatura:</span> 
                    <span className="text-white">0.4</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <h4 className="text-xs font-medium text-white/70 mb-2 flex items-center gap-2"><GitBranch size={14} /> Fluxos & Ferramentas</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">Ler Arquivos</span>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">Acesso DB</span>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">Busca Web</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex gap-2">
               <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                 <Settings size={14} /> Configurar
               </button>
               <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                 <Play size={14} /> Testar Skill
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
