import Navbar from "../../components/Navbar";

function Stream() {
  return (
    <div className="min-h-screen bg-radial-[at_50%_50%] to-[#0C1220]  via-[#0F1625] from-[#112347] to-80% px-2 md:px-16 py-6">
      <Navbar />

      <section className="max-w-5/6 mx-auto">
        <div className="mt-12 bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3B82F6]">
            MantleStream
          </h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            Real-time money streaming on Mantle. Create programmable flows of
            USDT per second with a single transaction.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="transform transition duration-500 hover:-translate-y-1 mt-10 mx-auto bg-white/5 backdrop-blur-lg md:p-10 p-5 rounded-3xl border border-white/10">
          <div className="flex">
            <button className="border bg-[#3B82F6] shadow-2xl md:text-xl text-sm text-white/50 md:py-3 py-2 md:px-6 px-4  border-white/10 rounded-l-full">
                SINGLE STREAM
            </button>
            <button className="border shadow-2xl md:text-xl text-sm text-white/50 md:py-3 py-2 md:px-6 px-4  border-white/10 rounded-r-full">
                MULTIPLE STREAM
            </button>
          </div>

            <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="col-span-2">
                <label className="text-sm text-white/70">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm text-white/70">
                  Total Amount (USDT)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="">
                <label className="text-sm text-white/70">
                  Duration
                </label>
                <div className="flex mt-2 space-x-2">
                  <input
                    type="number"
                    placeholder="30"
                    className="w-2/3 rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                  <select
                    className="w-1/3 rounded-xl bg-[#1D2637] border border-white/10 px-3 py-3 text-white focus:outline-none"
                  >
                    <option>Hours</option>
                    <option>Days</option>
                    <option>Months</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-white/10">
                <p className="text-sm text-white/70">
                  Estimated Stream Rate
                </p>
                <p className="text-2xl font-semibold text-white mt-2">
                  ~ 0.0038 USDT / second
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Rate updates dynamically based on amount & duration
                </p>
              </div>

              <div className="col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition"
                >
                  Create Stream
                </button>
              </div>

            </form>
          </div>

          <div className="mt-10 h-fit ">
            <h1 className="text-3xl pb-6 text-center font-bold text-[#3B82F6]">
              STREAM PREVIEW
            </h1>
            <div className=" transform transition duration-500 hover:-translate-y-1  text-white/70 bg-white/5 text-center backdrop-blur-lg p-10 rounded-3xl border border-white/10">
              <p className="text-xl pb-2 font-medium">MONEY STREAM</p>
              <p className="text-2xl pb-2 font-bold text-[#3B82F6]">$ <span>0</span> USDT</p>
              <p className="pb-2"> <span className="font-bold">TO: </span>{' '}<span className="font-extralight">0x1234...abcd</span></p>
              <p><span className="font-bold">DURATION:</span> <span>2</span> <span>days</span></p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default Stream;
