'use client';

import {
  Laptop,
  Smartphone,
  Home,
  Server,
} from 'lucide-react';
import { SidebarDesktop } from './sidebar-desktop';
import { SidebarItems } from '@/types';
import { SidebarButton } from './sidebar-button';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from './sidebar-mobile';

const sidebarItems: SidebarItems = {
  links: [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Inventory', href: '/inventory', icon: Laptop },
    { label: 'Cellphone', href: '/cellphone', icon: Smartphone },
    { label: 'Server Accounts', href: '/accounts', icon: Server },
    // {
    //   href: '/item/lists',
    //   icon: List,
    //   label: 'Lists',
    // },
    // {
    //   href: '/item/bookmarks',
    //   icon: Bookmark,
    //   label: 'Bookmarks',
    // },
    // {
    //   href: '/item/communities',
    //   icon: Users,
    //   label: 'Communities',
    // },
    // {
    //   href: '/item/profile',
    //   icon: User,
    //   label: 'Profile',
    // },
  ],
//   extras: (
//     <div className='flex flex-col gap-2'>
//       <SidebarButton icon={MoreHorizontal} className='w-full'>
//         More
//       </SidebarButton>
//       <SidebarButton
//         className='w-full justify-center text-white'
//         variant='default'
//       >
//         Tweet
//       </SidebarButton>
//     </div>
//   ),
};

export function SidebarToggle() {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems}/>;
}
