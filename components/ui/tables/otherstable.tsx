// components/TabsWithTables.tsx
import { DeliverInentory, SupplyInventory } from '@/lib/definition';
import React, { useEffect, useState } from 'react';
import { AddQTY } from '../buttons';
import AddQTYForm from '../inventory/create-data/AddQTY';
import CustomPagination from '@/components/Pagination';

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
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDeliverPages, setTotalDeliverPages] = useState(1);
  const [currentDeliverPage, setCurrentDeliverPage] = useState(1);

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
      setTotalPages(data.totalPages)
      setCurrentPage(1)
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
        setSupplyRows(transformedRows);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
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
        setTotalDeliverPages(data.totalPages)
        setCurrentDeliverPage(1)
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

  const handleSuppliesPageClick = async (selected: { selected: number }) => {
    try {
      const newPage = selected.selected + 1
      let apiUrlEndpoint;
      let response;
      let data;
      if (newPage > currentPage) {
        
          apiUrlEndpoint = `/api/supplies/?page=${newPage}`;
          response = await fetch(apiUrlEndpoint);
          data = await response.json()
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
          setTotalPages(data.totalPages)
      } else if (newPage < currentPage) {
        apiUrlEndpoint = `/api/supplies/?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
        setSupplies(data.results)

        const transformedRows = data.results.map((supply: SupplyInventory) => 
          [
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
        setTotalPages(data.totalPages)
      }
      setCurrentPage(newPage)
    } catch ( error) {
      console.error('Error fetching inventory data:', error)
    }
    
  };

  const handleDeliverPageClick = async (selected: { selected: number }) => {
    try {
      const newPage = selected.selected + 1
      let apiUrlEndpoint;
      let response;
      let data;
      if (newPage > currentDeliverPage) {
        
          apiUrlEndpoint = `/api/deliver/?page=${newPage}`;
          response = await fetch(apiUrlEndpoint);
          data = await response.json()
          setDelivers(data.results)

          const transformedRows = data.results.map((deliver: DeliverInentory) => [
            deliver.date_acquired,
            deliver.quantity,
            deliver.description,
            deliver.location,
            deliver.name
          ])

          setDeliverRows(transformedRows)
          setTotalDeliverPages(data.totalPages)
          setCurrentDeliverPage(1)
      } else if (newPage < currentDeliverPage) {
        apiUrlEndpoint = `/api/deliver/?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
        setDelivers(data.results)

        const transformedRows = data.results.map((deliver: DeliverInentory) => [
            deliver.date_acquired,
            deliver.quantity,
            deliver.description,
            deliver.location,
            deliver.name
          ])

        setDeliverRows(transformedRows)
        setTotalDeliverPages(data.totalPages)
        setCurrentDeliverPage(1)
      }
      setCurrentDeliverPage(newPage)
    } catch ( error) {
      console.error('Error fetching inventory data:', error)
    }
    
  };
  
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
            
          </tbody>
        </table>
        {isModalOpen && (
          <AddQTYForm onClose={closeModal} onDataSubmitted={handleFormSubmit} id={selectedId} />
        )}
      </div>
      <>
      {activeTab === 0 && supplies?.length !== 0 && supplies !== undefined &&
          <CustomPagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handleSuppliesPageClick}
        />}
      {activeTab === 1 && delivers?.length !== 0 && delivers !== undefined &&
          <CustomPagination
            pageCount={totalDeliverPages}
            currentPage={currentDeliverPage}
            onPageChange={handleDeliverPageClick}
        />}
      </>
    </div>
  );
};