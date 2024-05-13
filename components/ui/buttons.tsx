import { PencilIcon, PlusIcon, TrashIcon, QrCodeIcon, EyeIcon,  } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import Link from 'next/link';

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
  return (
    <>
    <button
      onClick={onClick}
      className="flex items-center h-10 px-4 text-sm font-semibold relative transition-colors rounded-lg bg-green-600 shadow-sm shadow-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="hidden md:block text-white">Create New</span>{' '}
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

export function ViewInventory({ id, onClick }: PropsForID) {
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
    </button>
  );
}

export function QRGeneratorButton ({ id, onClick, onSave }:  {id: number, onClick: (id: number, onSave: () => void) => void, onSave: () => void}) {
  const handleSave = () => {
    onSave()
  }
  
  return (
    <button 
      onClick={() => onClick(id, handleSave)}
      className="p-2 border rounded-md hover:bg-gray-100 shadow-md shadow-black/70"
    >
      <QrCodeIcon className='w-5' />  
    </button>
  )
}

export function UpdateInventory({ id, onClick }: PropsForID) {
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-gray-100 shadow-md shadow-black/70"
    >
      <PencilIcon className="w-5" />
    </button>
  );
}

export function DeleteInventory({ id, onClick }: PropsForID) {
  return (
    <button
      onClick={() => onClick(id)}
      className="p-2 border rounded-md hover:bg-gray-100 shadow-md shadow-black/70"
    >
      <TrashIcon className="w-5" />
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
