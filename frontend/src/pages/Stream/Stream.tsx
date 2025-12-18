import Navbar from "../../components/Navbar";
import { useState, type FormEvent } from "react";
import { Trash2, Dot } from 'lucide-react';
import { motion} from 'framer-motion'
import {useWalletStore} from '../../store/Connect'
import { NavLink } from 'react-router-dom';

function Stream() {
  const { walletAddress, status, createStream,createMultipleStream} = useWalletStore();
  const isConnected = Boolean(walletAddress);


  const [stream, setStream] = useState("single");
  const [amountEth, setAmountEth] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('');
  const [UintOfTime, setUintOfTime] = useState('')
  const [singleBatchRecipient, setSingleBatchRecipient] = useState('');

  const [recipients, setRecipients] = useState([
    { address: "", percentage: 0 },
  ]);

  const addRecipient = () => {
    setRecipients([...recipients, { address: "", percentage: 0 }]);
  };

  const removeRecipient = (index:number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index:any, field:any, value:any) => {
    const updated = [...recipients];
    updated[index][field] = value; // because the fields "address", "percentage" are not static else 
    // [...recipients][index].address is will only work for address and not percentage
    // example
    // [...recipients][1]["address"] = "0x...cd"
    setRecipients(updated);
  };

  const handleOptionChange = (event) => {
    setUintOfTime(event.target.value);
    console.log('Selected Value:', event.target.value);
  };

  const toSeconds = (value: number, unit: string) => {
    if (unit === "Hours") return value * 3600;
    if (unit === "Days") return value * 86400;
    if (unit === "Months") return value * 30 * 86400;
    return value;
  };

    const handleCreateStream = async (e:FormEvent) => {
      e.preventDefault();
      try {
        if (!isConnected) {
          alert("Connect wallet first");
          return;
        }
        const durationInSeconds = toSeconds(Number(duration),UintOfTime);
        await createStream(singleBatchRecipient, amountEth, durationInSeconds,message);
        setSingleBatchRecipient('');
        setAmountEth('');
        setUintOfTime('');
        setDuration('');
        setMessage('')

      } catch (error) {
        console.log(error);
      }
    }

    const handleBatchStream = async(e:FormEvent) =>{
      e.preventDefault();
      try {
        if (!isConnected) {
          alert("Connect wallet first");
          return;
        }
        const durationInSeconds = toSeconds(Number(duration),UintOfTime);
        const addresses = recipients.map(r => r.address);
        const percentages = recipients.map(r => r.percentage);

        await createMultipleStream(addresses, durationInSeconds,amountEth,percentages,message);
      }catch(error){
        console.log(error);
      }
    }

  return (
    <motion.div 
    initial={{opacity:0, y: 50}} animate={{opacity:1, y:0, transition: { duration: 1 }}}
    className="min-h-screen bg-radial-[at_50%_50%] to-[#0C1220]  via-[#0F1625] from-[#112347] to-80% px-2 md:px-16 py-3">
      <Navbar />

      <section className="md:max-w-5/6 mb-10 mx-auto">
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
          <div className="flex mt-2 mx-auto w-fit">
            <button  onClick={()=> setStream("single")} className={` ${stream === "single" ? 'bg-[#3B82F6]' : '' }  border  shadow-2xl  text-white/50 md:py-3 py-2 md:px-6 px-4  border-white/10 rounded-l-full`}>
                SINGLE STREAM
            </button>
            <button onClick={()=> setStream("batch")}  className={` ${stream === "batch" ? 'bg-[#3B82F6]' : '' }  border  shadow-2xl  text-white/50 md:py-3 py-2 md:px-6 px-4  border-white/10 rounded-r-full`}>
                MULTIPLE STREAM
            </button>
          </div>
          {
            stream === "single" ? 
            <motion.form 
              onSubmit={handleCreateStream}
                initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1}}}
            className = "mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             
              <div className="col-span-2">
                <label className="text-sm text-white/70">
                  Recipient Address
                </label>
                <input
                  value={singleBatchRecipient}
                  onChange={(e)=>setSingleBatchRecipient(e.target.value)}
                  type="text"
                  placeholder="0x..."
                  required
                  className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
                <div className=" col-span-2">
                  <label className="text-sm text-white/70">
                    message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="SALARY FOR 2026"
                    maxLength={100}
                    required
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm text-white/70">
                  Total Amount (USDT)
                </label>
                <input
                  value={amountEth}
                  onChange={(e)=>setAmountEth(e.target.value)}
                  type="number"
                  placeholder="1000"
                  required
                  className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div className="">
                <label className="text-sm text-white/70">
                  Duration
                </label>
                <div className="flex mt-2 space-x-2">
                  <input
                    value={duration}
                    onChange={(e)=>setDuration(e.target.value)}
                    type="number"
                    placeholder="30"
                    required
                    className="w-2/3 rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                  <select
                    value={UintOfTime} onChange={handleOptionChange} required
                    className="w-1/3 rounded-xl bg-[#1D2637] border border-white/10 px-3 py-3 text-white focus:outline-none"
                  >
                    <option disabled value="">Uint of Time</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
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

              <div className="col-span-2 ">
                <button
                  type="submit"
                  className={`
                    ${!isConnected ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                    w-full cursor-pointer px-8 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                >
                  Create Stream
                </button>
              </div>

            </motion.form>:
            <motion.form
            className=""
                onSubmit={handleBatchStream}
                initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1}}}
             >
                <div className="my-4">
                  <label className="text-sm text-white/70">
                    Total Amount (USDT)
                  </label>
                  <input
                    value={amountEth}
                    onChange={(e)=>setAmountEth(e.target.value)}
                    type="number"
                    placeholder="1000"
                    required
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="my-4">
                  <label className="text-sm text-white/70">
                    message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="SALARY FOR 2026"
                    maxLength={100}
                    required
                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  />
                </div>

                <div className="">
                  <label className="text-sm text-white/70">
                    Duration
                  </label>
                  <div className="flex mt-2 space-x-2">
                    <input
                      value={duration}
                      onChange={(e)=>setDuration(e.target.value)}
                      type="number"
                      placeholder="30"
                      required
                      className="w-2/3 rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    />
                    <select
                      value={UintOfTime} onChange={handleOptionChange} required
                      className="w-1/3 rounded-xl bg-[#1D2637] border border-white/10 px-3 py-3 text-white focus:outline-none"
                    >
                      <option disabled value="">Unit of Time</option>
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>
                </div>
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl border-white/10 shadow-2xl p-6 my-6"
                  >
                    <div>
                      <label className="text-sm text-white/70">
                        Recipient Address
                      </label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={recipient.address}
                        onChange={(e) =>
                          updateRecipient(index, "address", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-sm text-white/70">
                        Percentage
                      </label>
                      <input
                        type="number"
                        placeholder="50"
                        value={recipient.percentage}
                        onChange={(e) =>
                          updateRecipient(index, "percentage", e.target.value)
                        }
                        className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                      />
                    </div>

                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecipient(index)}
                        className="mt-4 text-sm text-red-400 hover:text-red-300"
                      >
                        <Trash2/>
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="px-6 py-3 rounded-full bg-[#3B82F6] text-white/70 font-medium hover:bg-blue-400 transition"
                  >
                    + ADD RECIPIENT
                  </button>
                </div>

                <div className="col-span-2 bg-black/30 my-4 rounded-2xl p-6 border border-white/10">
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

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`
                       ${!isConnected ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                      w-full cursor-pointer px-8 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                  >
                    Create Stream
                  </button>
                </div>
            </motion.form>
          }
            
          </div>

          <div className="mt-10 h-fit ">
            <h1 className="text-3xl pb-6 text-center font-bold text-[#3B82F6]">
              STREAM PREVIEW
            </h1>
            <div className=" transform transition duration-500 hover:-translate-y-1  text-white/70 bg-white/5 text-center backdrop-blur-lg p-10 rounded-3xl border border-white/10">
              <p className="text-xl pb-2 font-medium">MONEY STREAM</p>
              <p className="text-2xl pb-2 font-bold text-[#3B82F6]">$ <span>{amountEth}</span> USDT</p>
              <p className="pb-2"> 
                <span className="font-bold">TO: 
                </span>{' '}
                <span className="font-extralight">
                  { stream === "single" ? 
                    `${singleBatchRecipient.slice(0,6)}...${singleBatchRecipient.slice(-4)}`
                    : recipients.map(recipient => 
                      `${recipient.address.slice(0,6)}...${recipient.address.slice(-4)}` 
                    ).join(', ')
                  }
                </span>
              </p>
              <p><span className="font-bold">DURATION:</span> <span>{duration}</span> <span>{UintOfTime}</span></p>
            </div>
          </div>
          
        </div>
        <div className="flex items-center  text-xl fixed bottom-10 left-1/2 -translate-x-1/2 md:w-3/6 w-full rounded-full bg-[#1D2637] border border-white/10 text-white">
         <Dot color="green" size={50}/> {status}
        </div>
      </section>
      
      <div className="flex fixed bottom-0 left-0 right-0 z-50 bg-linear-to-r from-[#0C1220] to-[#0F1625] py-4 md:hidden justify-center  space-x-7 text-[#ffffff] font-light">
          <NavLink to="/" style={({ isActive })=>({
            color: isActive ? "#3B82F6 " : '',})}  className={` hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Home</span></NavLink>
          <NavLink to="/stream"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>Stream</span></NavLink>
          <NavLink to="/withdraw"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}>  <span>Withdraw</span> </NavLink>
          <NavLink to="/history"  style={({ isActive })=>({color: isActive ? "#3B82F6" : ''})}  className={`hover:text-[#3B82F6] cursor-pointer transition flex `}> <span>History</span></NavLink>
      </div>
    </motion.div>
  );
}

export default Stream;
