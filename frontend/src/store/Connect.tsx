import { create } from "zustand";
import { ethers } from "ethers";
import { CHAIN_ID_HEX } from "../constants/Network";
import StreamABI from "../App";

interface WalletState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  walletAddress: string | null;
  chainId: number | null;
  status: string;
  isProcessing: boolean;
  contractAddress: string;

  setStatus: (s: string) => void;

  ensureCorrectMantleNetwork: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  createStream: (
    recipient: string,
    amountEth: string,
    durationSeconds: string,
    resetForm?: () => void
  ) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  provider: null,
  signer: null,
  walletAddress: null,
  chainId: null,
  status: "Disconnected",
  isProcessing: false,
  contractAddress: "0xYOUR_CONTRACT_ADDRESS",

  setStatus: (status) => set({ status }),

  ensureCorrectMantleNetwork: async () => {
    const { ethereum } = window;
    if (!ethereum) throw new Error("No Ethereum provider");

    const currentChainIdHex = await ethereum.request({
      method: "eth_chainId",
    });

    const currentChainIdDec = parseInt(currentChainIdHex, 16);
    set({ chainId: currentChainIdDec });

    if (currentChainIdHex === CHAIN_ID_HEX) return;

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: CHAIN_ID_HEX,
              chainName: "Mantle Sepolia",
              nativeCurrency: {
                name: "Mantle",
                symbol: "MNT",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
              blockExplorerUrls: ["https://sepolia.mantlescan.xyz"],
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
      set({ status: "Please install MetaMask" });
      return;
    }

    try {
      set({ status: "Connecting..." });

      await get().ensureCorrectMantleNetwork();

      await ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      set({
        provider,
        signer,
        walletAddress: address,
        status: "Connected",
      });
    } catch (err) {
      console.error(err);
      set({ status: "Connection failed" });
    }
  },

  disconnectWallet: () => {
    set({
      provider: null,
      signer: null,
      walletAddress: null,
      chainId: null,
      status: "Disconnected",
    });
  },

  createStream: async (
    recipient,
    amountEth,
    durationSeconds,
    resetForm
  ) => {
    const {
      provider,
      signer,
      contractAddress,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      if (!ethers.isAddress(recipient)) {
        setStatus("Invalid recipient address.");
        return;
      }

      const totalAmountWei = ethers.parseEther(amountEth || "0");
      const duration = parseInt(durationSeconds, 10);

      if (totalAmountWei <= 0n || duration <= 0) {
        setStatus("Enter valid amount and duration.");
        return;
      }

      const code = await provider.getCode(contractAddress);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      set({ isProcessing: true, status: "Creating stream..." });

      const contract = new ethers.Contract(
        contractAddress,
        // StreamABI,
        signer
      );

      const tx = await contract.createStream(recipient, duration, {
        value: totalAmountWei,
      });

      await tx.wait();

      setStatus("Stream created successfully");
      resetForm?.();
    } catch (error: any) {
      console.error(error);
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
    } finally {
      set({ isProcessing: false });
    }
  },
}));
