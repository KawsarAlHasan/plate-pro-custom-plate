'use client'
import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'

export default function Page() {
  const [toggleState, setToggleState] = React.useState({});

  const handleToggle = (id) => {
    setToggleState(prev => ({
      ...prev,
      [id]: !prev[id] 
    }));
  }

  const userlist = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", location: "New York" },
    { id: 2, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", location: "New York" },
    { id: 3, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", location: "New York" },
  ];

  return (
    <>
      <section>
        <div className='w-full h-auto bg-white rounded-md px-5 py-8'>
          <table className='w-full'>

            <tr className='flex justify-between items-center'>
              <th>SL no</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Switch</th>
              <th>Action</th>
            </tr>

            {userlist.map((user) =>
              <tr key={user.id} className='flex justify-between items-center gap-5 my-4'>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.location}</td>
                <td>2 Plates</td>
                <td><span className='text-red-400'>Approved</span></td>

                {/* ===== SWITCH ===== */}
                <td>
                  <div
                    onClick={() => handleToggle(user.id)}
                    className={`w-14 h-8 p-1  rounded-full relative cursor-pointer ${toggleState[user.id] ? 'bg-gray-600' : 'bg-black'}`}
                  >
                    <div
                      className={`h-6 w-6 border-4 border-white rounded-full bg-[#000000] absolute top-1 transition-all
                        ${toggleState[user.id] ? 'right-1' : 'right-7'}
                      `}
                    ></div>
                  </div>
                </td>

                {/* ===== ACTION ===== */}
                <td className='flex justify-center items-center gap-4'>
                  <button className='px-4 py-2 bg-green-200 rounded-md'>view</button>
                  <span className='block p-2 text-2xl text-white bg-red-500 rounded-md cursor-pointer'>
                    <RiDeleteBinLine />
                  </span>
                </td>
              </tr>
            )}

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
      </section>
    </>
  )
}
