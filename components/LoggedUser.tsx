import React, { useEffect, useRef, useState } from 'react';
import { lato } from '@/styles/font';
import { useSession } from 'next-auth/react';
import {formatDistanceToNowStrict} from 'date-fns'
import Cookies from 'js-cookie';

export default function LoggedUser () {
    const [expiresIn, setExpiresIn] = useState('')
    const {data: session, status} = useSession()
    const logUser = session?.user?.username
    const getName = logUser?.toUpperCase()


    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        // Retrieve expiration time from cookies
        const storedExpiration = Cookies.get('sessionExpiration');
        const expirationTime = storedExpiration ? new Date(storedExpiration).getTime() : null;

        if (expirationTime) {
            const calculateTimeLeft = () => {
                const currentTime = new Date().getTime();
                const timeDifference = expirationTime - currentTime;

                if (timeDifference > 0) {
                    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                    const formattedTimeLeft = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    setExpiresIn(formattedTimeLeft);
                } else {
                    setExpiresIn('00:00:00');
                    clearInterval(intervalId!);
                }
            };

            calculateTimeLeft(); // Initial calculation
            intervalId = setInterval(calculateTimeLeft, 1000); // Update every second
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);
    return (
        <>
        
                <div className='flex justify-between items-center'>
                    <div>
                        <span className=' font-bold text-white text-sm'>Welcome!</span>
                    </div>
                    <div>
                        <span className={`font-bold text-green-400 border-b-2 text-sm ml-1 ${lato.className}`}>{getName}</span>
                    </div>
                </div>
        
        {/* <div className='w-[500px]'>
            <div className='absolute left-52 top-0'>
                    <span>Access Expires at: {expiresIn} </span>
            </div>
        </div> */}
        </>
        
    )
}