import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';

const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

export const deriveSolanaWallet = (seedHex: string) => {
  // Solana uses a different derivation path standard than EVM
  const path = "m/44'/501'/0'/0'";
  const derivedSeed = derivePath(path, seedHex).key;
  const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
  
  return new PublicKey(keypair.publicKey).toBase58();
};

export const fetchSolanaBalance = async (address: string) => {
  try {
    const connection = new Connection(SOLANA_RPC);
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    return (balance / LAMPORTS_PER_SOL).toFixed(4);
  } catch (error) {
    console.error("Solana RPC failed:", error);
    return "0.0000";
  }
};