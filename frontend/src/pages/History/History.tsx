import Navbar from "../../components/Navbar";
import { motion} from 'framer-motion'
import { NavLink } from 'react-router-dom';

function History() {
  return (
    <motion.div
    initial={{opacity:0, y: 50}} animate={{opacity:1, y:0, transition: { duration: 1 }}}
    className="min-h-screen bg-[radial-gradient(circle_at_center,#112347,#0F1625,#0C1220)] px-3 md:px-16 py-6">
      <Navbar />

      <section className="max-w-5xl  mb-10  mx-auto">
        <div className="mt-12 bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6]">
            Stream History
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            View all past streams, withdrawals, and completed payment flows on
            MantleStream.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="px-5 py-2 rounded-full bg-[#3B82F6] text-black text-sm font-medium">
            All
          </button>
          <button className="px-5 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition text-sm">
            Completed
          </button>
          <button className="px-5 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition text-sm">
            Withdrawals
          </button>
          <button className="px-5 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition text-sm">
            Cancelled
          </button>
        </div>

        <div className="mt-10 space-y-6">

          <div className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/10 text-white/70 hover:-translate-y-1 transition transform">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-white/50">
                Stream ID #1023
              </p>
              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                Completed
              </span>
            </div>

            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p>
                  <span className="font-semibold">FROM:</span>{" "}
                  0x4fg...abxd
                </p>
                <p>
                  <span className="font-semibold">TO:</span>{" "}
                  0x9da...98af
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  5.00 ETH
                </p>
                <p className="text-xs text-white/50">
                  Duration: 7 days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/10 text-white/70 hover:-translate-y-1 transition transform">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-white/50">
                Withdrawal
              </p>
              <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                Withdrawn
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p>
                  <span className="font-semibold">FROM STREAM:</span>{" "}
                  #1021
                </p>
                <p className="text-xs text-white/50">
                  0x9da...98af
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  1.42 ETH
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/10 text-white/70 hover:-translate-y-1 transition transform">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-white/50">
                Stream ID #1018
              </p>
              <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                Cancelled
              </span>
            </div>

            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p>
                  <span className="font-semibold">FROM:</span>{" "}
                  0x4fg...abxd
                </p>
                <p>
                  <span className="font-semibold">TO:</span>{" "}
                  0x7ac...21dd
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  0.80 ETH
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
      <div className="flex fixed bottom-0 left-0  right-0 z-50 bg-linear-to-r from-[#0C1220] to-[#0F1625] py-4 md:hidden justify-center  space-x-7 text-[#ffffff] font-light">
         <NavLink to="/" style={({ isActive })=>({
            color: isActive ? "#3B82F6 " : '',})}  className={` hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Home</span></NavLink>
          <NavLink to="/stream"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>Stream</span></NavLink>
          <NavLink to="/withdraw"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Withdraw</span> </NavLink>
          <NavLink to="/history"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>History</span></NavLink>
      </div>
    </motion.div>
  );
}

export default History;
