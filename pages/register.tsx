import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { lato } from '@/styles/font'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { Preahvihear } from 'next/font/google'
 
export default function RegisterPage() {
    const[user, setUser] = useState({
        email: '',
        username: '',
        password: '',
    })
 const handlechange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser(prev => ({
        ...prev,
        [name]: value,
    }))
 }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(user) {
        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            body: JSON.stringify(user)
        });
        return response;
    }
    return null;
  }
 
  return (
    
    <div className={`flex justify-center items-center ${lato.className} h-screen bg-gradient-to-r from-green-600`}>
      <Toaster position="top-center" reverseOrder={false} />  
        <div className='border shadow-lg rounded-lg bg-white shadow-black p-5 relative w-96'>
            <div className='bg-gray-100 p-5 rounded-md'>
                <h2 className='text-2xl'>Welcome!</h2>
            </div>
            <form onSubmit={handleSubmit}>
            <div className='p-2 flex flex-col'>
                <label htmlFor="email">Enter Email:</label>
                <input type="text" name="email" placeholder="Email" value={user.email} onChange={handlechange} required className=' p-2 border rounded-md shadow-sm border-gray-700'/>
            </div>
            <div className='p-2 flex flex-col'>
                <label htmlFor="username">Enter Username:</label>
                <input type="username" name="username" placeholder="Username" value={user.username} onChange={handlechange} required className=' p-2 border rounded-md shadow-sm border-gray-700'/>
            </div>
            <div className='p-2 flex flex-col'>
                <label htmlFor="password">Enter Password:</label>
                <input type="password" name="password" placeholder="Password" value={user.password} onChange={handlechange} required  className='p-2 border rounded-md shadow-sm border-gray-700'/>
            </div>
            
            <div className='flex items-end justify-between '>
                <div>
                    <button className='border px-5 py-2 shadow-black text-white font-bold bg-green-700 shadow-md rounded-lg' type="submit">
                        Create
                    </button>
                </div>
                
                <div className='text-sm flex '>
                    <p className='me-1'>Have an account? Please </p>
                    <Link href="/login" className='text-blue-500 flex justify-end items-end mx-auto underline'> LOGIN</Link>
                </div>
            </div>
                
            </form>
        </div>
        <div className='absolute right-5 top-2'>
          <span className='font-bold'>Greenstone</span>
        </div>
        
    </div>
  )
}