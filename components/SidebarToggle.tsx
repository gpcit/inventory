import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";
import { lato } from "@/styles/font";
import {
    UserGroupIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon
  } from '@heroicons/react/24/outline';
interface SidebarLink {
  name: string;
  href: string;
  icon: JSX.Element;
}


  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    {
      name: 'Inventory',
      href: '/dashboard/inventory',
      icon: ComputerDesktopIcon,
    },
    {name: 'Cellphone', href: '/dashboard/cellphone', icon: DevicePhoneMobileIcon},
  ];


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className="pr-2 h-full relative">
      <div
        className={`bg-black rounded-lg fixed ${
          isOpen ? "w-60 lg:w-60" : "w-20 md:w-20"
        } duration-300 relative`}
      >
        <div>
          <div className="p-1 ml-auto text-gray-300 sm:flex-grow custom-font">
            <div className={` items-center p-1 flex`}>
              <span
                className={`${lato.className} ${
                  !isOpen ? "text-3xl text-center" : "text-[9.2rem] items-center justify-center"
                } custom-font  text-white `}
              >
                G
              </span>
              <span
                className={`${lato.className} custom-font  justify-end pt-10 items-end text-[25px] text-white ${
                  !isOpen ? "hidden" : "flex"
                }`}
              >
                reenstone
              </span>
            </div>
          </div>
        </div>
        <ArrowLeftIcon
          className={`bg-black text-white m- border border-green-400 shadow-xl text-3xl rounded-lg absolute -right-2 top-9 h-6 w-6 ${
            !isOpen && "rotate-180 top-1"
          }`}
          onClick={toggleSidebar}
        />
        <div className="pt-5">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link key={link.name} href={link.href}>
                
                  <LinkIcon className="w-6" />
                  <p className={`hidden ${isOpen ? "lg:block" : ""}`}>
                    {link.name}
                  </p>
                
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
