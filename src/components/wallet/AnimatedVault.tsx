import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Eye, EyeOff, Lock } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { GlassCard } from '../ui/GlassCard';



export default function AnimatedVault() {
  const { isGenerated, generateVault, addLog, mnemonic } = useWallet();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    generateVault();
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
    addLog(`[SECURITY] Mnemonic state: ${!isRevealed ? 'EXPOSED' : 'SECURED'}`);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center">
          <Key className="w-4 h-4 mr-2 text-blue-500" />
          Vault Core
        </h2>
        {isGenerated && (
          <button 
            onClick={toggleReveal}
            className="text-xs flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRevealed ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {isRevealed ? 'Conceal' : 'Reveal'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div
            key="generate-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center py-4"
          >
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative w-full py-4 px-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl text-sm font-medium text-blue-400 transition-all overflow-hidden"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center animate-pulse">
                  <Shield className="w-4 h-4 mr-2 animate-spin" />
                  Synthesizing Entropy...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Initialize Secure Enclave
                </span>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="mnemonic-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className={`grid grid-cols-3 gap-3 transition-all duration-500 ${!isRevealed ? 'blur-md scale-95 opacity-40' : 'blur-0 scale-100 opacity-100'}`}>
              {mnemonic.map((word, i) => ( // <-- Use the real state array
                <div key={i} className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-2 flex items-center">
                  <span className="text-[10px] text-slate-600 w-4">{i + 1}.</span>
                  <span className="text-xs font-mono text-slate-300 ml-1">{word}</span>
                </div>
              ))}
            </div>

            {!isRevealed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Lock className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">Encrypted</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}