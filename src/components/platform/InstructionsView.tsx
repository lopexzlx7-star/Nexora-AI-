import React from 'react';
import { Save, AlertCircle, ShieldAlert } from 'lucide-react';

export function InstructionsView() {
  return (
    <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
        <AlertCircle size={20} className="shrink-0" />
        <p className="text-sm">As instruções personalizadas definem o comportamento global da IA neste projeto. Elas têm precedência sobre o contexto da conversa, mas ficam abaixo das regras de segurança.</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center justify-between">
            <span>Contexto do Projeto / Usuário</span>
            <span className="text-[10px] text-white/40 font-normal">O que a IA deve saber sobre você ou este projeto?</span>
          </label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-white/20 resize-y min-h-[120px]"
            placeholder="Ex: Trabalho como desenvolvedor React, moro no Brasil, este projeto é um SaaS para clínicas médicas..."
            defaultValue="Este é o projeto Nexora Solutions. É uma plataforma SaaS voltada para empresas B2B. Sempre foque em arquitetura escalável e segurança."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center justify-between">
            <span>Diretrizes de Comportamento</span>
            <span className="text-[10px] text-white/40 font-normal">Como a IA deve agir e responder?</span>
          </label>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-white/20 resize-y min-h-[120px]"
            placeholder="Ex: Seja conciso, sempre me dê exemplos de código, use um tom amigável..."
            defaultValue="- Sempre pensar como CTO.
- Sempre entregar documentação ao alterar código complexo.
- Sempre explicar decisões de arquitetura.
- Sempre considerar segurança e otimização de custos."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Restrições (O que NÃO fazer)</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-white/20 resize-y min-h-[100px]"
              placeholder="Ex: Não use var em Javascript, não responda em outro idioma..."
              defaultValue="- Não utilize bibliotecas obsoletas.
- Não exponha senhas ou tokens nos logs.
- Não altere o banco de dados sem confirmação explícita."
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500" /> Nível de Autonomia
            </label>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-4 h-4 rounded border border-white/20 group-hover:border-blue-500 flex items-center justify-center bg-blue-500/20">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Requerer Aprovação</p>
                  <p className="text-[10px] text-white/50">Sempre pedir permissão antes de executar ações destrutivas (DELETE, DROP, etc).</p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 w-4 h-4 rounded border border-white/20 group-hover:border-blue-500 flex items-center justify-center">
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Autonomia Total</p>
                  <p className="text-[10px] text-white/50">Permitir que a IA execute qualquer comando sem perguntar.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
          <Save size={16} /> Salvar Instruções
        </button>
      </div>
    </div>
  );
}
