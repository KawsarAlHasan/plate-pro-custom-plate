import React from 'react'
import { IoIosPeople } from 'react-icons/io';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { RiVipCrownLine } from 'react-icons/ri';

export default function () {
  const allusers = [
    {
      id:1,
      name: 'Total Users',
      value: '1250',
      icon:<IoIosPeople />,
    },
    {
      id:2,
      name: 'Today’s New Users',
      value: '12',
      icon:<LuChartNoAxesCombined />
    },
    {
      id:3,
      name: 'Total Subscribers',
      value: '3 ',
      icon:<RiVipCrownLine />
    },
    {
      id:4,
      name: 'Total Earned',
      value: '4000$',
      icon:<RiVipCrownLine />
    },
  ];
  return (
    <>
        {/* ----wellcoeme to admin dashboard---- */}
    <section className='w-full h-auto'>
      <header className='w-full p-5 bg-white rounded-xl'>
        <div>
          <p>Hi, Good Morning</p>
          <h5 className='text-xl font-semibold'>Moni Roy</h5>
        </div>
      </header>
      {/* ====User’s Overview==== */}
      <section>
        <div className='w-full mt-5 p-5 bg-white rounded-xl'>
          <h3 className='text-lg font-semibold mb-5'>Dashboard Overview</h3>
        
          
          <div className='w-full h-auto grid grid-cols-4 gap-5'>
            {
              allusers.map((user)=>(
                <div key={user.id} className='w-full p-7 bg-red-200 rounded-xl flex flex-col gap-3'>
                  <div className='text-3xl'>{user.icon}</div>
                  <div>
                    <h4 className='text-2xl font-semibold'>{user.value}</h4>
                    <p>{user.name}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </section>
    </>
  )
}
