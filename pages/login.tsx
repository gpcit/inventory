import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { lato } from '@/styles/font';
import AnimatedName from '@/components/AnimatedName';


export default function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
      if(session) {
        router.push(`/dashboard`)
      }
    }, [session, router])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { username, password } = credentials;
        const toastLogin = toast.loading(`Logging In. Please Wait...`, {duration: 1000})
        try {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });
            console.log(`Results for NODE_ENV: ${process.env.NODE_ENV}`)
            console.log('Response:', result);

            if (result?.error) {
              setTimeout(() => {
                toast.error(result.error,{id: toastLogin});
              }, 500)
                
            } else {
                setTimeout(() => {
                  toast.success('Successfully logged in', {id: toastLogin});
                  router.push('/dashboard')
                }, 2000)
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed');
        }
    };

    return (
        <div className={`flex justify-center items-center ${lato.className} h-screen bg-gradient-to-r from-green-600`}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className='border shadow-lg rounded-lg bg-white shadow-black p-5 relative w-96'>
                <div className='bg-gray-100 p-5 rounded-md'>
                    <h2 className='text-2xl'>Welcome!</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='p-2 flex flex-col'>
                        <label htmlFor="username">Enter Username:</label>
                        <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required className='p-2 border rounded-md shadow-sm border-gray-700' />
                    </div>
                    <div className='p-2 flex flex-col'>
                        <label htmlFor="password">Enter Password:</label>
                        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required className='p-2 border rounded-md shadow-sm border-gray-700' />
                    </div>
                    <div className='flex items-end justify-between'>
                        <button className='border px-7 me-2 shadow-black r text-white font-bold bg-green-700 shadow-md rounded-lg p-2' type="submit">
                            Login
                        </button>
                        <div className='text-sm flex '>
                            <p className='me-1'>Don't have an account yet? </p>
                            <Link href="/register" className='text-blue-500 flex justify-end items-end mx-auto underline'>Sign Up</Link>
                        </div>
                    </div>
                </form>
            </div>
            <AnimatedName />
        </div>
    );
}
