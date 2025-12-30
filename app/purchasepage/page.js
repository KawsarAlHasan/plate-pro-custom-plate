import React from 'react'

export default function page() {
    return (
        <>
            <main>
                {/* ===Purchase page wrappper=== */}
                <div className='w-full py-12'>
                    {/* ===heading=== */}
                    <h2 className='text-center text-2xl font-bold mb-9'>Thankyou for your purchase</h2>
                    {/* ====invoice wrapper=== */}
                    <div className='w-full max-w-[1024px] mx-auto border border-gray-300 p-12 flex'>
                        {/* ====purchase detail==== */}
                        <div className='w-1/2'>
                            <h5 className='text-xl font-bold'>Invoice</h5>
                            <p><b>Order ID :</b> 22004411</p>
                            <br/>
                            <p><b>Date :</b> 02/ 02 / 2025</p>
                            <p><b>Customer name :</b> Nusrat</p>
                            <p><b>Address :</b> Voorstraat 32, 8317 AH Kraggenburg, Netherlands , </p>
                            <p><b>Mobile number :</b> 0527304050</p>
                            <p><b>Product name :</b> Square Plate</p>
                            <p><b>Dimensions :</b> 800 × 100 mm,</p>
                            <p><b>Quantity :</b> 2</p>
                            <br/>
                            <p><b>Subtotal :</b> €88.00 EUR </p>
                            <p className='text-red-500'>Total cost  : €88.00 EUR </p>
                        </div>
                        {/* ==purchase element=== */}
                        <div className='w-1/2 p-12 border flex items-center justify-center'>
                            {/* ----wrapper--- */}
                            <div className='w-4/5 aspect-square border rounded-tl-full bg-black'>
                            </div>
                        </div>
                    </div>
                    <p className='text-center py-5'>Product will be delivered with in 3 to 4 for business days</p>
                    <div className='w-full max-w-[1024px] mx-auto  flex justify-end'>
                        <button className='bg-black text-white py-2 px-12'>Download</button>
                    </div>
                </div>
            </main>
        </>
    )
}
