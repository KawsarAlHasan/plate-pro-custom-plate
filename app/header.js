import React from 'react';
import Link from 'next/link';
import { IoMdCart } from 'react-icons/io'

export default function Header() {
  return (
    <header>
      <nav className='flex items-center justify-between py-7 px-5'>
        {/* ---logo---- */}
        <div className='w-full max-w-[220px]'>
          <Link href='/'>
          <img src={"/headerLogo.png"} className='w-ful aspect-[220/35] object-cover'/>
          </Link>
        </div>
        {/* ----menu--- */}
        <div className='hidden lg:block'>
          <ul className='flex gap-6'>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/aboutus">About us</Link></li>
            <li><Link href="/selectyourshape">How it Works</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className='members flex items-center gap-5'>
          <Link href="/auth/signin">
          <span>Login</span>
          </Link>
          <span>|</span>
          <span>Sign up</span>
          <span><IoMdCart /></span>
        </div>
      </nav>
    </header>
  )
}

