import { AuthUser } from '@/lib/definition'
import React from 'react'
import { createContext, useState } from 'react'
import { useSession } from 'next-auth/react'

export const UserContext = createContext<AuthUser | null>(null)

const UserProvider = ({ children } : {children: React.ReactNode}) => {
    const {data: session, status} = useSession()
    const role_id = session?.user?.role_id
    const username = session?.user?.username
  return (
    <UserContext.Provider value={{role_id, username }}>
        {children}
    </UserContext.Provider>
  )
}

export default UserProvider