import React from 'react'

export default function page() {
  return (
    <>
    {/* ====about page==== */}
    <div>
      <section className='w-full h-fit py-32 bg-[url("/about_us_banner.png")] bg-center'>
        <div>
          <h1 className='text-5xl font-bold text-center text-white'>ABOUT US</h1>
        </div>
      </section>
    </div>
    {/* ---about us content-- */}
    <div className='w-full'>
      <div className='w-full max-w-[1720px] mx-auto py-16 px-5 flex flex-col gap-5'>
        <p className=''>Welcome to Vloerplaat Koning, your specialist in high-quality floor panels. We offer a wide range of flooring solutions for both residential and commercial applications, with a focus on quality, durability, and design.</p>
        <p>Our mission is to deliver the best flooring products that meet our customers' needs. We offer top-quality floor panels that are both aesthetically pleasing and durable.</p>
        <h4 className='font-bold text-xl'>Why choose Vloerplaat Koning?</h4>
        <ul className='[&>li]:font-light flex flex-col gap-2'>
          <li><strong>Quality : </strong> Only the best flooring solutions</li>
          <li><strong>Wide Range : </strong> Various materials and styles for every project.</li>
          <li> <strong>Customer Service : </strong> Advice and support from our experienced team.</li>
          <li> <strong>Fast Delivery: </strong> Efficient and reliable delivery.</li>
        </ul>
        <p>Thank you for your trust in Vloerplaat Koning. We're happy to help you find the perfect floor for your project!</p>
      </div>
    </div>
      
    </>
  )
}
