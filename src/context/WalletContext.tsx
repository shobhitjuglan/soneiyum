import { createContext, useContext, useState, type ReactNode } from 'react';
import { createSecureVault } from '../lib/crypto';
import { deriveSoneiumWallet } from '../lib/soneium';
import { deriveSolanaWallet } from '../lib/solana';

interface WalletState {
  isLocked: boolean;
  isGenerated: boolean;
  mnemonic: string[];
  seedHex: string; // <-- pass to our deriving functions
  soneiumAddress: string; // <-- hold the derived address
  solanaAddress: string; // <-- hold the derived address
  logs: string[];
  unlockWallet: () => void;
  generateVault: () => void;
  addLog: (msg: string) => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isGenerated, setIsGenerated] = useState(false);
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [seedHex, setSeedHex] = useState("");
  const [soneiumAddress, setSoneiumAddress] = useState("");
  const [solanaAddress, setSolanaAddress] = useState("");
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Shinrai OS booted."]);

  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  const generateVault = () => {
    addLog("[SECURITY] Generating 128-bit entropy via OS-level RNG...");
    
    setTimeout(() => {
      try {
        const vault = createSecureVault();
        setMnemonic(vault.mnemonic);
        setSeedHex(vault.seedHex);
        
        // Derive the Soneium Address right after generating the seed
        const soneiumWallet = deriveSoneiumWallet(vault.seedHex);
        setSoneiumAddress(soneiumWallet.address);

        const solWallet = deriveSolanaWallet(vault.seedHex);
        setSolanaAddress(solWallet);

        setIsGenerated(true);
        setIsLocked(false);
        addLog("[SUCCESS] BIP-39 Mnemonic generated.");
        addLog(`[SYSTEM] Soneium path m/44'/60'/0'/0/0 derived.`);
      } catch (error) {
        addLog("[ERROR] Failed to synthesize entropy.");
        console.error(error);
      }
    }, 800);
  };

  const unlockWallet = () => setIsLocked(false);

  return (
    <WalletContext.Provider value={{ isLocked, isGenerated, mnemonic, seedHex, soneiumAddress, solanaAddress, logs, unlockWallet, generateVault, addLog }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};