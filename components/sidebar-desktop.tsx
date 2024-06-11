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
import { ChevronRight, Container, Router, Server } from 'lucide-react';


interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const pathname = usePathname();

  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    await signOut({ callbackUrl: 'http://10.20.10.108:3000/login' });
  };

  useEffect(() => {
    if(pathname === '/supplies/supply' || pathname === '/supplies/switches-routers') {
      setIsOthersOpen(true)
    } else {
      setIsOthersOpen(false)
    }
  }, [pathname])
  const toggleOthersDropdown = () => {
    setIsOthersOpen(!isOthersOpen);
  };

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
              link.label === 'Others' ? (
                <div key={index} className='w-full'>
                  <ChevronRight className={`w-6 h-6 absolute right-2 mt-2 ${isOthersOpen ? 'rotate-90 transition-transform ease-in' : 'transition-transform ease-in'}`} />
                  <SidebarButton
                    variant={pathname.startsWith('/supplies') ? 'secondary' : 'ghost'}
                    icon={link.icon}
                    className='focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full'
                    onClick={toggleOthersDropdown}
                  >
                    {link.label}
                  </SidebarButton>

                  {isOthersOpen && (
                    <div className='bg-black/60'>
                      <div className='ml-4'>
                        <Link href='/supplies/supply'>
                          <SidebarButton className={` w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/supply' ? 'border border-green-600 ' : ''}`} icon={Container}>I.T Supply</SidebarButton>
                        </Link>
                      </div>
                      <div className='ml-4'>
                        <Link href='/supplies/switches-routers'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/switches-routers' ? 'border border-green-600 ' : ''}`} icon={Router}>Switches | Routers</SidebarButton>
                        </Link>
                      </div>
                      <div className='ml-4'>
                        <Link href='/supplies/nas'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/nas' ? 'border border-green-600 ' : ''}`} icon={Server}>NAS</SidebarButton>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={index} href={link.href}>
                  <SidebarButton
                    variant={pathname === link.href ? 'secondary' : 'ghost'}
                    icon={link.icon}
                    className={`focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full ${pathname === link.href ? 'bg-green-700/50 border border-white' : ''}`}
                  >
                    {link.label}
                  </SidebarButton>
                </Link>
              )
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
