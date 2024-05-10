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
        <h3 className={`mx-3 text-3xl font-extrabold  text-green-600 tracking-[.3rem] drop-shadow-md ${lato.className}`}>Greenstone</h3>
        <div className='mt-4'>
          <div className='border border-white/50'></div>
          <div className=' flex flex-col gap-1 w-full text-white mx-1'>
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className='focus:ring-2 focus:selection:border-white hover:border-white hover:border-2 hover:text-green-200 focus:ring-white px-5 w-60 my-1 py-4  shadow-md '
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
