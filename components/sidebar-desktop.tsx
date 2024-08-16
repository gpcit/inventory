import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { User } from '@/lib/definition';
import { SidebarButton } from './sidebar-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lato } from '@/styles/font';
import { CiLogout } from 'react-icons/ci';
import { TbFileExport } from 'react-icons/tb';
import { SidebarItems } from '@/types';
import LoggedUser from './LoggedUser';
import { ChevronRight, Container, Router, Laptop,
  Smartphone,
  Home,
  Layers,
  Server,
  ListTree,
  Printer,
  FileOutput,
  UserRoundCheck } from 'lucide-react';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const [loginUser, setLoginUser] = useState<User | null>(null);
  const pathname = usePathname();

  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isITEquip, setIsITEquip] = useState(false);
  const [isCompanyAsset, setIsCompanyAsset] = useState(false);

  const handleSubmit = async () => {
    await signOut({ callbackUrl: 'http://10.20.10.108:3000/login' });
  };

  const hoveres = 
  useEffect(() => {
    if(pathname === '/supplies/supply' || pathname === '/supplies/switches-routers' || pathname === '/supplies/nas' || pathname === '/accounts' || pathname === '/export') {
      setIsOthersOpen(true)
    } else if (pathname === '/inventory' || pathname === '/cellphone' || pathname === '/printer') {
      setIsITEquip(true)
    } else if (pathname === '/company-equipment') {
      setIsCompanyAsset(true)
    } else {
      setIsOthersOpen(false)
      setIsITEquip(false)
    }
  }, [pathname])
  const toggleOthersDropdown = () => {
    setIsOthersOpen(!isOthersOpen);
    pathname === ""
  };

  const toggleITEquipDropdown = () => {
    setIsITEquip(!isITEquip);
    pathname === ""
  };

  const toggleCompanyEquip = () => {
    setIsCompanyAsset(!isCompanyAsset);
    pathname === ""
  };

  return (
    <aside className='w-[250px] rounded max-w-xs h-screen fixed left-0 top-0 z-40 bg-black/80'>
      <div className='h-full py-3'>
        <Link href='/dashboard'>
        <div className='flex flex-col justify-center items-center cursor-pointer '>
          <h3 className={`mx-3 text-3xl font-bold text-green-400 tracking-[.3rem] ${lato.className}`}>Greenstone</h3>
          <span className='text-white text-sm font-bold'>COMPANY ASSETS & EQUIPMENT</span>
        </div>
        </Link>
        <div className='mt-2'>
          <div className='border border-white/50'></div>
          <div className='flex flex-row justify-center items-center'><LoggedUser /></div>
          <div className='flex flex-col gap-1 w-full mt-10 text-white'>
            {props.sidebarItems.links.map((link, index) => (
              link.label === 'Others' ? (
                <div key={index} className='w-full'>
                  <SidebarButton
                    variant={pathname.startsWith('/supplies') ? 'secondary' : 'ghost'}
                    icon={link.icon}
                    className='focus:ring-green-500 focus:ring  hover:border-y-2 border-green-500/50 hover:text-green-200  w-full'
                    onClick={toggleOthersDropdown}
                  >
                  <ChevronRight className={`cursor-pointer w-6 h-6 absolute right-2 ${isOthersOpen ? 'rotate-90 transition-transform ease-in' : 'transition-transform ease-in'}`} />
                  
                    {link.label}
                  </SidebarButton>

                  {isOthersOpen && (
                    <div className='bg-black/60'>
                      <div className='ml-4'>
                        <Link href='/accounts'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/accounts' ? 'border border-green-600 ' : ''}`} icon={UserRoundCheck}>Server Accounts</SidebarButton>
                        </Link>
                      </div>
                      <div className='ml-4'>
                        <Link href='/supplies/supply'>
                          <SidebarButton className={` w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/supply' ? 'border border-green-600 ' : ''}`} icon={Container}>Supplies</SidebarButton>
                        </Link>
                      </div>
                      <div className='ml-4'>
                        <Link href='/export'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/export' ? 'border border-green-600 ' : ''}`} icon={FileOutput}>Export Data</SidebarButton>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : 
                link.label === 'IT Equipment' ? (
                  <div key={index} className='w-full'>
                    <SidebarButton
                      variant={pathname.startsWith('/') ? 'secondary' : 'ghost'}
                      icon={link.icon}
                      className='focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full'
                      onClick={toggleITEquipDropdown}
                    >
                    <ChevronRight className={`cursor-pointer w-6 h-6 absolute right-2 ${isITEquip ? 'rotate-90 transition-transform ease-in' : 'transition-transform ease-in'}`} />
                    
                      {link.label}
                    </SidebarButton>

                    {isITEquip && (
                      <div className='bg-black/60'>
                        <div className='ml-4'>
                          <Link href='/inventory'>
                            <SidebarButton className={` w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/inventory' ? 'border border-green-600 ' : ''}`} icon={Laptop}>CPU / Laptop</SidebarButton>
                          </Link>
                        </div>
                        <div className='ml-4'>
                          <Link href='/cellphone'>
                            <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/cellphone' ? 'border border-green-600 ' : ''}`} icon={Smartphone}>Cellphone</SidebarButton>
                          </Link>
                        </div>
                        <div className='ml-4'>
                          <Link href='/printer'>
                            <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/printer' ? 'border border-green-600 ' : ''}`} icon={Printer}>Printer</SidebarButton>
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
                link.label === 'Company Assets' && (
                  <div key={index} className='w-full'>
                  <SidebarButton
                    variant={pathname.startsWith('/') ? 'secondary' : 'ghost'}
                    icon={link.icon}
                    className='focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full'
                    onClick={toggleCompanyEquip}
                    disabled
                  >
                  <ChevronRight className={`cursor-pointer w-6 h-6 absolute right-2 ${isCompanyAsset ? 'rotate-90 transition-transform ease-in' : 'transition-transform ease-in'}`} />
                  
                    {link.label}
                  </SidebarButton>

                  {isCompanyAsset && (
                    <div className='bg-black/60'>
                      <div className='ml-4'>
                        <Link href='/company-equipment'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/company-equipment' ? 'border border-green-600 ' : ''}`} icon={Layers}>Company Equipment</SidebarButton>
                        </Link>
                      </div>
                      {/* <div className='ml-4'>
                        <Link href='/supplies/supply'>
                          <SidebarButton className={` w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/supply' ? 'border border-green-600 ' : ''}`} icon={Container}>I.T Supply</SidebarButton>
                        </Link>
                      </div>
                      <div className='ml-4'>
                        <Link href='/supplies/nas'>
                          <SidebarButton className={`w-full focus:ring-2 hover:underline hover:text-green-200 ${pathname === '/supplies/nas' ? 'border border-green-600 ' : ''}`} icon={Server}>NAS</SidebarButton>
                        </Link>
                      </div> */}
                    </div>
                  )}
                </div>
                )
              ) 
            ))}
            {/* <div className={`mt-12 rounded focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full py-2 ${pathname === '/export' ? 'bg-green-700/50 border border-white' : ''}`}>
              <Link href={'/export'}>
                <div className={`flex items-center gap-1 justify-start ml-3 ${lato.className} `}>
                  <TbFileExport className='h-6 w-7' />
                  <span className='text-sm'>Export Data</span>
                </div>
              </Link>
            </div> */}
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
