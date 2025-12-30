import React from 'react'

export default function ShapeCatergory() {

    return (
        <>
            {/* --shapeWrapper-- */}
            <div>
                {/* ---platewrapper-- */}
                <div>
                    {/* ---square-- */}
                    <div className='aspect-[388/448] bg-amber-50'>
                        <div className='w-full h-full'>
                            <img src="/squre.png" className=' w-full h-full object-cover '/>                        </div>
                    </div>
                    {/* --details-- */}
                    <div>
                        <p className='text-xs flex gap-5'>
                            <span className='inline-block max-w-48'>Stove floor plate 66 x 80 cm matt black</span>
                            <span className='text-red-600'>€88.00 EUR</span>
                        </p>
                        <button
                        className='bg-black px-12 py-3 text-white'
                        >
                            Get started
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
