'use client'
import EditAccountModal from "../inventory/edit-data/EditAccountModal";
import { ServerAccountsInventory } from "@/lib/definition"
import { useEffect, useState } from "react"
import { DeleteInventory, UpdateInventory } from "../buttons";
import CustomPagination from "@/components/Pagination";
import {tableName} from "@/lib/company";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import DeleteAccountModal from "../inventory/delete-data/DeleteAccountInventory";

interface AccountInventoryProps {
    getTableName: string,
    onDataSubmitted: () => void;
    triggerValue: string;
}

export default function AccountTableInventory ({triggerValue, getTableName, onDataSubmitted}: AccountInventoryProps) {

const [accountInventories, setAccountInventories] = useState<ServerAccountsInventory[]>([])
const [selectedId, setSelectedId] = useState<number | null>(null)
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [modalData, setModalData] = useState<any>(null)

const getQuery = new URLSearchParams(window.location.search)
const queryValue = getQuery.get('query')
let company = tableName.find(company => company.name === getTableName)?.company || getTableName

async function fetchAccount(trigger: string) {
  try {
    let apiUrlEndpoint;
    let response;
    let data;
    if(queryValue) {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/accounts/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      } else {
        apiUrlEndpoint = `/api/${getTableName}/accounts/inactive/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }
      setAccountInventories(data.results)
      setCurrentPage(1);
      setTotalPages(data.totalPages);
    } else {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/accounts/?page=${currentPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      } else {
        apiUrlEndpoint = `/api/${getTableName}/accounts/inactive/?page=${currentPage}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }
      setAccountInventories(data.results);
      setCurrentPage(1);
      setTotalPages(data.totalPages)
    }
  } catch (error) {
      console.error('Error fetching data', error)
  }
}
useEffect(() => {
  async function fetchAccountInventory () {
    try {
      let apiUrlEndpoint;
      let response;
      let data;
      if(queryValue) {
        if(triggerValue === 'active') {
          apiUrlEndpoint = `/api/${getTableName}/accounts/?query=${queryValue}`
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
        } else {
          apiUrlEndpoint = `/api/${getTableName}/accounts/inactive/?query=${queryValue}`
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
        }
        setAccountInventories(data.results)
        setTotalPages(data.totalPages);
      } else {
          if(triggerValue === 'active') {
            apiUrlEndpoint = `/api/${getTableName}/accounts`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json()
          } else {
            apiUrlEndpoint = `/api/${getTableName}/accounts/inactive`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json()
          }
        setAccountInventories(data.results);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
      }
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
  fetchAccountInventory()
}, [getTableName, onDataSubmitted, queryValue, triggerValue])

const handleFormSubmit = async () => {
  if(triggerValue === 'active') {
    fetchAccount('active');
    closeModal();
    onDataSubmitted()
  } else {
    fetchAccount('inactive')
    onDataSubmitted()
    closeModal();
  }
  console.log("Result after submiting update on edit: ", getTableName)
  console.log("Result after submiting update on edit accountInventories: ", accountInventories)
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


const openEditModal = async (id: number) => {
  setSelectedId(id)
  setIsEditModalOpen(true)
  try {
    const res = await fetch (`/api/${getTableName}/accounts/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    setModalData(data.results[0])
  } catch (error){
    console.error('Internal Error', error)
  }
}

const openDeleteModal = async (id: number) => {
  setSelectedId(id)
  setIsDeleteModalOpen(true)
  try {
    const res = await fetch (`/api/${getTableName}/accounts/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    setModalData(data.results[0])
  } catch (error){
    console.error('Internal Error', error)
  }
}

const closeQrModal = () => {
  setSelectedId(null)
}
const closeModal = () => {
  setIsEditModalOpen(false);
  setIsDeleteModalOpen(false)
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
            <tbody className="bg-white ">
              {accountInventories?.length === 0 ? (
                <div className=""><span className=""> No data found... </span></div>
              ) : (
                <>
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
                      <div className="flex items-center justify-center gap-3">
                        <UpdateInventory id={accounts.id} onClick={openEditModal}/>
                        <DeleteInventory id={accounts.id} onClick={openDeleteModal}/>
                      </div>
                    </td>
                  </tr>
                ))}
                </>
              )}
            </tbody>
             
           
          </table>
         
            {isEditModalOpen && (
              <EditAccountModal onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
            )} 
            {isDeleteModalOpen && (
              <DeleteAccountModal onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
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