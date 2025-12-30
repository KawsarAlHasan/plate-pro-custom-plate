import Image from 'next/image'
import React from 'react'

export default function page() {
  return (
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
                 <h1 className='mt-8 text-center text-3xl'>Forget Password?</h1>
                 <p className='mt-2 mb-8 text-center'>Please enter your email to get verification code</p>
                 <form className='flex flex-col gap-5'>
                    <div className='w-full  flex flex-col gap-1'>
                        <label
                        className=''
                        >
                            Email address
                        </label>
                        <input 
                        type='email'
                        name=''
                        id=''
                        placeholder='someone@exampale.mail'
                        className=''
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
            </div>
        </section>
      </main>
  )
}
