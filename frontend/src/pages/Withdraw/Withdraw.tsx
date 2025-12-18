import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { motion} from 'framer-motion'
import { NavLink } from "react-router-dom";
import {useWalletStore} from '../../store/Connect'
import { Dot } from "lucide-react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

//DO: loop through the ids for the sender or recipient and display them on the 
// cards for users to paste or put them directly in the input for the card 
//  withdrawal button for recipient and cancel for sender 
// loop through the array 
function Withdraw() {
  const [withdrawOptions, setWithdrawOptions] = useState({});
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);
  const [amountToWithdraw, setAmountToWithdraw] = useState<number | null>(null);
  const [newRecipient, setNewRecipient] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number | null>(null);
  const [transferRecipient, setTransferRecipient] = useState<string>('');
  const [arrayOfRecipientStreams, setArrayOfRecipientStreams] = useState<number[]>([]);
  const [arrayOfSenderStreams, setArrayOfSenderStreams] = useState<number[]>([]);

  const handleOptionChange = (streamId:number, option:string) => {
    setWithdrawOptions(prev => ({
      ...prev,
      [streamId]: option
    }));
  };

  const {
    isProcessing, 
    walletAddress, 
    status,
    getStreamsBySender,
    streamsByRecipient,
    getStreamsByRecipient, 
    streamsBySender,
    streams,
    stream,
  } = useWalletStore();

  const isConnected = Boolean(walletAddress);

  const populateRecipientAndSenderStreams = async() =>{
    
    if(streamsBySender.length > 0 ){
      for (const streamId of streamsBySender) {
        await streams(streamId);
        setArrayOfSenderStreams(prev => ([...prev, stream]));
      }
    }
  }

  useEffect(()=>{
    getStreamsBySender(walletAddress);
    getStreamsByRecipient(walletAddress);
    populateRecipientAndSenderStreams();
  },[walletAddress])

  
  return (
    <motion.div 
    initial={{opacity:0, y: 50}} animate={{opacity:1, y:0, transition: { duration: 1 }}}
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
              {streamsBySender.length + streamsByRecipient.length}
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
          <div className="transform transition duration-500 hover:-translate-y-1 grid md:grid-cols-2  gap-8 mt-10">
            {
              isProcessing ? (
                <>
                  <Skeleton height={150} className="rounded-3xl"/>
                  <Skeleton height={150} className="rounded-3xl"/>
                </>
              ) : (
                <>
                  {
                    streamsByRecipient.length === 0 && streamsBySender.length === 0 ? (
                      <p className="text-white/70 col-span-2 text-center">No active streams found.</p>
                    ) : (
                      <>
                        {
                          streamsByRecipient.map((incomingStream,index)=>{
                            return (
                              <div key={index} className="w-fit bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-3xl border border-white/10 text-white/70">
                                <p className="text-xl  mb-4  font-bold text-[#3B82F6]">Incoming Streams</p>
                                <div className="flex mb-6 mx-auto w-fit rounded-full overflow-hidden border border-white/10">
                                  <button
                                    onClick={() => handleOptionChange(incomingStream, "withdraw")}
                                    className={`${withdrawOptions[incomingStream] === "withdraw"
                                      ? "bg-[#3B82F6] text-black"
                                      : "text-white/60"} px-4 py-1 font-medium`}
                                  >
                                    WITHDRAW
                                  </button>                               

                                  <button
                                    onClick={() => handleOptionChange(incomingStream, "redirect")}
                                    className={`${withdrawOptions[incomingStream] === "redirect"
                                      ? "bg-[#3B82F6] text-black"
                                      : "text-white/60"} px-4 py-1 font-medium`}
                                  >
                                    REDIRECT
                                  </button>                               

                                  <button
                                    onClick={() => handleOptionChange(incomingStream, "transfer")}
                                    className={`${withdrawOptions[incomingStream] === "transfer"
                                      ? "bg-[#3B82F6] text-black"
                                      : "text-white/60"} px-4 py-1 font-medium`}
                                  >
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
                                <label className="text-sm text-white/70">
                                        stream ID
                                  </label>
                                  <input
                                    onChange={(e) => setSelectedStreamId(Number(e.target.value))}
                                    type="number"
                                    placeholder=""
                                    defaultValue={incomingStream}
                                    disabled
                                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                  />
                                 
                                <progress value={32} max={100} className="h-2 mt-8 rounded-2xl w-full"></progress>

                                <p className="text-xs mb-5 text-white/50">
                                  Ends in 4h 29m 40s
                                </p>
                                { withdrawOptions[incomingStream] === "withdraw" &&
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
                                { withdrawOptions[incomingStream] === "redirect" &&
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
                              }  { withdrawOptions[incomingStream] === "transfer" &&
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
                            )
                          })
                          
                        }
                              
                        {
                          streamsBySender.map((outgoingStream, index)=>{
                            return (
                              <div key={outgoingStream} className="bg-white/5 backdrop-blur-lg p-6 md:p-10 w-fit rounded-3xl border border-white/10 text-white/70">
                                    <p className="text-xl mb-4 font-bold text-[#3B82F6]">
                                    Outgoing Streams</p>
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
                                 
                                <progress value={32} max={100} className="h-2 mt-8 rounded-2xl w-full"></progress>

                                <p className="text-xs mb-5 text-white/50">
                                  Ends in 4h 29m 40s
                                </p>
                                  <motion.form 
                                  initial={{opacity:0}} animate={{opacity:1, transition: { duration: 1 }}}
                                  action="">
                                  <label className="text-sm text-white/70">
                                        stream ID
                                  </label>
                                  <input
                                    type="number"
                                    placeholder=""
                                    defaultValue={outgoingStream}
                                    disabled
                                    className="mt-2 w-full rounded-xl bg-[#1D2637] border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                  />
                                    <button
                                      className={`
                                         ${!walletAddress ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#3B82F6] text-black hover:bg-blue-400'}
                                        mt-8 w-full px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-medium text-lg hover:bg-blue-400 transition`}
                                    >
                                    Cancel Stream
                                    </button>
                                  </motion.form>
                                
                              </div> 
                            )
                          })
                          
                        }

                      </>
                    )
                  } 
                           
                </>             
              ) 
            }
        
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
