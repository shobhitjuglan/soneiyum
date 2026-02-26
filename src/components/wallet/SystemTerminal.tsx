import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export default function SystemTerminal() {
  const { logs } = useWallet();
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic: triggers every time the 'logs' array changes
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-[#050505] border border-slate-800/80 rounded-xl p-3 h-40 flex flex-col relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
      
      {/* Terminal Header */}
      <div className="flex items-center text-slate-500 mb-2 pb-2 border-b border-slate-800/60">
        <Terminal className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
          System Diagnostics
        </span>
        <div className="ml-auto flex space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse"></div>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="overflow-y-auto terminal-scrollbar flex-1 space-y-1 pr-2">
        {logs.map((log, index) => {
          // Color code errors or success messages based on keywords
          const isError = log.includes('[ERROR]');
          const isSuccess = log.includes('[SUCCESS]');
          
          let textColor = 'text-emerald-500/70'; // Default green
          if (isError) textColor = 'text-red-400/80';
          if (isSuccess) textColor = 'text-blue-400/90';

          return (
            <div 
              key={index} 
              className={`text-[10px] font-mono leading-relaxed break-words ${textColor}`}
            >
              {log}
            </div>
          );
        })}
        {/* Invisible div to act as our scroll anchor */}
        <div ref={logsEndRef} />
      </div>
      
    </div>
  );
}