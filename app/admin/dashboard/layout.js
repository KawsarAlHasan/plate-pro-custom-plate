import React from 'react'
import AdminLayout from '../_component/AdminLayout'

export default function layout({ children }) {
  return (
     <>
     <AdminLayout>
       {children}
     </AdminLayout>
     </>

  )
}
