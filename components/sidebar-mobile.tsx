'use client';

import { SidebarItems } from '@/types';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { LogOut, Menu, MoreHorizontal, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { SidebarButtonSheet as SidebarButton } from './sidebar-button';
import { usePathname } from 'next/navigation';
import { Separator } from './ui/separator';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarMobileProps {
  sidebarItems: SidebarItems;
}

export function SidebarMobile(props: SidebarMobileProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild className='bg-black'>
        <Button size='icon' variant='ghost' className='fixed top-6 right-6 z-50 border-2 border-white text-white bg-black'>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='text-white bg-black px-3 py-4' hideClose>
        <SheetHeader className='flex flex-row justify-between items-center space-y-0'>
          <span className='text-3xl   font-semibold text-foreground mx-1'>
            Greenstone
          </span>
          <SheetClose asChild>
            <Button className='h-7 w-7 p-0' variant='ghost'>
              <X size={15} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className='h-full '>
          <div className='mt-5 flex flex-col w-full gap-1 '>
            {props.sidebarItems.links.map((link, idx) => (
              <Link key={idx} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  icon={link.icon}
                  className='w-full border-hidden border-green-500 shadow-lg my-2 shadow-green-400/45'
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {props.sidebarItems.extras}
          </div>
          <div className='absolute w-full bottom-4 px-1 left-0'>
            <Separator className='absolute -top-3 left-0 w-full' />
            
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
