import { Podcast, Home,BanknoteArrowDown,History,ArrowRightFromLine,Wallet,ChevronDown } from 'lucide-react';
import { NavLink } from "react-router-dom";
import {useWalletStore} from '../store/Connect'
import WalletDetails from './WalletDetails';
import { useState } from 'react';

function Navbar() {
  const {connectWallet, walletAddress, disconnectWallet} = useWalletStore();
  const [showWalletDetails, setShowWallets] = useState(false)
  return (
    <nav className="w-full border-b ">
      <div className="max-w-7xl mx-auto flex items-center justify-between md:px-6 px-3 pb-6 pt-2">

        <div className="text-3xl font-bold text-[#3B82F6]">
          MantleStream
        </div>

        <div className="hidden md:flex space-x-14 text-[#ffffff] font-light">
          <NavLink to="/" style={({ isActive })=>({
            color: isActive ? "#3B82F6 " : '',})}  className={` hover:text-[#3B82F6] cursor-pointer transition flex space-x-2 `}> <Home/> <span>HOME</span></NavLink>
          <NavLink to="/stream"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex space-x-2 `}> <Podcast/> <span>STREAM</span></NavLink>
          <NavLink to="/withdraw"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex space-x-2 `}> <BanknoteArrowDown/>  <span>WITHDRAW</span> </NavLink>
          <NavLink to="/history"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex space-x-2 `}> <History/> <span>HISTORY</span></NavLink>
        </div>

        <button
          className="
            
          "
        >
          {walletAddress ? ( 
            <div className='text-white/70 flex cursor-pointer'>
              <div
                onClick={()=>setShowWallets(!showWalletDetails)}
                className="flex md:space-x-3 space-x-1.5 py-1 px-3 rounded-full items-center hover:bg-white/10"> 
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span> 
                <ChevronDown/> 
              </div>
              <div  
              onClick={disconnectWallet}
              className='md:py-3 py-2 md:ml-2  md:px-7 px-3 rounded-xl border border-[#3B82F6] hover:bg-[#3B82F6] 
              transition transform hover:scale-x-95 duration-150' >
                <ArrowRightFromLine size={20}/>
              </div>
            </div>
            ) : <button className="
            flex space-x-2
            items-center
            text-[#ffffff] 
            border border-[#3B82F6] 
            px-4 py-2 rounded-xl 
            hover:bg-[#3B82F6] hover:text-black 
            transition font-medium text-lg" 
            onClick={connectWallet}> <Wallet/> <span>Connect Wallet</span> </button>

            }
        </button>
        {showWalletDetails && <WalletDetails setShowWallets={() => setShowWallets(false)}/>}

      </div>
    </nav>
  );
}

export default Navbar;
