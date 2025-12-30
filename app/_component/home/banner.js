import Link from 'next/link'
import React from 'react'

export default function Banner() {
  return (
    <>
    <section className='w-full bg-[url("/bannerHome.png")] bg-cover bg-center py-14 lg:py-2'>
        <div className='w-full aspect-[1920/752] px-14 text-white flex items-center'>
            <div>
                <h1 className='text-5xl'>Design Your Own Floor Plates</h1>
                <p className='max-w-[640px] pt-8 pb-[51px]'>Customize, preview, and order — all in one place. Create the perfect floor plate for your project with instant pricing and  CAD preview</p>
                <Link href='/getstarted'>
                <div className='w-fit px-20 py-4 bg-black text-white'>
                    <span>Get started</span>
                </div>
                </Link>
            </div>
        </div>
    </section>
    </>
  )
}
