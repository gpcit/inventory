// components/TabsWithTables.tsx
import { NasInventory } from '@/lib/definition';
import React, { useEffect, useState } from 'react';
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { UpdateInventory } from '../buttons';
import EditNasInventory from '../inventory/edit-data/EditNasModal';

interface TabsWithTablesProps {
  onActiveTabChange: (activeTab: number) => void;
  onDataSubmitted: () => void;
}

export default function NasTableInventory ({onDataSubmitted, onActiveTabChange}: TabsWithTablesProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [nasData, setNasData] = useState<NasInventory[]>([])
    const [editModal, setEditModal] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null >(null)
    const [offlineCount, setOfflineCount] = useState(0)
    const [onlineCount, setOnlineCount] = useState(0)

    const tabs = ['NAS'];
    const tables = [
    {
    header: ["Name", "Company", "IP Address", "Mac Address", "Manufacturer", "Model", "Specs", "Location / Area", "Status", "Date Purchased", "Date Installed", "Action"],   
    }, 
    ];
    
    
    
    useEffect(() => {
        const fetchNasData = async () => {
            try {
                const apiUrlEndpoint = `/api/nas/data`
                const data = await fetch(apiUrlEndpoint)
                const result = await data.json()
    
                const nasWithStatus = await Promise.all(result.results.map(async (nas: NasInventory) => {
                    const status = await fetchNasIP(nas.ip_address);
                    return { ...nas, status: status };
                }));
    
                setNasData(nasWithStatus);
    
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        fetchNasData();
    }, [onDataSubmitted]);

    const openEditModal = (id: number) => {
      setSelectedId(id)
      setEditModal(true)
    }
    const closeModal = () => {
      setSelectedId(null)
      setEditModal(false)
    }

    const fetchNasIP = async (ipAddress: string): Promise<boolean> => {
      try {
          const apiUrlEndpoint = `/api/nas?ip=${ipAddress}`;
          const data = await fetch(apiUrlEndpoint);
          const result = await data.json();

          return result.online;
      } catch (error) {
          console.error('Error fetching IP status', error);
          return false;
      }
  };

    const fetchNasData = async () => {
      try {
          const apiUrlEndpoint = `/api/nas/data`
          const data = await fetch(apiUrlEndpoint)
          const result = await data.json()

          const nasWithStatus = await Promise.all(result.results.map(async (nas: NasInventory) => {
              const status = await fetchNasIP(nas.ip_address);
              return { ...nas, status: status };
          }));

          setNasData(nasWithStatus);
          const interval = setInterval(fetchNasData, 1000)
          
      } catch (error) {
          console.error('Error fetching data', error)
      }
    }
    const handleForSubmit = () => {
      fetchNasData()
      closeModal()
    }

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
          {nasData.map((nas, rowIndex) =>(
            <tr key={rowIndex}>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.name}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.company_name}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.ip_address}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.mac_address}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.manufacturer}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.model}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.specs}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.location_area}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                      {nas.status ? (
                        <CheckCircleIcon className="transition ease-in rounded-full w-5 h-5 bg-white text-green-800" />
                      ) : (
                        <XCircleIcon className="transition ease-out rounded-full w-5 h-5 bg-white text-red-800" />
                      )}
                </td>

                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.date_purchased}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                {nas.date_installed}
                </td>
                <td
                className={`px-4 py-2 border-b border-gray-300`}
                >
                <UpdateInventory id={nas.id} onClick={openEditModal} />
                </td>
            </tr>
          ))}
          </tbody>
        </table>
        {editModal && (
          <EditNasInventory id={selectedId} onClose={closeModal} onSubmit={handleForSubmit}/>
        )}
      </div>
      <>
      
      </>
    </div>
  );
};