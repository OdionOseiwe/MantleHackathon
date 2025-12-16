import Navbar from "../../components/Navbar"
import { motion} from 'framer-motion'
import { NavLink } from 'react-router-dom';


export default function Hero() {
  return (
    <motion.div 
    initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1 }}}
    className="bg-linear-to-r from-[#0C1220] to-[#0F1625] h-screen  md:px-15 py-3">
      <Navbar/>
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-6 bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_70%)]"></div>

      <div className="max-w-4xl mx-auto text-center z-10">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
          Stream <span style={{ color: '#3B82F6' }}>Money</span> <br />
          In Real Time
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          MantleStream lets you send & receive crypto <span className="text-[#3B82F6]">per-second</span>.
          No waiting. No batching. Just continuous on-chain money flow.
        </p>

        <div className="mt-10 flex justify-center space-x-6">
          <a href="/stream" className="
            md:px-8 px-4 py-3 text-lg rounded-xl font-medium 
            bg-[#3B82F6] text-black 
            hover:bg-blue-400 transition
          ">
            Create Stream
          </a>

          <a href="/withdraw" className="
            md:px-8 px-4 py-3 text-lg rounded-xl font-medium 
            border border-[#3B82F6] text-white 
            hover:bg-[#3B82F6] hover:text-black transition
          ">
            Withdraw Stream
          </a>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Powered by Mantle • Gas-optimized streaming protocol
        </p>
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
  )
}
