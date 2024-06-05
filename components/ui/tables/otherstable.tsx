// components/TabsWithTables.tsx
import { DeliverInentory, SupplyInventory } from '@/lib/definition';
import React, { useEffect, useState } from 'react';
import { AddQTY } from '../buttons';
import AddQTYForm from '../inventory/create-data/AddQTY';

interface TabsWithTablesProps {
  onActiveTabChange: (activeTab: number) => void;
  onDataSubmitted: () => void;
}

export default function TabsWithTables ({onDataSubmitted, onActiveTabChange}: TabsWithTablesProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [supplies, setSupplies] = useState<SupplyInventory[]>([])
  const [delivers, setDelivers] = useState<DeliverInentory[]>([])
  const [supplyRows, setSupplyRows] = useState<string[][]>([])
  const [deliverRows, setDeliverRows] = useState<string[][]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null)

  const tabs = ['Supplies', 'Delivered', 'Returned'];
  const tables = [
    {
        header: ["ReOrder (Yes/No)","Item No", "Item Name", "Manufacturer", "Description", "Cost Item", "Stock (QTY)", "Inventory Value", "Reorder Level", "Days Per Reorder", "Item Reorder (QTY)", "Item Discontinued?"],
        rows: supplyRows,
        
    }, 
    {
      header: ['Date Acquired', 'Quantity', 'Description', 'Location', 'Name'],
      row: deliverRows,
    },
    {
      header: [],
      row: [],
    },
  ];
  useEffect(() => {
    onActiveTabChange(activeTab);
  }, [activeTab, onActiveTabChange])

  const fetchSupplies = async () => {
    try {
      const apiUrlEndpoint = `/api/supplies`
      const supply = await fetch(apiUrlEndpoint)
      const data = await supply.json()
      setSupplies(data.results)

      const transformedRows = data.results.map((supply: SupplyInventory) => [
        supply.stock_quantity < supply.reorder_level ? 'Yes' : 'No',
        supply.item_no,
        supply.name,
        supply.manufacturer,
        supply.description,
        `₱ ${supply.cost_per_item}`,
        supply.stock_quantity,
        `₱ ${supply.cost_per_item * supply.stock_quantity}`,
        supply.reorder_level,
        supply.days_per_reorder,
        supply.item_reorder_quantity,
        supply.item_discontinued,
      ])
      setSupplyRows(transformedRows)
    } catch (error) {
      console.error('Error fetching data', error)
    }
  }

  const handleFormSubmit = async () => {
    await fetchSupplies()
    closeModal()
  }

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const apiUrlEndpoint = `/api/supplies`
        const supply = await fetch(apiUrlEndpoint)
        const data = await supply.json()
        setSupplies(data.results)

        const transformedRows = data.results.map((supply: SupplyInventory) => [
          supply.stock_quantity < supply.reorder_level ? 'Yes' : 'No',
          supply.item_no,
          supply.name,
          supply.manufacturer,
          supply.description,
          `₱ ${supply.cost_per_item}`,
          supply.stock_quantity,
          `₱ ${supply.cost_per_item * supply.stock_quantity}`,
          supply.reorder_level,
          supply.days_per_reorder,
          supply.item_reorder_quantity,
          supply.item_discontinued,
        ])
        setSupplyRows(transformedRows)
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }
    fetchSupplies()
  }, [onDataSubmitted])

  const openModal = async (id: number) => {
    setSelectedId(id)
    setIsModalOpen(true)
    try {
      const res = await fetch (`/api/supplies/${id}`)
      if(!res.ok){
        throw new Error (`Failed to fetch seleted Data`)
      }
      const data = await res.json()
      setModalData(data.results[0])
    } catch (error){
      
    }
  }

  useEffect(() => {
    const fetchDeliver = async () => {
      try {
        const apiUrlEndpoint = `/api/deliver`
        const deliver = await fetch(apiUrlEndpoint)
        const data = await deliver.json()

        setDelivers(data.results)

        const transformedRows = data.results.map((deliver: DeliverInentory) => [
          deliver.date_acquired,
          deliver.quantity,
          deliver.description,
          deliver.location,
          deliver.name
        ])
        setDeliverRows(transformedRows)
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }
    fetchDeliver()
  }, [onDataSubmitted])

const closeModal = () => {
    setIsModalOpen(false)
    //setIsDeleteModalOpen(false)
    setSelectedId(null)
   // setIsQRModalOpen(false)
}
  
  return (
    <div className="w-full mx-auto p-2">
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
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
          {activeTab === 0 && (
            supplies.map((supply, rowIndex) => (
              <tr key={rowIndex} className={supply.stock_quantity <= 0 ? 'bg-red-300' : ''}>
                {[
                  supply.stock_quantity < supply.reorder_level ? 'Yes' : 'No',
                  supply.item_no,
                  supply.name,
                  supply.manufacturer,
                  supply.description,
                  `₱ ${supply.cost_per_item}`,
                  <>
                  <div className='grid grid-cols-3 gap-2 mx-auto items-center'>
                    <div>
                      {supply.stock_quantity}
                    </div>
                    <div className='flex items-end'>
                      <AddQTY id={supply.id} onClick={openModal} />
                    </div>
                  </div>
                  </>
                  ,
                  `₱ ${supply.cost_per_item * supply.stock_quantity}`,
                  supply.reorder_level,
                  supply.days_per_reorder,
                  supply.item_reorder_quantity,
                  supply.item_discontinued,
                ].map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 border-b border-gray-300`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}

          {activeTab === 1 && (
            deliverRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 border-b border-gray-300 `}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}

            {/* {activeTab === 0 ? (
              <>
              {supplies?.map((supply) => (
                <tr key={supply.id} >
                  <td className='text-left px-4 py-2'>
                    {supply.stock_quantity < supply.reorder_level ? 'Yes' : 'No'}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.item_no}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.name}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.manufacturer}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.description}
                  </td>
                  <td className='text-left px-4 py-2'>
                    ₱ {supply.cost_per_item}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.stock_quantity}
                  </td>
                  <td className='text-left px-4 py-2'>
                    ₱ {supply.cost_per_item * supply.stock_quantity}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.reorder_level}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.days_per_reorder}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.item_reorder_quantity}
                  </td>
                  <td className='text-left px-4 py-2'>
                    {supply.item_discontinued}
                  </td>
                </tr>
              ))}
              </>  
            ) : (
              <>
              {supplies?.map((supply, index) => (
                <tr key={index}>
                  <td>
                    {supply.name}
                  </td>
                </tr>
              ))}
              </>
            )} */}
            
          </tbody>
        </table>
        {isModalOpen && (
          <AddQTYForm onClose={closeModal} onDataSubmitted={handleFormSubmit} id={selectedId} />
        )}
      </div>
    </div>
  );
};