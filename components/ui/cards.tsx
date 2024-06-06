import React from 'react';
import { BanknotesIcon, ClockIcon, UserGroupIcon, InboxIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { Laptop2, Computer, Smartphone } from 'lucide-react';
import { lusitana } from '@/styles/font';

const iconMap = {
  laptop: Laptop2,
  desktop: Computer,
  cellphone: Smartphone
};

const Card = ({
  title,
  value,
  type,
}: {
  title: string;
  value: any;
  type: 'laptop' | 'desktop' | 'cellphone';
}) => {
  const Icon = iconMap[type];

  return (
    <div className="p-2 text-black shadow bg-green-900/90 rounded-xl">
      <div className="flex p-1 ">
        {Icon ? <Icon className="mr-auto text-white h-7 w-7"  /> : null}
        <h3 className="ml-auto text-xl font-medium text-white ">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
       Total unit/s <br></br> {value} 
      </p>
    </div>
  );
};

export default Card;

