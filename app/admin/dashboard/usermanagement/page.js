import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { TiCancel } from 'react-icons/ti'

export default function page() {
  const userlist = [
    {id:1, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:2, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:3, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:4, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:5, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:6, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:7, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:8, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:9, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:10, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:11, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:12, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:13, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:14, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
    {id:15, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,location:"New York",action:'false'},
  ]
  return (
    <div>
        <div className='w-full h-auto min-h-[calc("100vh - 100px")] bg-white rounded-md p-6'>
          <div className=' flex justify-between items-center'>
            <div className='w-1/12 shrink-0 '>SL no.</div>
            <div className='w-2/12 '>Full Name</div>
            <div className='w-3/12 '>Email</div>
            <div className='w-2/12 '>Phone</div>
            <div className='w-3/12 '>Location</div>
            <div className='w-1/12 '>Action</div>
          </div>
          {userlist.map((user)=>
            <div key={user.id} className=' flex justify-between items-center gap-5 my-4'>
              <div className='w-1/12 shrink-0 '><span>{user.id}</span></div>
              <div className='w-2/12 '><span>{user.name}</span></div>
              <div className='w-3/12 '><span>{user.email}</span></div>
              <div className='w-2/12 '><span>{user.phone}</span></div>
              <div className='w-3/12 '><span>{user.location}</span></div>
              <div className='w-1/12 '>
              <span className='block w-fit p-4 text-2xl text-white bg-red-500'>
                <TiCancel />
              </span>
              </div>
            </div>
          )}
        </div>
        {/* ====pagination==== */}
        <div className='w-full flex items-center justify-center gap-5 py-8'>
          <div className='bg-red-500 py-2 px-4 flex items-center gap-2 text-white rounded-md'>
            <span><IoIosArrowBack /></span>
            <span>Prev</span>
          </div>
          <div className='bg-red-500 py-2 px-4 text-white rounded-md'>1</div>
          <div className='bg-red-500 py-2 px-4 flex items-center gap-2 text-white rounded-md'>
            <span><IoIosArrowForward /></span>
            <span>Next</span>
          </div>
        </div>
    </div>
  )
}
 