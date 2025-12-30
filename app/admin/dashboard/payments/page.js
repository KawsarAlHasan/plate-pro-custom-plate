import React from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export default function page() {
  const customerList = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 2, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 3, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "super admin", amount: '500' },
    { id: 4, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 5, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 6, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "super admin", amount: '500' },
    { id: 7, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 8, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 9, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 10, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 11, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "super admin", amount: '500' },
    { id: 12, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 13, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 14, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
    { id: 15, name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890", role: "admin", amount: '500' },
  ];
  return (
    <div className='w-full h-full bg-white p-8 rounded-xl'>
      <table className='w-full'>
        <thead className='w-full'>
          <tr className='w-full flex justify-between mb-5'>
            <th>Payment Serial no</th>
            <th>User Name</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>

          {customerList.map((customer) => (
            <tr key={customer.id} className='flex justify-between py-2'>
              <td>#{customer.id + 222}</td>
              <td>{customer.name}</td>
              <td>{customer.id}</td>
              <td>{customer.email}</td>
              <td>{customer.amount}</td>
            </tr>
          ))}
        </tbody>
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
  )
}
