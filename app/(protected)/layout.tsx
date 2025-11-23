import { stackServerApp } from '@/stack/server';
import React, { ReactNode } from 'react'

const ProtectedLayout = async({children}: {children: ReactNode}) => {
   await stackServerApp.getUser({ or: 'redirect' });
  return (
    <div>
        {children}
    </div>
  )
}

export default ProtectedLayout