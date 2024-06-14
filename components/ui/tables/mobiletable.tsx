'use client'
import EditMobileModal from "@/components/ui/inventory/edit-data/EditMobileModal";
import { MobileInventoryList } from "@/lib/definition"
import { useEffect, useState } from "react"
import { QRGeneratorButton, UpdateInventory, DeleteInventory } from "../../../components/ui/buttons";
import CustomPagination from "@/components/Pagination";
import {tableName} from "@/lib/company";
import DeleteMobileModal from "../inventory/delete-data/DeleteMobileInventory";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import ActivityLog from "./activity_log";
import TransferModal from "@/components/TransferModal";

interface MobileInventoryProps {
    getTableName: string,
    onDataSubmitted: () => void;
    triggerValue: string
    inventory_type: string
}

export default function MobileTableInventory ({inventory_type, triggerValue, getTableName, onDataSubmitted}: MobileInventoryProps) {

const [mobileInventory, setMobileInventory] = useState<MobileInventoryList[]>([])
const [selectedId, setSelectedId] = useState<number | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isQRModalOpen, setIsQRModalOpen] = useState(false);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [duplicate, setDuplicate] = useState<MobileInventoryList[]>([])
const [modalData, setModalData] = useState<any>(null)

const getQuery = new URLSearchParams(window.location.search)
const queryValue = getQuery.get('query')
let company = tableName.find(company => company.name === getTableName)?.company || getTableName

const tables = {
  header: ["Assigned To", "Department", "Brand", "Email", "Serial Number", "Number", "Status", "Date Issued", "Action"],
}
const extractEmail = (emailPassword: string | null) => {
  if(!emailPassword) return ''
  const emailMatch = emailPassword.match(/Email:\s*([^\s]+)/i)
  
  return emailMatch ? emailMatch[1] : '';
}
// function for fetching data for Mobile
async function fetchMobile (trigger: string) {
  try {
    let apiUrlEndpoint;
    let response
    let data
    if(queryValue) {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      } else {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }

      const updateData = data.results.map((item: { email_password: string }) => ({
        ...item,
        email: extractEmail(item.email_password)
      }));
      
      setMobileInventory(updateData)
      setTotalPages(data.totalPages);
      setCurrentPage(1);
      
    } else {
        apiUrlEndpoint = trigger === 'active' ? `/api/${getTableName}/cellphones/?page=${currentPage}` : `/api/${getTableName}/cellphones/inactive/?page=${currentPage}`
      }
      response = await fetch(apiUrlEndpoint)
      data = await response.json()

      const updateData = data.results.map((item: { email_password: string; }) => ({
        ...item,
        email: extractEmail(item.email_password)
      }))
      setMobileInventory(updateData);
      setCurrentPage(1);
      setTotalPages(data.totalPages)
    
  } catch (error) {
      console.error('Error fetching data', error)
  }
}
useEffect(() => {
  async function fetchMobileInventory () {
    try {
    let apiUrlEndpoint;
    let response
    let data
    let get_serial
    if(queryValue) {
      if(triggerValue === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      } else {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }
      const updateData = data.results.map((item: { email_password: string; }) => ({
        ...item,
        email: extractEmail(item.email_password)
      }))
        setMobileInventory(updateData)
        setTotalPages(data.totalPages);

      } else {
        if (triggerValue === 'active') {
          apiUrlEndpoint = `/api/${getTableName}/cellphones`;
          response = await fetch(apiUrlEndpoint);
          data = await response.json()
          get_serial = data.data?.map((res: { serial_number: any; }) => res.serial_number)
        } else {
          apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive`
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
          get_serial = data.data?.map((res: { serial_number: any; }) => res.serial_number)
        }
        const updateData = data.results.map((item: { email_password: string; }) => ({
          ...item,
          email: extractEmail(item.email_password)
        }))
        setDuplicate(get_serial)
        setMobileInventory(updateData);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
        
      }
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
    fetchMobileInventory()
}, [getTableName, onDataSubmitted, queryValue, triggerValue ])
console.log("Result of mobileInventory: ", mobileInventory)
// action button for edit
const handleEditSubmit = async () => {
 
  if(triggerValue === 'active') {
    fetchMobile('active')
  } else {
    fetchMobile('inactive')
  }
    closeModal();
    onDataSubmitted()
}
// action button for delete
const handleDeleteSubmit = async () => {
  
  if(triggerValue === 'active') {
    fetchMobile('active')
  } else {
    fetchMobile('inactive')
  }
  closeModal();
}

const closeQrModal = () => {
  setIsQRModalOpen(false);
  setSelectedId(null)
}
const closeEditModal = () => {
  setIsModalOpen(false);
  setSelectedId(null)
}


const closeModal = () => {
  setIsModalOpen(false)
  setIsDeleteModalOpen(false)
  setSelectedId(null)
  setIsQRModalOpen(false)
}

// function for pagination
const handlePageClick = async (selected: { selected: number }) => {
  try {
    const newPage = selected.selected + 1
    let apiUrlEndpoint;
    let response;
    let data;
    if (newPage > currentPage) {
      if(triggerValue === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/cellphones?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      } else {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      }
        const updateData = data.results.map((item: { email_password: string; }) => ({
          ...item,
          email: extractEmail(item.email_password)
        }))
        setMobileInventory(updateData)
        setTotalPages(data.totalPages)
    } else if (newPage < currentPage) {
      if (triggerValue === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/cellphones?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      } else {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive?page=${newPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      }
      const updateData = data.results.map((item: { email_password: string; }) => ({
        ...item,
        email: extractEmail(item.email_password)
      }))
      setMobileInventory(updateData)
    setTotalPages(data.totalPages)
    }
    setCurrentPage(newPage)
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

const handleFormSubmit = () => {
  closeModal();
}
// function for opening QR Modal
const qrModal = async (id: number) => {
  setSelectedId(id)
  setIsQRModalOpen(true)

  console.log("Generate QR Code Button, Getting id: ",selectedId)
  try {
    const res = await fetch (`/api/${getTableName}/cellphones/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    
  } catch (error){
  
  }
}

const viewDetails = async (id: number) => {
  console.log(id)
}
// function for edit Modal
const openModal = async (id: number) => {
  setSelectedId(id)
  setIsModalOpen(true)
  try {
    const res = await fetch (`/api/${getTableName}/cellphones/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    setModalData(data.results[0])
  } catch (error){
    
  }
}
// function for opening a modal confirmation
const openDeleteModal = async (id: number) => {
  setSelectedId(id)
  setIsDeleteModalOpen(true)
  console.log(selectedId)
  try {
    const res = await fetch (`/api/${getTableName}/cellphones/${id}`)
    if(!res.ok){
      throw new Error (`Failed to fetch seleted Data`)
    }
    const data = await res.json()
    setModalData(data.results[0])
  } catch (error){
    
  }
}

  return (  
    <>
    <div className="gap-2">
      <div className="overflow-x-auto sm:p-2">
        <div className="inline-block min-w-full align-middle">
          <div className="p-2 rounded-lg md:pt-0">
            <table className="min-w-full md:table">
              <thead className="text-sm text-left bg-gradient-to-r border-2 border-black from-green-600 text-black rounded">
                <tr className="bg-gradient-to-r ">
                  {tables.header.map((headerItem, index) => (
                    <th key={index} className="px-4 py-2 border-b text-center">
                      {triggerValue === 'active' ? headerItem.replace('Date Returned', 'Date Issued') : headerItem.replace('Date Issued', 'Date Returned')}
                    </th>
                  ))}
                </tr>
              </thead>
      
              <tbody className="bg-white cursor-pointer">
                {mobileInventory?.length === null || mobileInventory?.length === 0 ? (
                  <tr>
                      <td colSpan={9} className="text-center">No data found...</td>
                  </tr>
                ): (
                  <>
                  {mobileInventory?.map((inventory) => (
                    <tr key={inventory.id}
                      className="w-full shadow-sm shadow-gray-700 rounded border-green-500 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:border-t-0"
                    >
                      <td className="py-3 pl-6 pr-3 whitespace-nowrap text-center">
                          <p>{inventory.assigned_to}</p>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {inventory.department}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {inventory.brand}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                      {inventory.email}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {inventory.serial_number}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                      {inventory.number}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap  text-center">
                        <div className="flex justify-center items-center">
                          {inventory.is_active_id === 1 ? <CheckCircleIcon className="rounded-full w-5 h-5  text-green-800"/> : <XCircleIcon className="rounded-full w-5 h-5  text-red-800"/>}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {triggerValue === 'active' && inventory.date_issued}
                        {triggerValue === 'inactive' && inventory.date_returned}
                      </td>
                      <td className="py-3 pl-6 whitespace-nowrap ">
                        <div className="flex justify-center items-center gap-3">
                          <UpdateInventory id={inventory.id} onClick={openModal}/>
      
                          <QRGeneratorButton
                            id={inventory.id}
                            onClick={qrModal}
                            onSave={handleSave}
                          />
                          <DeleteInventory id={inventory.id} onClick={openDeleteModal}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </>
                )}
              </tbody>
            </table>
                  {isQRModalOpen && (
                    <TransferModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleEditSubmit} id={selectedId} tablename={getTableName}/>
                  )}
                  {isModalOpen && (
      
                    <EditMobileModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleEditSubmit} id={selectedId} tablename={getTableName}/>
                  )}
                  {isDeleteModalOpen && (
                    <DeleteMobileModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleDeleteSubmit} id={selectedId} tablename={getTableName} />
                  )}
          </div>
          {mobileInventory?.length !== 0 && mobileInventory !== undefined && !queryValue &&
          <CustomPagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageClick}
          />}
        </div>
        
      </div>
      <div className="w-full border-black border mt-10"></div>
    </div> 
    <div className="p-4 my-2 border rounded-md bg-white justify-center items-center">
        <div className="">
            <h1 className="text-lg">Recent Activity</h1>
            <ActivityLog tablename={inventory_type} originTable={company} onDataSubmitted={handleFormSubmit} />
        </div>
    </div> 
    </>  
  )
}