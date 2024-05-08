'use client'
import EditAccountModal from "../inventory/edit-data/EditAccountModal";
import { ServerAccountsInventory } from "@/lib/definition"
import { useEffect, useState } from "react"
import { UpdateAccountInventory } from "../buttons";
import CustomPagination from "@/components/Pagination";
import {tableName} from "@/lib/company";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface AccountInventoryProps {
    getTableName: string,
    onDataSubmitted: () => void;
}

export default function AccountTableInventory ({getTableName, onDataSubmitted}: AccountInventoryProps) {

const [accountInventories, setAccountInventories] = useState<ServerAccountsInventory[]>([])
const [selectedId, setSelectedId] = useState<number | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [modalData, setModalData] = useState<any>(null)

const getQuery = new URLSearchParams(window.location.search)
const queryValue = getQuery.get('query')
let company = tableName.find(company => company.name === getTableName)?.company || getTableName

// async function fetchMobile () {
//   try {
//     if(queryValue) {
//       const apiUrlEndpoint = `/api/${getTableName}/accounts/?query=${queryValue}`
//       const response = await fetch(apiUrlEndpoint);
//       const data = await response.json();
//       setAccountInventories(data.results)
//       setTotalPages(data.totalPages);
//     } else {
//       const apiUrlEndpoint = `/api/${getTableName}/accounts/?page=${currentPage}`;
//       const response = await fetch(apiUrlEndpoint);
//       const data = await response.json()
      
//       setAccountInventories(data.results);
//       setCurrentPage(1);
//       setTotalPages(data.totalPages)
//     }
//   } catch (error) {
//       console.error('Error fetching data', error)
//   }
// }
useEffect(() => {
  async function fetchAccountInventory () {
    try {
      if(queryValue) {
        const apiUrlEndpoint = `/api/${getTableName}/accounts/?query=${queryValue}`
        const response = await fetch(apiUrlEndpoint);
        const data = await response.json();
        setAccountInventories(data.results)
        setTotalPages(data.totalPages);
      } else {
        const apiUrlEndpoint = `/api/${getTableName}/accounts`;
        const response = await fetch(apiUrlEndpoint);
        const data = await response.json()
        setAccountInventories(data.results);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
      }
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
  fetchAccountInventory()
}, [getTableName, onDataSubmitted, queryValue])
const handleFormSubmit = async () => {
  closeModal();
  // fetchMobile();
}

const handlePageClick = async (selected: { selected: number }) => {
  try {
    const newPage = selected.selected + 1
    
    if (newPage > currentPage) {
    const apiUrlEndpoint = `/api/${getTableName}/cellphones?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setAccountInventories(data.results)
    setTotalPages(data.totalPages)
    } else if (newPage < currentPage) {
    const apiUrlEndpoint = `/api/${getTableName}/cellphones?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setAccountInventories(data.results)
    setTotalPages(data.totalPages)
    }
    setCurrentPage(newPage)
    console.log("result total page",totalPages);
    console.log("result select",currentPage);
  } catch ( error) {
    console.error('Error fetching inventory data:', error)
  }
  
};

const handleSave = async () => {
  try {
      // Call any necessary functions or perform any actions here
      console.log("Saving data...");
      // Once everything is saved, close the QR modal
      closeQrModal();
  } catch (error) {
      console.error('Error saving data:', error);
  }
}


const openModal = async (id: number) => {
  setSelectedId(id)
  setIsModalOpen(true)
  try {
    const res = await fetch (`/api/${getTableName}/accounts/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    setModalData(data.results[0])
  } catch (error){
    
  }
}

const closeQrModal = () => {
  setSelectedId(null)
}
const closeModal = () => {
  setIsModalOpen(false);
  setSelectedId(null)
}
    return (  
    <div className="overflow-x-auto sm:p-2">
      <div className="inline-block min-w-full align-middle">
        <div className="p-2 rounded  md:pt-0">
          <table className="min-w-full   md:table">
            <thead className="text-sm text-left bg-black text-white border rounded-lg">
              <tr>
                <th scope="col" className="px-4 py-1  font-extrabold">
                  Name
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Department
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Username
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Password
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold text-center">
                  Status
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold text-center">
                  Notes
                </th>
                <th scope="col" className="py-3 pl-6 pr-3 text-center">
                  Action
                </th>
                
              </tr>
            </thead>
            {(accountInventories?.length === null || accountInventories?.length === 0) ? (
                <div className=""><span className=""> No data found... </span></div>
              ) : (
                <>
            <tbody className="bg-white ">
              
              {accountInventories?.map((accounts) => (
                <tr key={accounts.id}
                  className="w-full shadow-md shadow-gray-700 rounded text-sm   hover:bg-gray-200 hover:border-t-0"
                >
                  <td className=" pl-6 pr-3 whitespace-nowrap relative cursor-pointer">
                    <div className="flex items-center gap-3">
                      <p>{accounts.name} </p>
                      
                    </div>
                  </td>
                  <td className="px-3  whitespace-nowrap">
                    {accounts.department}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {accounts.username}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    **********
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                        {accounts.is_active_id === 1 ? <CheckCircleIcon className="rounded-full w-5 h-5 bg-white text-green-800"/> : <XCircleIcon className="rounded-full w-5 h-5 bg-white text-red-800"/>}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">{accounts.notes}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center edit-button">
                      <UpdateAccountInventory id={accounts.id} onClick={openModal}/>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
              </>
            )}
           
          </table>
         
          {isModalOpen && (
                        <EditAccountModal onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
                    )} 

        </div>
        {!queryValue && totalPages > 0 &&
        <CustomPagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />}
      </div>
    </div>     
    )
}