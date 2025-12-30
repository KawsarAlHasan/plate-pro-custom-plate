import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
    <div>
        <main>
                {/* ====Forget Password===== */}
                <section className='w-full h-screen flex justify-center items-center'>
                    <div className='w-full max-w-[480px] shadow-inner py-12 px-8'>
                        <Image 
                        src="/headerLogo.png"
                        alt='volarplaat'  
                        width={220}     
                        height={35}
                        className='mx-auto'
                         />
                         <h1 className='mt-8 text-center text-3xl'>Check your email</h1>
                         <p className='mt-2 mb-8 text-center'>We sent a code to your email address @. Please check your email for the 5 digit code.</p>
                         <form className='flex flex-col gap-5 mb-12'>
                            <div className='w-full  flex gap-1 justify-center'>
                                <input
                                type="text"
                                placeholder="*"
                                maxLength={1}
                                className="w-10 border-2 border-gray-300 rounded-md p-2 px-3"
                                />
                                <input
                                type="text"
                                placeholder="*"
                                maxLength={1}
                                className="w-10 border-2 border-gray-300 rounded-md p-2 px-3"
                                />
                                <input
                                type="text"
                                placeholder="*"
                                maxLength={1}
                                className="w-10 border-2 border-gray-300 rounded-md p-2 px-3"
                                />
                                <input
                                type="text"
                                placeholder="*"
                                maxLength={1}
                                className="w-10 border-2 border-gray-300 rounded-md p-2 px-3"
                                />
                                <input
                                type="text"
                                placeholder="*"
                                maxLength={1}
                                className="w-10 border-2 border-gray-300 rounded-md p-2 px-3"
                                />
                            </div>
                            <div>
                                <button
                                className='w-full bg-red-500 py-3 text-white'
                                >
                                    Continue
                                </button>
                            </div>
                         </form>
                         <p className='text-center'>You have not received the email?  <span className='text-red-500 ml-5'>Resend</span></p>
                    </div>
                </section>
              </main>
    </div>
  )
}
