import React, { useEffect, useRef, useState } from 'react';
import { lato } from '@/styles/font';
import { useSession } from 'next-auth/react';

export default function LoggedUser () {

    const {data: session, status} = useSession()
    const logUser = session?.user?.username
    const getName = logUser?.toUpperCase()
    return (
        <div className='flex flex-row justify-between w-40'>
                <div>
                    <span className=' font-bold text-black'>Welcome!</span>
                </div>
                <div>
                    <span className={`font-bold text-green-600 text-sm ${lato.className}`}>{getName}</span>
                </div>
        </div>
    )
}