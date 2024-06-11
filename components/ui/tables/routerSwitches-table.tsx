// components/TabsWithTables.tsx
import { DeliverInventory, ReturnInventory, SupplyInventory } from '@/lib/definition';
import React, { useEffect, useState } from 'react';
import { AddQTY, ReturnUnit } from '../buttons';
import AddQTYForm from '../inventory/create-data/AddQTY';
import CustomPagination from '@/components/Pagination';
import { Undo2 } from 'lucide-react';
import ReturnSupply from '../inventory/edit-data/ReturnSupply';

interface TabsWithTablesProps {
  onActiveTabChange: (activeTab: number) => void;
  onDataSubmitted: () => void;
}

export default function RouterSwitchesInventory ({onDataSubmitted, onActiveTabChange}: TabsWithTablesProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [supplies, setSupplies] = useState<SupplyInventory[]>([])
  const [delivers, setDelivers] = useState<DeliverInventory[]>([])
  const [returned, setReturned] = useState<ReturnInventory[]>([])
  const [supplyRows, setSupplyRows] = useState<string[][]>([])
  const [deliverRows, setDeliverRows] = useState<string[][]>([])
  const [returnRows, setReturnRows] = useState<string[][]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(false)
  const [totalPages, setTotalPages] = useState(1);
  const [totalReturnPages, setTotalReturnPages] = useState(1);
  const [supplyPages, setSupplyPages] = useState(1);
  const [currentReturnPage, setCurrentReturnPage] = useState(1);
  const [totalDeliverPages, setTotalDeliverPages] = useState(1);
  const [currentDeliverPage, setCurrentDeliverPage] = useState(1);
  const [returnId, setReturnId] = useState<number | null>(null)

  const tabs = ['Router', 'Switches', 'NAS'];
  const tables = [
    {
    header: ["ReOrder (Yes/No)","Item No", "Item Name", "Manufacturer", "Description", "Cost Item", "Stock (QTY)", "Inventory Value", "Reorder Level", "Days Per Reorder", "Item Reorder (QTY)", "Item Discontinued?"],
        
        
    }, 
    {
    header: ['Date Acquired', 'Quantity', 'Item Name', 'Description', 'Location', 'Name', 'Action'],
       
    },
    {
    header: ['Item Name', 'Item Description', 'Quantity', 'Name', 'Date Returned'],
      
    },
  ];

  
  return (
    <div className="w-full p-2">
      <div className="flex border-b border-gray-300 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 focus:outline-none ${
              activeTab === index
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto ">
        <table className={`${activeTab < 3 ? 'w-full' : '' }  bg-white border border-gray-300`}>
          <thead>
            <tr>
              {tables[activeTab].header.map((headerItem, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b border-gray-300 bg-gray-100 text-left"
                >
                  {headerItem}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          <>
          </>
            
          </tbody>
        </table>
        {}
      </div>
      <>
      
      </>
    </div>
  );
};