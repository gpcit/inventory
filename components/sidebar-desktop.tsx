import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User } from '@/lib/definition';
import { SidebarButton } from './sidebar-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lato } from '@/styles/font';
import { CiLogout } from 'react-icons/ci';
import { TbFileExport } from 'react-icons/tb';
import { SidebarItems } from '@/types';
import { roles } from '@/lib/company';
import LoggedUser from './LoggedUser';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession(); // Ensure proper import and usage
  
  const id = session?.user?.uid;
  const role_id = session?.user?.role_id
  const displayName = session?.user?.username

  const username = displayName?.toUpperCase()

  const handleSubmit = async () => {
    const toastLogout = toast.loading(`Logging Out`, { duration: 5000 });
    setTimeout(() => {
      toast.success('Logged Out Successfully', { id: toastLogout });
    }, 300);

    await signOut();
    router.push(`${process.env.NEXT_PUBLIC_URL}/login`)
  };

  const role_name = roles[role_id as keyof typeof roles] || role_id;

  return (
    <aside className='w-[250px] rounded max-w-xs h-screen fixed left-0 top-0 z-40 bg-black/80'>
      <div className='h-full py-3'>
        <div className='flex flex-col justify-center items-center'>
          <h3 className={`mx-3 text-3xl font-bold text-green-400 tracking-[.3rem] ${lato.className}`}>Greenstone</h3>
          <span className='text-white text-sm font-bold'>IT EQUIPMENT INVENTORY</span>
        </div>
        <div className='mt-2'>
          <div className='border border-white/50'></div>
          <div className='flex flex-row justify-center items-center'><LoggedUser /></div>
          <div className='flex flex-col gap-1 w-full mt-5 text-white'>
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className='focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full'
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            <div className='mt-12 rounded focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full py-2'>
              <Link href={'/export'}>
                <div className={`flex items-center gap-1 justify-start ml-3 ${lato.className}`}>
                  <TbFileExport className='h-6 w-7' />
                  <span className='text-sm'>Export Data</span>
                </div>
              </Link>
            </div>
            <div className=''>
              
              <div onClick={handleSubmit} className='absolute bottom-4 flex flex-row ml-3 cursor-pointer w-full'>
                <CiLogout className='h-6 w-7 rotate-180' /> Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
