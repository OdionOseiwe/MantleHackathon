function Navbar() {
  return (
    <nav className="w-full border-b ">
      <div className="max-w-7xl mx-auto flex items-center justify-between md:px-6 px-3 py-4">

        <div className="text-3xl font-bold text-[#3B82F6]">
          MantleStream
        </div>

        <div className="hidden md:flex space-x-10 text-[#ffffff] font-light">
          <button className="hover:text-[#3B82F6] transition">HOME</button>
          <button className="hover:text-[#3B82F6] transition">STREAM</button>
          <button className="hover:text-[#3B82F6] transition">WITHDRAW</button>
          <button className="hover:text-[#3B82F6] transition">HISTORY</button>
        </div>

        <button
          className="
            text-[#ffffff] 
            border border-[#3B82F6] 
            px-4 py-2 rounded-xl 
            hover:bg-[#3B82F6] hover:text-black 
            transition font-medium text-lg
          "
        >
          Connect Wallet
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
