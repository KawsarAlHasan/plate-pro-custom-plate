import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <>
      <main>
        {/* ====signin wrappr===== */}
        <section className='w-full h-[calc(100vh-90px)] flex justify-center items-center'>
            <div className='w-full max-w-[480px] shadow-inner py-12 px-8'>
                <Image 
                src="/headerLogo.png"
                alt='volarplaat'
                width={220}
                height={35}
                className='mx-auto'
                 />
                 <h1 className='mt-8 text-center text-3xl'>Login to Account</h1>
                 <p className='mt-2 mb-8 text-center'>Please enter your email and password to continue</p>
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
                    <div className='flex flex-col gap-1'>
                        <label className=''>
                            Password
                        </label>
                        <input 
                        type='password'
                        name=''
                        id=''
                        placeholder='*************'
                        className='border'
                         />
                    </div>
                    <div className='flex justify-between'>
                        <p>
                            <input 
                            type='checkbox'
                            name=''
                            id=''
                            className=''
                             />
                             <label>Remember Password</label>
                        </p>
                        <Link
                        href="/auth/forgotpassword"
                        className=""
                        >
                            Forgot password
                        </Link>
                    </div>
                    <div>
                        <button
                        className='w-full bg-red-700 py-3'
                        >
                            Sign In
                        </button>
                    </div>
                 </form>
            </div>
        </section>
      </main>
    </>
  )
}
