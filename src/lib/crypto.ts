import { generateMnemonic, mnemonicToSeedSync } from 'bip39';

export interface VaultState {
  mnemonic: string[];
  seedHex: string;
}

/**
 * Generates a completely new BIP-39 compliant mnemonic and derives its master seed.
 */
export const createSecureVault = (): VaultState => {
  // 1. Generate 128 bits of entropy (which equals 12 words)
  // If we wanted 24 words, we would use 256 bits.
  const rawMnemonic = generateMnemonic(128); 
  
  // 2. Convert the string into an array of words for our UI grid
  const mnemonicArray = rawMnemonic.split(' ');

  // 3. Convert the mnemonic into a Master Seed (Buffer)
  // We use Sync here because generating it async in the browser can sometimes 
  // cause UI state tearing if not handled perfectly.
  const seedBuffer = mnemonicToSeedSync(rawMnemonic);

  return {
    mnemonic: mnemonicArray,
    seedHex: seedBuffer.toString('hex')
  };
};