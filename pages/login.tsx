import { FormEvent } from 'react'
import { useRouter } from 'next/router'
import { lato } from '@/styles/font'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
 
export default function LoginPage() {
  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const username = formData.get('username')
    const password = formData.get('password')
 
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const result = await response.json()
    const loginLoading = toast.loading(`Logging in... Please wait`, {duration: 3000, position: "top-center"})
    if (response.ok) {
      setTimeout(() => {
        toast.success(`Successfully Login`, {id: loginLoading})
        router.push('/dashboard')
      }, 2500)
    } else {
      setTimeout(() => {
        toast.error(`${result.error}`)
        console.error('Username or Password are incorrect')
      }, 2500)
      
    }
  }
 
  return (
    
    <div className={`flex justify-center items-center ${lato.className} h-screen bg-gradient-to-r from-green-600`}>
      <Toaster position="top-center" reverseOrder={false} />  
        <div className='border shadow-lg rounded-lg bg-white shadow-black p-5 relative w-96'>
            <div className='bg-gray-100 p-5 rounded-md'>
                <h2 className='text-2xl'>Login</h2>
            </div>
            <form onSubmit={handleSubmit}>
            <div className='p-2 flex flex-col'>
                <label htmlFor="username">Enter Username:</label>
                <input type="username" name="username" placeholder="Username" required className='focus:border-black p-2 border rounded-md shadow-sm border-gray-700'/>
            </div>
            <div className='p-2 flex flex-col'>
                <label htmlFor="password">Enter Password:</label>
                <input type="password" name="password" placeholder="Password" required  className='p-2 border rounded-md shadow-sm border-gray-700'/>
            </div>
            
            <div className='flex items-end justify-end'>
                <button className='border  shadow-black r bg-gradient-to-r from-green-500 shadow-md rounded-lg p-2' type="submit">
                    Login
                </button>
                </div>
            </form>
        </div>
    </div>
  )
}