import Sidebar from '@/components/sidebar';
import { stackServerApp } from '@/stack/server';
import React, { ReactNode } from 'react'

const ProtectedLayout = async({children}: {children: ReactNode}) => {
   await stackServerApp.getUser({ or: 'redirect' });
  return (
    <div className='flex'>
        <Sidebar />
        <div className='flex-1  bg-gray-50 p-4 min-h-screen  ]'>

        {children}
        </div>
    </div>
  )
}

export default ProtectedLayout