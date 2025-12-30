import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBin5Line, RiDeleteBinLine } from 'react-icons/ri';

export default function page() {
  const administrators = [
    {id:1, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:2, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:3, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"super admin",action:'false'},
    {id:4, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:5, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:6, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"super admin",action:'false'},
    {id:7, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:8, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:9, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:10, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:11, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"super admin",action:'false'},
    {id:12, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:13, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:14, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
    {id:15, name:"John Doe", email:"john.doe@example.com",phone:"123-456-7890" ,role:"admin",action:'false'},
  ];
  return (
    <div className='bg-white p-5 rounded-xl'>

      <div className='mb-5'>
        <button className='py-3 px-6 bg-red-500 text-white rounded-md flex items-center gap-4 cursor-pointer'>
          <span><FaPlus /></span>
          <span>New Administrators Profile Create </span>
        </button>
      </div>

      <div>
        <table className='w-full'>
          <tr className='flex justify-between items-center'>
            <th>SL no</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Has Access to</th>
            <th>Action</th>
          </tr>
          {
            administrators.map((user, i) => (
              <tr key={user.id} className='flex justify-between items-center py-2'>
                <td>{user.id+100}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <div className='flex gap-3'>
                    <div className='px-2 py-2 bg-green-400 text-white rounded-md'><MdOutlineEdit /></div>
                    <div className='px-2 py-2 bg-red-500 text-white rounded-md'><RiDeleteBin5Line /></div> 
                  </div>
                </td>
              </tr>
            ))
          }
        </table>

        {/* ==== Pagination ==== */}
        <div className='w-full flex items-center justify-center gap-5 py-8'>
          <div className='bg-red-500 py-2 px-4 flex items-center gap-2 text-white rounded-md'>
            <IoIosArrowBack />
            <span>Prev</span>
          </div>
          <div className='bg-red-500 py-2 px-4 text-white rounded-md'>1</div>
          <div className='bg-red-500 py-2 px-4 flex items-center gap-2 text-white rounded-md'>
            <IoIosArrowForward />
            <span>Next</span>
          </div>
        </div>
      </div>
    </div>
  )
}
