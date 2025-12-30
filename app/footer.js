import React from 'react'
import { AiFillTikTok } from 'react-icons/ai'
import { BsEnvelope } from 'react-icons/bs'
import { CiClock2 } from 'react-icons/ci'
import { FaFacebookSquare, FaInstagramSquare } from 'react-icons/fa'
import { IoCallOutline } from 'react-icons/io5'

export default function Footer() {
  return (
    <section id='footer' className='w-full bg-black'>
      <div className='w-full max-w-[1920px] mx-auto py-12 px-5 xl:py-24 xl:px-20'>
        <div className='w-full flex flex-col gap-10 lg:flex-row'>
          <div className='footerLogo w-full lg:w-2/6 xl:w-1/6'>
            <img src={"/footerLogo.png"} alt='footer logo'/>
          </div>
          <div className='footerMenu w-full text-white flex flex-wrap gap-8 justify-between'>
            {/* --menu-- */}
            <div>
              <h5 className='text-2xl'>Menu</h5>
              <ul className='footerMenuList mt-5'>
                <li>About us</li>
                <li>How it works</li>
                <li>Contacts</li>
              </ul>
            </div>
            {/* --Terms & Conditions-- */}
            <div>
              <h5 className='text-2xl'>Terms & Conditions</h5>
              <ul className='footerMenuList mt-5'>
                <li>Privacy Policies</li>
                <li>Terms & Conditions</li>
                <li>Delivery Policy</li>
                <li>Order cancellation Policy</li>
              </ul>
            </div>
            {/* --Company Data-- */}
            <div>
              <h5 className='text-2xl'>Company Data</h5>
              <ul className='footerMenuList mt-5'>
                <li>Vloerplaat</li>
                <li><a href='tell:0527304050'>0527304050</a></li> 
                <li><a href='mailto: customerservicekachelpand@gmail.com'>customerservicekachelpand@gmail.com</a></li>
                <li>1801 sw 32nd ave, Miami, Florida, 33145, suite 705</li>
              </ul>
            </div>
            {/* ---Contact--- */}
            <div>
              <h5 className='text-2xl'>Contact</h5>
              <ul className='footerMenuList mt-5'>
                <li className='flex items-baseline gap-2'>
                  <span><IoCallOutline /></span>
                  <span>0527304050</span>
                </li>
                <li className='flex items-baseline gap-2'>
                  <span><BsEnvelope /></span>
                  <span>customerservicekachelpand@gmail.com</span>
                </li>
                <li className='flex items-baseline gap-2'>
                  <span><CiClock2 /></span>
                  <span>Monday - Friday 09 : 00 - 17 : 00</span>
                </li>
              </ul>
              <div className='mt-6'>
                <h5 className='text-2xl'>Follow Us On our Socials</h5>
                <div className='flex gap-5 '>
                  <span><FaFacebookSquare /></span>
                  <span><FaInstagramSquare /></span>
                  <span><AiFillTikTok /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
 