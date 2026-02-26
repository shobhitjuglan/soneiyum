import { ethers } from 'ethers';

// The official Soneium Mainnet RPC URL
const SONEIUM_RPC_URL = "https://rpc.soneium.org/";

export interface SoneiumWalletData {
  address: string;
  privateKey: string;
}

/**
 * Derives an EVM-compatible address from your master seed hex
 * using the standard Ethereum derivation path: m/44'/60'/0'/0/0
 */
export const deriveSoneiumWallet = (seedHex: string): SoneiumWalletData => {
  // Ethers v6 requires a 0x prefix for hex strings
  const formattedSeed = seedHex.startsWith('0x') ? seedHex : `0x${seedHex}`;
  
  // Create an HD Node from the master seed
  const hdNode = ethers.HDNodeWallet.fromSeed(formattedSeed);
  
  // Derive the first account (Account Index #0)
  const childNode = hdNode.derivePath("m/44'/60'/0'/0/0");

  return {
    address: childNode.address,
    privateKey: childNode.privateKey
  };
};

/**
 * Connects to the real Soneium Mainnet to fetch the live ETH balance.
 * Returns a formatted string (e.g., "0.0000").
 */
export const fetchSoneiumBalance = async (address: string): Promise<string> => {
  try {
    // 1. Initialize the read-only connection to the blockchain
    const provider = new ethers.JsonRpcProvider(SONEIUM_RPC_URL);
    
    // 2. Fetch the balance in Wei (the smallest unit of ETH)
    const balanceWei = await provider.getBalance(address);
    
    // 3. Convert Wei to standard ETH format
    const balanceEth = ethers.formatEther(balanceWei);
    
    // 4. Force exactly 4 decimal places so it looks professional (e.g., 0 -> 0.0000)
    return Number(balanceEth).toFixed(4);
  } catch (error) {
    console.error("RPC Connection failed:", error);
    return "0.0000"; // Fallback so the UI doesn't break
  }
};

// The standard ERC-20 ABI functions we need to read balances
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

/**
 * Connects to a specific ERC-20 smart contract (like JPYC) to fetch a user's balance.
 */
export const fetchERC20Balance = async (
  walletAddress: string, 
  contractAddress: string
): Promise<string> => {
  try {
    const provider = new ethers.JsonRpcProvider(SONEIUM_RPC_URL);
    
    // 1. Connect to the specific JPYC Smart Contract
    const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    
    // 2. Fetch the raw balance from the contract
    const rawBalance = await tokenContract.balanceOf(walletAddress);
    
    // 3. Fetch the decimals (Most ERC-20s have 18, but it's safest to ask the contract)
    const decimals = await tokenContract.decimals();
    
    // 4. Convert the massive raw number into a readable format
    return ethers.formatUnits(rawBalance, decimals);
  } catch (error) {
    console.error("ERC-20 fetch failed:", error);
    return "0.00";
  }
};