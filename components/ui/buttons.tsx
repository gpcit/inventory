import { PencilIcon, PlusIcon, TrashIcon, QrCodeIcon, EyeIcon, ArrowUpTrayIcon  } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import Link from 'next/link';
import { Undo2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ArrowRightLeft } from 'lucide-react';


interface CreateInventoryProps {
  onClick: () => void;
}
interface PropsForID {
  id: number;
  onClick: (id: number) => void;
}
interface ExportInventoryProps {
  onClick: () => void;
  table: string;
}



export function CreateInventory({ onClick}: CreateInventoryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname()
  return (
    <>
    <button
      onClick={onClick}
      className="flex items-center h-10 px-4 text-sm font-semibold relative transition-colors rounded-lg bg-green-600 shadow-sm shadow-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="hidden md:block text-white">Create New </span>{' '}
      <PlusIcon className="h-5 md:ml-2 text-white" />
    </button>
    </>
  );
}

// export function UpdateInventory({ id, onClick }: PropsForID) {
//   return (
//     <>
//     <button
//       onClick={() => onClick(id)}
//       className="p-2 border rounded-md hover:bg-gray-100 tooltip"
//     >
      
//       <PencilIcon className="w-5" />
//     </button>
//     </>
//   );
// }

export function ExportData({ id, onClick }: PropsForID) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={() => onClick(id)}
      className={`p-2 border rounded-md hover:bg-gray-100 relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArrowUpTrayIcon className="w-5" />
      <div className={`${isHovered ? 'flex' : 'hidden'} text-green-700 flex-col justify-center items-center absolute -top-4 -right-1 text-xs z-50 font-bold`}>Export Data</div>
    </button>
  );
}

export function TransferButton ({ id, onClick, onSave }:  {id: number, onClick: (id: number, onSave: () => void) => void, onSave: () => void}) {
  const [isHovered, setIsHovered] = useState(false)
  const handleSave = () => {
    onSave()
  }
  
  return (
    <button 
      onClick={() => onClick(id, handleSave)}
      className="p-2 border rounded-md hover:bg-gray-100 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArrowRightLeft className='w-5' /> 
      <div className={`${isHovered ? 'flex' : 'hidden'} text-green-700 flex-col justify-center items-center absolute -top-4 -right-1 text-xs z-50 font-bold`}>Transfer Data</div>
    </button>
  )
}

export function UpdateInventory({ id, onClick }: PropsForID) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-gray-100 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PencilIcon className="w-5" />
      <div className={`${isHovered ? 'flex' : 'hidden'} text-green-700 flex-col justify-center items-center absolute -top-4 -right-1 text-xs z-50 font-bold`}>Edit Data</div>
    </button>
  );
}

export function DeleteInventory({ id, onClick }: PropsForID) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-gray-100 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TrashIcon className="w-5" />
      <div className={`${isHovered ? 'flex' : 'hidden'} text-green-700 flex-col justify-center items-center absolute -top-4 -right-1 text-xs z-50 font-bold`}>Delete Data</div>
    </button>
  );
}


export function ExportInventory({onClick, table}: ExportInventoryProps) {
  return (
    <>
    <button
      onClick={onClick}
      className="flex items-center h-8 px-3 mb-2 sm:mb-2 text-sm font-semibold relative transition-colors rounded-lg bg-yellow-600 shadow-sm shadow-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      
      <FaFileExport className="h-5 mx-2 text-white" />
      <span className="hidden md:block text-sm text-white">Export</span>
    </button>
    </>
  );
}

export function AddQTY({id, onClick}: PropsForID) {
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-green-100"
    >
      <PlusIcon className="w-5" />
      
    </button>
  );
}

export function ReturnUnit({id, onClick}: PropsForID) {
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 flex gap-1 border rounded-full hover:bg-green-100"
    >
      
      <span className='text-[.8rem] font-bold'>RETURN</span>
      <Undo2 className="w-5 h-5 text-blue-600" />
    </button>
  );
}
