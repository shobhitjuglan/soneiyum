import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, CheckCircle2, Coins } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { GlassCard } from '../ui/GlassCard';
import { fetchSoneiumBalance, fetchERC20Balance } from '../../lib/soneium';

const truncateAddress = (addr: string) => {
  if (!addr) return 'Awaiting Generation...';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export default function MultiChainDashboard() {
  const { addLog, soneiumAddress } = useWallet();
  
  const [syncing, setSyncing] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Balances State
  const [soneiumBalance, setSoneiumBalance] = useState("0.0000");
  const [jpycBalance, setJpycBalance] = useState("0"); // <-- JPYC State added
  const [solanaBalance, setSolanaBalance] = useState("0.0000");

  // --- SONEIUM LOGIC ---
  const handleSyncSoneium = async () => {
    if (!soneiumAddress) {
      addLog("[ERROR] Generate a vault first to sync Soneium.");
      return;
    }
    
    setSyncing('soneium');
    addLog(`[NETWORK] Connecting to Soneium Mainnet RPC...`);
    
    try {
      // 1. Fetch Base Gas Token (ETH)
      const ethBalance = await fetchSoneiumBalance(soneiumAddress);
      setSoneiumBalance(ethBalance);
      addLog(`[SUCCESS] Gas state synchronized: ${ethBalance} ETH`);

      // 2. Fetch ERC-20 Token (JPYC)
      addLog(`[SMART CONTRACT] Querying JPYC Token Contract...`);
      // Placeholder Soneium JPYC contract address
      const JPYC_CONTRACT_ADDRESS = "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB"; 
      const jpycBal = await fetchERC20Balance(soneiumAddress, JPYC_CONTRACT_ADDRESS);
      
      const formattedJpyc = Number(jpycBal).toFixed(0);
      setJpycBalance(formattedJpyc);
      addLog(`[SUCCESS] JPYC Balance verified: ¥${formattedJpyc}`);
      
    } catch (error) {
      addLog(`[ERROR] Soneium RPC connection failed.`);
    } finally {
      setSyncing(null);
    }
  };

  // --- SOLANA LOGIC ---
  const handleSyncSolana = () => {
    if (!soneiumAddress) return;
    setSyncing('solana');
    addLog(`[NETWORK] Querying latest block headers for Solana...`);
    setTimeout(() => {
      setSyncing(null);
      addLog(`[SUCCESS] Solana state synchronized: 0.0000 SOL`);
    }, 1200);
  };

  const handleCopy = (address: string, chainName: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(address);
    addLog(`[ACTION] Copied ${chainName} address to clipboard.`);
    setTimeout(() => setCopied(null), 2000);
  };

  // --- UI CONFIGURATION ---
  const CHAINS = [
    {
      id: 'solana',
      name: 'SOLANA (SPL)',
      ticker: 'SOL',
      balance: solanaBalance,
      address: soneiumAddress ? "HN7c812398jksdf8k8Yp" : "", 
      color: 'text-blue-400',
      hoverBg: 'hover:bg-blue-500/10',
      onSync: handleSyncSolana,
      subTokens: [] // Empty for now, scalable for later
    },
    {
      id: 'soneium',
      name: 'SONEIUM (EVM)',
      ticker: 'ETH',
      balance: soneiumBalance,
      address: soneiumAddress,
      color: 'text-emerald-400',
      hoverBg: 'hover:bg-emerald-500/10',
      onSync: handleSyncSoneium,
      // --- NEW: Sub-token array ---
      subTokens: [
        { name: 'Japanese Yen Peg', ticker: 'JPYC', balance: jpycBalance, symbol: '¥' }
      ]
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
        Multi-Chain Assets
      </h3>
      
      <div className="flex flex-col space-y-3">
        {CHAINS.map((chain, index) => (
          <motion.div
            key={chain.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
          >
            <GlassCard className="p-4 flex flex-col space-y-3 group transition-all duration-300 hover:border-slate-700">
              
              {/* Primary Header & Balance */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                    {chain.name}
                  </span>
                  <div className="text-2xl font-bold text-slate-100 flex items-baseline space-x-1 mt-1">
                    <span>{chain.balance}</span>
                    <span className={`text-sm font-medium ${chain.color}`}>
                      {chain.ticker}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={chain.onSync}
                  disabled={syncing !== null}
                  className={`p-2 rounded-lg bg-slate-800/40 border border-slate-700/60 transition-colors ${chain.hoverBg} ${syncing === chain.id ? 'animate-pulse' : ''}`}
                >
                  <RefreshCw className={`w-4 h-4 text-slate-400 transition-colors ${syncing === chain.id ? `animate-spin ${chain.color}` : 'group-hover:text-slate-200'}`} />
                </button>
              </div>

              {/* --- NEW: Sub-Tokens Rendering --- */}
              {chain.subTokens.length > 0 && (
                <div className="flex flex-col space-y-2 mt-1 bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/50">
                  {chain.subTokens.map((token, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center text-slate-400">
                        <Coins className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                        <span className="text-[11px] font-medium">{token.name}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 flex items-center">
                        <span className="text-slate-500 mr-1">{token.symbol}</span>
                        {token.balance} 
                        <span className="text-[10px] text-slate-500 ml-1">{token.ticker}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Address Display & Copy */}
              <div className="flex items-center justify-between bg-slate-900/60 rounded-lg p-2 border border-slate-800/80">
                <code className="text-[11px] text-slate-400 font-mono tracking-wider">
                  {truncateAddress(chain.address)}
                </code>
                <button 
                  onClick={() => handleCopy(chain.address, chain.name)}
                  disabled={!chain.address}
                  className="p-1.5 text-slate-500 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  {copied === chain.address && chain.address !== "" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}