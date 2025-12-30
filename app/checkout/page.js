import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <>
            {/* &&&&&&&&&&&checkout main&&&&&&&&&& */}
            <main className='w-full'>
                {/* ########checkout wrapper######## */}
                <div className='w-full h-full'>
                    {/* ====checkout nevigator===== */}
                    <div className='w-full p-5'>
                        <span className='font-bold text-2xl'>&lt;</span> <span className='font-bold text-2xl'> CHECK OUT</span>
                    </div>
                    {/* ====checkout area====== */}
                    <div className='w-full h-full min-h-screen p-5 flex gap-8 '>
                        {/* ===transcetion details==== */}
                        <div className='w-1/2 h-full border border-gray-300 p-5'>
                            {/* $$$$$$$$$$$$ transection form $$$$$$$$$$$$$$$$ */}
                            <form className='flex flex-col gap-4'>
                                {/* --row _ name -- */}
                                <div className='w-full flex flex-col gap-3'>
                                    <label className='text-2xl font-medium'>Name</label>
                                    <input
                                        name='name'
                                        id='name'
                                        placeholder=''
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                </div>
                                {/* --row _ address -- */}
                                <div className='w-full flex flex-col gap-3'>
                                    <label className='text-2xl font-medium'>Addresss</label>
                                    <input
                                        name=''
                                        id=''
                                        placeholder=''
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                </div>
                                {/* --row _ phone number -- */}
                                <div className='w-full flex flex-col gap-3'>
                                    <label className='text-2xl font-medium'>Addresss</label>
                                    <input
                                        name=''
                                        id=''
                                        placeholder=''
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                </div>
                                {/* --row _ checkbox -- */}
                                <div>

                                    <input
                                        type='checkbox'
                                        name=''
                                        id=''
                                        className=''
                                    />
                                    <label>Please read our Terms & services before procrding</label>
                                </div>
                                {/* --row _ textarea additional description -- */}
                                <div>
                                    <label className='text-2xl font-medium'>Addresss</label>
                                    <textarea
                                        className='w-full h-44 border border-gray-300 rounded-md'
                                    />
                                </div>
                                {/* ------------ */}
                                <p>Select payment method</p>
                                <select className='w-full border border-gray-300 rounded-md px-3 py-1'>
                                    <option>Net Banking</option>
                                    <option>Paypal</option>
                                </select>
                                {/* ===row=== */}
                                <div className='py-4 flex gap-8'>
                                    <input
                                        type='text'
                                        placeholder='Card number'
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                    <input
                                        type='text'
                                        placeholder='Expiration'
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                    <input
                                        type='text'
                                        placeholder='CVV'
                                        className='w-full border border-gray-300 rounded-md px-3 py-1'
                                    />
                                </div>


                            </form>
                        </div>
                        {/* ====order details==== */}
                        <div className='w-1/2 h-auto flex flex-col  border p-5'>
                            {/* ---product preview--- */}
                            <div className='flex justify-center pb-8'>
                                <div className='w-20 h-20 bg-black'></div>
                            </div>
                            {/* ---order summary--- */}
                            <div className='w-full max-w-3xl h-full flex flex-col items-center justify-between'>
                                <div className='w-full'>
                                    <h3 className='font-bold text-2xl mb-4'>oorder summary</h3>
                                    <hr />
                                    <div className='w-full h-fit flex flex-col gap-5 py-5 border-y-2'>
                                        {/* --quantity-- */}
                                        <div className='flex items-center justify-between'>
                                            <span>Square Plate</span>
                                            <span>X2</span>
                                        </div>
                                        {/* --subtotal-- */}
                                        <div className='flex items-center justify-between'>
                                            <span>Subtotal</span>
                                            <span>$88.00usd</span>
                                        </div>
                                        {/* --total--cost-- */}
                                        <div className='flex items-center justify-between'>
                                            <span>Total cost</span>
                                            <span className='text-red-500'>$88.00usd</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <p className='mt-6'>Product will be delivered with in 3 to 4 for business days</p>

                                    <div className='w-full flex items-center justify-center gap-4'>
                                        <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_85_1429)">
                                                <path d="M8.69531 0.0624886C6.66797 0.324207 4.72656 1.23046 3.21484 2.62499C1.43359 4.26952 0.296875 6.5078 0.0429688 8.87499C-0.0117188 9.36327 -0.0117188 10.6367 0.0429688 11.125C0.503906 15.3828 3.75 18.9531 7.9375 19.8086C9.23828 20.0703 10.8555 20.0703 12.1055 19.8008C14.4766 19.2891 16.5664 17.9453 18.0273 15.9961C19.0781 14.5937 19.7266 12.9883 19.9414 11.25C20.0195 10.6172 20.0195 9.38671 19.9414 8.74999C19.7695 7.35155 19.2852 5.96483 18.5625 4.78905C16.9531 2.16796 14.2734 0.433582 11.25 0.0585823C10.6445 -0.0156364 9.28906 -0.0117302 8.69531 0.0624886ZM11.4102 1.53905C14.7969 2.11327 17.5234 4.64843 18.3359 7.97265C18.6602 9.30077 18.6602 10.6992 18.3359 12.0273C17.9102 13.7617 16.9023 15.3945 15.5469 16.5351C14.5234 17.3945 13.2969 18.0234 12.0273 18.3359C10.7148 18.6562 9.30078 18.6562 7.97266 18.3359C6.80078 18.0469 5.60156 17.4609 4.65625 16.7031C3.19141 15.5351 2.10938 13.8437 1.66406 12.0273C1.33984 10.6992 1.33984 9.30077 1.66406 7.97265C2.03906 6.4453 2.80859 5.08202 3.94531 3.9453C5.42578 2.46483 7.24219 1.62889 9.41406 1.42968C9.84375 1.39061 10.8633 1.4453 11.4102 1.53905Z" fill="#FB3747" />
                                                <path d="M9.59776 5.28906C8.91416 5.54297 8.69541 6.26172 9.14463 6.77344C9.73448 7.44531 10.961 7.13281 11.0782 6.28125C11.129 5.92188 10.8868 5.52344 10.5079 5.32813C10.3243 5.23828 9.80088 5.21485 9.59776 5.28906Z" fill="#FB3747" />
                                                <path d="M9.49609 8.38671C9.36719 8.42577 9.23047 8.5039 9.13672 8.59374L8.98438 8.73827V11.4453V14.1523L9.15234 14.3164C9.375 14.5391 9.65625 14.625 10.0938 14.6016C10.5547 14.5781 10.9141 14.3867 11.0195 14.1094C11.0391 14.0586 11.0547 12.8672 11.0547 11.4609C11.0547 8.64843 11.0625 8.73046 10.8164 8.54296C10.5312 8.32811 9.93359 8.2578 9.49609 8.38671Z" fill="#FB3747" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_85_1429">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        </span>
                                        <span>Cancellation Policy</span>
                                    </div>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <Link href="/purchasepage">
                                        <button
                                            className='px-12 py-2 bg-black text-white'
                                        >Proceed</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}
