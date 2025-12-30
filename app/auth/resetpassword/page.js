// reset password 
'use client'

import Image from 'next/image'
import React, { useState } from 'react'


export default function page() {
    const [success , setSuccess] = useState(false);
    const handleReset = (e) => {
        setSuccess(true);
    }
    const handleSignin = () => {
        setSuccess(false);
    }

    return (
        <main className='w-full h-full relative'>
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
                    <h1 className='mt-8 text-center text-3xl'>Set a new password</h1>
                    <p className='mt-2 mb-8 text-center'>Create a new password. Ensure it differs from previous ones for security</p>
                    <form className='flex flex-col gap-5'>
                        <div className='w-full  flex flex-col gap-1'>
                            <label
                                className=''
                            >
                                New Password
                            </label>
                            <input
                                type='password'
                                name=''
                                id=''
                                placeholder='*************'
                                className=''
                            />
                        </div>
                        <div className='w-full  flex flex-col gap-1'>
                            <label
                                className=''
                            >
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                name=''
                                id=''
                                placeholder='*************'
                                className=''
                            />
                        </div>
                        <div>
                            <button
                            onClick={handleReset}
                                className='w-full bg-red-500 py-3 text-white'
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            {/* =======successfull===== */}
            {
                success && 
                <div className='w-full h-screen absolute top-0 left-0 bg-[#d1cece]'>
                    {/* ===wrapper=== */}
                    <div className='w-full h-full flex justify-center items-center'>
                        {/* ----cuccessfull---- */}
                        <div className='w-full max-w-[480px] h-fit px-5 py-8 shadow-inner'>
                            <Image
                            src="/headerLogo.png"
                            alt='volarplaat'
                            width={220}
                            height={35}
                            className='mx-auto'
                        />
                        <h2 className='text-3xl text-center font-semibold mt-8 mb-4'>Password Updated Successfully!</h2>
                        <p className='text-center mb-4'>Your new password has been saved. You can now continue securely.</p>
                        <button 
                        onClick={handleSignin}
                        className='w-full py-2 rounded-md bg-red-500 text-white'
                        >
                            Sign in
                        </button>
                        </div>
                    </div>
                </div>
                
            }
        </main>
    )
}
