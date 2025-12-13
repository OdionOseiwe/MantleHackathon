import Navbar from "../../components/Navbar"

export default function Hero() {
  return (
    <div className="bg-linear-to-r from-[#0C1220] to-[#0F1625] md:h-screen md:px-15 py-5">
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
          <button className="
            md:px-8 px-4 py-3 text-lg rounded-xl font-medium 
            bg-[#3B82F6] text-black 
            hover:bg-blue-400 transition
          ">
            Create Stream
          </button>

          <button className="
            md:px-8 px-4 py-3 text-lg rounded-xl font-medium 
            border border-[#3B82F6] text-white 
            hover:bg-[#3B82F6] hover:text-black transition
          ">
            Withdraw Stream
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Powered by Mantle • Gas-optimized streaming protocol
        </p>
      </div>
    </section>
      <div className="flex md:hidden justify-center pt-5 space-x-7 text-[#ffffff] font-light">
          <button className="hover:text-[#3B82F6] transition">HOME</button>
          <button className="hover:text-[#3B82F6] transition">STREAM</button>
          <button className="hover:text-[#3B82F6] transition">WITHDRAW</button>
          <button className="hover:text-[#3B82F6] transition">HISTORY</button>
        </div>
    </div>
  )
}
