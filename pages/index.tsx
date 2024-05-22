import Chart from 'chart.js';
import React from 'react';
import Link from "next/link";
import { useSession } from 'next-auth/react';

export default function Home() {
  const {data: session, update} = useSession()
 return (
  <div>
    <title>Home Page</title>

    {session ? user({session, update}): guest()}
  </div>
 ) 
}
function guest() {
  return (
    <main className='flex flex-col justify-start items-center bg-white h-screen'>
      <h3>Guest Homepage</h3>
      <div className=''>
        <Link href={'/login'}>Login</Link>
      </div>
      
    </main>
  )
}



function user({session, update}: any) {
  const handleSession = () => {
    console.log(session?.user.name)
  }
  const updateSession = () => {
    

    update({name: "WAtusi"})
  }
  return (
    <main>
      <h3>Authorize User Homepage</h3>
      <div>
        <h5>{session.user.username}</h5>
        <h5>{session.user.email}</h5>
      </div>
      <div>
        <div>
          <button className='border bg-blue-700 text-white rounded px-4 py-2'
          onClick={updateSession}>
          Update Session
          </button>
        </div>
        <div>
          <button className='border bg-green-700 text-white rounded px-4 py-2'
          onClick={handleSession}>
          Log Session
          </button>
        </div>
      </div>
      
    </main>
  )
}
