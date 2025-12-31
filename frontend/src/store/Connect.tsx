import { create } from "zustand";
import { ethers } from "ethers";
import { CHAIN_ID_HEX } from "../constants/Network";
import StreamABI from "../constants/MantleStream.json"
import MockUSDT from '../constants/MockUSDT.json'
import {Mantle_stream_address, Mock_USDT_address  } from "../constants/Address";

interface WalletState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  walletAddress: string | null;
  chainId: number | null;
  status: string;
  isProcessing: boolean;
  streamsBySender:[],
  streamsByRecipient:[],
  arrayOfStreamsForSender:any,
  stream:any,
  transferringUSDT:boolean,

  setStatus: (s: string) => void;

  ensureCorrectMantleNetwork: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  getStreamsBySender: (address:string| null) => Promise<void>;
  getUSDT: () => Promise<void>;
  getStreamsByRecipient:(address:string| null) => Promise<void>;
  getArrayOfStreamsBySender: (address:number| null) => Promise<void>;
  cancelStream: (streamId:number) => Promise<void>;
  withdrawStream: (streamId:number, amountEth:string) => Promise<void>;
  redirectStream: (streamId:number, newRecipient:string) => Promise<void>;
  transferFromStream: (streamId:number, amountEth:string, recipient:string) => Promise<void>;
  streams: (id:number) => Promise<void>;
  getClaimableBalance: (streamId:number) => Promise<string>;

  createStream: (
    recipient: string,
    amountEth: string,
    durationSeconds: number,
    message:string,
  ) => Promise<void>;

  createMultipleStream:(
    recipients: string[],
    durationSeconds: number,
    amountEth: string,
    percentages: number[],
    message:string,
  )=> Promise<void>;
}

export const useWalletStore =  create<WalletState> ((set, get) => ({
  provider: null,
  signer: null,
  walletAddress: null,
  chainId: null,
  status: "Disconnected",
  isProcessing: false,
  streamsBySender:[],
  streamsByRecipient:[],
  stream:null,
  arrayOfStreamsForSender:null,
  transferringUSDT:false,

  setStatus: (status) => set({ status }),

  ensureCorrectMantleNetwork: async () => {
    //@ts-ignore
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
    //@ts-ignore
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
      throw err;
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
    message,
  ) => {
    const {
      provider,
      signer,
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

      // always convert to the right decimals for a token
      const totalAmountWei = ethers.parseUnits(amountEth, 6);
      const duration = parseInt(String(durationSeconds), 10);

      if (totalAmountWei <= 0 || duration <= 0) {
        setStatus("Enter valid amount and duration.");
        return;
      }

      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      // ----- approving Mock USDT -----
      set({status: "Approving USDT..." });
      
      // always approve the right decimals for a token 
      const usdt = new ethers.Contract(Mock_USDT_address, MockUSDT, signer);
      const approveTx = await usdt.approve(
        Mantle_stream_address,
        totalAmountWei
      );
      await approveTx.wait();

      set({status: "Creating stream..." });

      // ---- creating stream -----
      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      const tx = await contract.createStream(recipient, duration,totalAmountWei,message);

      await tx.wait();

      setStatus("Stream created successfully");
    } catch (error: any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  createMultipleStream: async(
    recipients,
    durationSeconds,
    amountEth,
    percentages,
    message,
  ) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      for (let i = 0; i < recipients.length; i++) {
        if (!ethers.isAddress(recipients[i])) {
          setStatus("Invalid recipient address.");
          return;
        }
      }

      const basicPoints = []
      let totalBP = 0
      for (let i = 0; i < percentages.length; i++) {
        if (percentages[i] <= 0) {
          setStatus("Invalid percentage.");
          return;
        }
        basicPoints.push(percentages[i] * 100);
        totalBP += percentages[i] * 100;
      }

      if (totalBP !== 10000) {
        setStatus("Percentages must sum to 100%");
        return;
      }
            
      // always convert to the right decimals for a token
      const totalAmountWei = ethers.parseUnits(amountEth, 6);
      const duration = parseInt(String(durationSeconds), 10);

      if (totalAmountWei <= 0 || duration <= 0) {
        setStatus("Enter valid amount and duration.");
        return;
      }

      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }
    
      // ----- approving Mock USDT -----
      set({ status: "Approving USDT..." });

      // always approve the right decimals for a token 
      const usdt = new ethers.Contract(Mock_USDT_address, MockUSDT, signer);
      const approveTx = await usdt.approve(
        Mantle_stream_address,
        totalAmountWei
      );
      await approveTx.wait();

      // ---- creating stream ----
      set({ status: "Creating stream..." });

      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      const tx = await contract.createMultipleStreams(recipients, durationSeconds,amountEth, basicPoints,message);

      await tx.wait();

      setStatus("Stream created successfully");

    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  getStreamsBySender: async(address) =>{
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      const read = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      set({isProcessing:true});
      const streamsBySender = await read.getStreamsBySender(address);
      set({streamsBySender:streamsBySender, isProcessing:false});
    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  getStreamsByRecipient: async(address) =>{
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      const read = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );
      set({isProcessing:true});
      
      const streamsByRecipient = await read.getStreamsByRecipient(address);
      set({streamsByRecipient:streamsByRecipient,isProcessing:false});

    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  streams:  async(id) =>{
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      const read = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );
      set({isProcessing:true});
      
      const stream = await read.streams(id);
      set({stream:stream,isProcessing:false});

      return stream;

    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  getArrayOfStreamsBySender: async (streamId) =>{
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      const read = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      set({isProcessing:true});
      const streamsArray = await read.getStreamArrays(streamId);
      set({isProcessing:false, arrayOfStreamsForSender:streamsArray});
      return streamsArray;
    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  cancelStream: async (streamId:number) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }
      
      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );
      set({ status: "Cancelling stream..." });

      const tx = await contract.cancelStream(streamId);

      await tx.wait();

      setStatus("Stream cancelled successfully");
    } catch (error: any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },

  withdrawStream: async (streamId:number, amountEth:string) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }
      
      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      const amountWei = ethers.parseUnits(amountEth, 6);

      set({ status: "Withdrawing from stream..." });

      const tx = await contract.withdrawFromStream(streamId, amountWei);

      await tx.wait();

      setStatus("Withdrawal successful");
    } catch (error: any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },

  redirectStream: async (streamId:number, newRecipient:string) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }
      
      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      set({ status: "Redirecting stream..." });

      const tx = await contract.redirectClaimsRecipient(streamId, newRecipient);

      await tx.wait();

      setStatus("Stream redirected successfully");
    } catch (error: any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },

  transferFromStream: async (streamId:number, amountEth:string,  recipient:string) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }
      
      const contract = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      set({ status: "Transferring..." });
      const amountWei = ethers.parseUnits(amountEth, 6);

      const tx = await contract.transferClaimsToAddress(streamId, amountWei, recipient);

      await tx.wait();

      setStatus("amount transferred successfully");
    } catch (error: any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  getClaimableBalance: async (streamId:number) => {
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return "0";
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return "0";
      }

      const read = new ethers.Contract(
        Mantle_stream_address,
        StreamABI,
        signer
      );

      const claimableBalance = await read.getClaimableBalance(streamId);
      return claimableBalance; // BigInt to string with 6 decimals
    } catch (error:any) {
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  },

  getUSDT: async() =>{
    const {
      provider,
      signer,
      setStatus,
    } = get();

    if (!provider || !signer) {
      setStatus("Please connect your wallet.");
      return;
    }

    try {
      const code = await provider.getCode(Mantle_stream_address);
      if (!code || code === "0x") {
        setStatus("Contract not deployed on this network.");
        return;
      }

      set({transferringUSDT:true,status: "transferring USDT..." });
      
      const usdt = new ethers.Contract(Mock_USDT_address, MockUSDT, signer);
      const approveTx = await usdt.mint(
        signer.getAddress(),
        ethers.parseUnits("100", 6)
      );
      await approveTx.wait();

      set({status: "successfully USDT minted", transferringUSDT:false });
    } catch (error: any) {
      set({transferringUSDT:false});
      setStatus(
        error?.shortMessage || error?.message || "Transaction failed"
      );
      throw error;
    }
  }

}));
