import { useState } from "react";
import Navbar from "../../components/Navbar";
import { motion} from 'framer-motion'
import { NavLink } from "react-router-dom";
import {useWalletStore} from '../../store/Connect'
import { Dot } from "lucide-react";

function Withdraw() {
  const [withdrawOptions, setWithdrawOptions] = useState("withdraw");

  const { walletAddress, status} = useWalletStore();
  const isConnected = Boolean(walletAddress);

  return (
    <motion.div 
    initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1.0 }}}
    className="min-h-screen bg-[radial-gradient(circle_at_center,#112347,#0F1625,#0C1220)] px-3 md:px-16 py-6">
      <Navbar />

      <section className="max-w-5xl mx-auto  mb-10 ">
        <div className="mt-12 bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6]">
            MantleStream
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            Real-time money streaming on Mantle. Withdraw accrued funds or manage
            your active streams seamlessly.
          </p>
        </div>

        <div className="flex justify-between gap-6 mt-12 bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl border border-white/10 text-center">
          <div>
            <p className="text-white font-semibold text-2xl md:text-3xl">
              22.50 ETH
            </p>
            <p className="text-white/50 text-sm">
              Total sent / received
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-2xl md:text-3xl">
              2
            </p>
            <p className="text-white/50 text-sm">
              Active Streams
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-2xl md:text-3xl">
              4.14 ETH
            </p>
            <p className="text-white/50 text-sm">
              Total claimable
            </p>
          </div>
        </div>

        <h2 className="text-center mt-12 text-3xl font-bold text-[#3B82F6]">
          Active Streams
        </h2>

        <div className="transform transition duration-500 hover:-translate-y-1 grid md:grid-cols-2  gap-8 mt-10">
          <div className="bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl border border-white/10 text-white/70">

            <div className="flex mb-6 mx-auto w-fit  rounded-full overflow-hidden border border-white/10">
              <button onClick={() => setWithdrawOptions("withdraw")} className={`${withdrawOptions === "withdraw"? "bg-[#3B82F6] text-black ": "text-white/60"} px-4 py-1   font-medium `}>
                WITHDRAW
              </button>
              <button onClick={() => setWithdrawOptions("redirect")} className={`${withdrawOptions === "redirect"? "bg-[#3B82F6] text-black ": "text-white/60"} px-4 py-1 border border-white/10 font-medium `}>
                REDIRECT
              </button>
              <button onClick={() => setWithdrawOptions("transfer")} className={`${withdrawOptions === "transfer"? "bg-[#3B82F6] text-black ": "text-white/60"} px-4 py-1  font-medium `}>
                TRANSFER
              </button>
            </div>

            <div className="flex justify-between mb-4 text-sm">
              <div>
                <p>
                  <span className="font-semibold">FROM:</span>{" "}
                  0x4fg...abxd
                </p>
                <p>
                  <span className="font-semibold">TO:</span>{" "}
                  0x4fg...cbbd
                </p>
              </div>
              <p className="font-semibold text-white">
                4.14 ETH
              </p>
            </div>

            {/* <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full w-3/4 bg-[#3B82F6]" />
            </div> */}
            <progress value={32} max={100} className="h-2 rounded-2xl w-100"></progress>

            <p className="text-xs mb-5 text-white/50">
              Ends in 4h 29m 40s
            </p>
            { withdrawOptions === "withdraw" &&
              <motion.form 
              initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1 }}}
              action="">
                <label className="text-sm text-white/70">
                    Total Amount (USDT)
                </label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />

                <button
                  className={`
                     ${!walletAddress ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                    mt-8 w-full px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                >
                  Withdraw Funds
                </button>
              </motion.form>
            }
              { withdrawOptions === "redirect" &&
              <motion.form 
                  initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1 }}}
              action="">
                <label className="text-sm text-white/70">
                    New Recipient
                </label>
                  <input
                    type="text"
                    placeholder="0xab...cd"
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />

                <button
                  className={`
                     ${!isConnected ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                    mt-8 w-full px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                >
                  Redirect
                </button>
              </motion.form>
            }  { withdrawOptions === "transfer" &&
              <motion.form 
              initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1}}}
              action="">
                <label className="text-sm text-white/70">
                    Total Amount (USDT)
                </label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                 
                <label className="text-sm text-white/70">
                    New Recipient
                </label>
                  <input
                    type="text"
                    placeholder="0xab...cd"
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                <button
                  className={`
                     ${!isConnected ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                    mt-8 w-full px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                >
                  Transfer
                </button>
              </motion.form>
            }
           
          </div>
        </div>
        <div className="flex items-center  text-xl fixed bottom-10 left-1/2 -translate-x-1/2 md:w-3/6 w-full rounded-full bg-[#1D2637] border border-white/10 text-white">
         <Dot color="green" size={50}/> {status}
        </div>
      </section>
       <div className="flex fixed bottom-0 left-0 right-0 z-50 bg-linear-to-r from-[#0C1220] to-[#0F1625] py-4 md:hidden justify-center space-x-7 text-[#ffffff] font-light">
<NavLink to="/" style={({ isActive })=>({
            color: isActive ? "#3B82F6 " : '',})}  className={` hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Home</span></NavLink>
          <NavLink to="/stream"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>Stream</span></NavLink>
          <NavLink to="/withdraw"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Withdraw</span> </NavLink>
          <NavLink to="/history"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>History</span></NavLink>
        </div>
    </motion.div>
  );
}

export default Withdraw;
