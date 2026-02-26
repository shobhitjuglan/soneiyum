import { WalletProvider } from './context/WalletContext';
import AnimatedVault from './components/wallet/AnimatedVault';
import { Activity } from 'lucide-react';
import './index.css';
import MultiChainDashboard from './components/wallet/MultiChainDashboard';
import SystemTerminal from './components/wallet/SystemTerminal';

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 flex justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md flex flex-col space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Shinrai</h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Institutional v2.0
          </div>
        </header>

        {/* Main Vault Component */}
        <AnimatedVault />

        {/* Multi chain dashboard */}
        <MultiChainDashboard />
        
        {/* <div className="h-32 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-600 text-sm">
          [ Live System Terminal Component ]
        </div> */}
        <SystemTerminal />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}