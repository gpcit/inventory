'use client';

import { SidebarButton } from './sidebar-button';
import { SidebarItems } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lato } from '@/styles/font';

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const pathname = usePathname();

  return (
    <aside className='w-[250px] rounded max-w-xs h-screen fixed left-0 top-0 z-40 bg-black/80'>
      <div className='h-full py-3'>
        <div className='flex flex-col justify-center items-center'>
          <h3 className={`mx-3 text-3xl font-extrabold  text-green-400 tracking-[.3rem] drop-shadow-md ${lato.className}`}>Greenstone</h3>
          <span className='text-white text-sm font-bold'>I.T EQUIPEMENT INVENTORY</span>
        </div>
        <div className='mt-2'>
          <div className='border border-white/50'></div>
          <div className=' flex flex-col gap-1 w-full mt-5 text-white'>
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className='focus:ring-2 focus:selection:border-white hover:border-y-2 border-green-500/50 hover:text-green-200 focus:ring-white w-full py-4'
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {props.sidebarItems.extras}
          </div>
         
        </div>
      </div>
    </aside>
  );
}
