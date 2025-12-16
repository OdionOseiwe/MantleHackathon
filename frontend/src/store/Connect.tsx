// store/useWalletStore.ts
import { create } from 'zustand';
import { ethers } from 'ethers';
import { CHAIN_ID_HEX, CHAIN_ID_DEC } from '../constants/Network';

interface WalletState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  walletAddress: string | null;
  chainId: number | null;
  status: string;

  ensureCorrectMantleNetwork: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  provider: null,
  signer: null,
  walletAddress: null,
  chainId: null,
  status: 'Disconnected',

  ensureCorrectMantleNetwork: async () => {
    const { ethereum } = window;
    if (!ethereum) throw new Error('No Ethereum provider');

    const currentChainIdHex = await ethereum.request({
      method: 'eth_chainId',
    });

    const currentChainIdDec = parseInt(currentChainIdHex, 16);
    set({ chainId: currentChainIdDec });

    if (currentChainIdHex === CHAIN_ID_HEX) return;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN_ID_HEX,
              chainName: 'Mantle Sepolia',
              nativeCurrency: {
                name: 'Mantle',
                symbol: 'MNT',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
              blockExplorerUrls: ['https://sepolia.mantlescan.xyz'],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  },

  connectWallet: async () => {
    const { ethereum } = window;
    if (!ethereum) {
      set({ status: 'Please install MetaMask' });
      return;
    }

    try {
      set({ status: 'Connecting...' });

      await get().ensureCorrectMantleNetwork();

      await ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      set({
        provider,
        signer,
        walletAddress: address,
        status: 'Connected',
      });
    } catch (error) {
      console.error(error);
      set({ status: 'Connection failed' });
    }
  },
  disconnectWallet: () => {
  set({
    provider: null,
    signer: null,
    walletAddress: null,
    chainId: null,
    status: 'Disconnected',
  });
}
}));
