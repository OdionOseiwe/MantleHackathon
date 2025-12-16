import { useWalletStore } from "../store/Connect";
import { X } from "lucide-react";
function WalletDetails({setShowWallets}:{setShowWallets:()=> void}) {
  const {walletAddress} = useWalletStore();
  return (
    <div className="absolute top-20 md:right-25 right-5 bg-[#112347]/90 text-white/50  z-20 max-w-3xl p-4 rounded-xl ">
      <div className="bg-[radial-gradient(circle_at_center,#112347,#0F1625,#0C1220)] p-8 rounded-xl border border-white/10
                      transform transition duration-200 hover:-translate-y-0.5  ">
        <div className="flex justify-between">
            <h1 className="font-bold text-white/70 mb-5 text-xl">WALLET STATUS</h1>
            <div className="cursor-pointer" onClick={setShowWallets}>
                <X />
            </div>
        </div>
        <p className="font-light mb-3">ADDRESS: {' '}
            <span className="text-white/70 font-semibold">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
        </p>
        <p className="font-light mb-3">NETWORK: {' '}<span className="text-white/70 font-semibold"> MANTLE SEPOLIA</span></p>
        <p className="font-light">USDT BALANCE: {' '}<span className="text-white/70 font-semibold">{0}</span></p>

      </div>
        <button className="
            text-[#ffffff] w-full mt-8
            md:px-8 px-4 py-3 text-lg rounded-xl font-medium 
            bg-[#3B82F6] 
            transform transition duration-200 hover:-translate-y-0.5 
          ">
            GET 100 USDT
        </button>
    </div>
  )
}

export default WalletDetails
