'use client'
import EditMobileModal from "@/components/ui/inventory/edit-data/EditMobileModal";
import { MobileInventoryList } from "@/lib/definition"
import { useEffect, useState } from "react"
import { QRGeneratorButton, UpdateInventory, DeleteInventory } from "../../../components/ui/buttons";
import CustomPagination from "@/components/Pagination";
import BarcodeModal from "@/components/QRCodeModal";
import BarcodeMobileModal from "@/components/QRCodeMobileModal";
import {tableName} from "@/lib/company";
import MobileEditModal from "@/components/ModalEditInventory";
import DeleteMobileModal from "../inventory/delete-data/DeleteMobileInventory";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

interface MobileInventoryProps {
    getTableName: string,
    onDataSubmitted: () => void;
    triggerValue: string
}

export default function MobileTableInventory ({triggerValue, getTableName, onDataSubmitted}: MobileInventoryProps) {

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
      setMobileInventory(data.results)
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } else {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/?page=${currentPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      } else {
        apiUrlEndpoint = `/api/${getTableName}/cellphones/inactive/?page=${currentPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      }
      setMobileInventory(data.results);
      setCurrentPage(1);
      setTotalPages(data.totalPages)
    }
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
        setMobileInventory(data.results)
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
        setDuplicate(get_serial)
        setMobileInventory(data.results);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
      }
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
    fetchMobileInventory()
}, [getTableName, onDataSubmitted, queryValue, triggerValue ])

// action button for edit
const handleEditSubmit = async () => {
 
  if(triggerValue === 'active') {
    fetchMobile('active')
    closeEditModal();
    onDataSubmitted()
  } else {
    fetchMobile('inactive')
    closeEditModal();
    onDataSubmitted()
  }
  ;
}
// action button for delete
const handleDeleteSubmit = async () => {
  closeDeleteModal();
  if(triggerValue === 'active') {
    fetchMobile('active')
  } else {
    fetchMobile('inactive')
  }
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
        setMobileInventory(data.results)
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
    setMobileInventory(data.results)
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

const closeQrModal = () => {
  setIsQRModalOpen(false);
  setSelectedId(null)
}
const closeEditModal = () => {
  setIsModalOpen(false);
  setSelectedId(null)
}
const closeDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setSelectedId(null)
}

       return (  
        <div className="overflow-x-auto sm:p-2">
          <div className="inline-block min-w-full align-middle">
            <div className="p-2 rounded-lg md:pt-0">
              <table className="min-w-full md:table">
                <thead className="text-sm text-left bg-black text-white rounded-lg">
                  <tr className="">
                    <th scope="col" className="px-4 py-1 font-extrabold">
                      Assigned To
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold">
                      Department
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold">
                      Brand
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold">
                      IMEI
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold">
                      Serial Number
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold">
                      Number
                    </th>
                    <th scope="col" className="px-3 py-1 font-extrabold text-center">
                      Status
                    </th>
                    {triggerValue === 'active' ? (
                    <th scope="col" className="px-3 py-1 font-extrabold text-center">
                      Date Issued
                    </th>
                    ) : (
                    <th scope="col" className="px-3 py-1 font-extrabold text-center">
                      Date Returned
                    </th>
                    )}
                    <th scope="col" className="py-3 pl-6 pr-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white cursor-pointer">
                  {mobileInventory?.length === null || mobileInventory?.length === 0 ? (
                    <span> No data found... </span>
                  ): (
                    <>
                    {mobileInventory?.map((inventory) => (
                      <tr key={inventory.id}
                        className="w-full shadow-md shadow-gray-700 rounded border-green-500 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-gray-200 hover:border-t-0"
                      >
                        <td className="py-3 pl-6 pr-3 whitespace-nowrap" onClick={() => viewDetails(inventory.id)}>
                            <p>{inventory.assigned_to}</p>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {inventory.department}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {inventory.brand}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                        {inventory.imei?.split("IMEI").map((imei, index) => (
                            index > 0 && (
                                <div key={index}>
                                    IMEI{imei.trim()}
                                </div>
                            )
                        ))}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {inventory.serial_number}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                        {inventory.number}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap ">
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
                      <BarcodeMobileModal modalData={modalData} company={company} tablename={getTableName} id={selectedId} onClose={closeQrModal} />
                    )}
                    {isModalOpen && (
                      
                      <EditMobileModal onClose={closeEditModal} onSubmit={handleEditSubmit} id={selectedId} tablename={getTableName}/>  
                    )}
                    {isDeleteModalOpen && (
                      <DeleteMobileModal onClose={closeDeleteModal} onSubmit={handleDeleteSubmit} id={selectedId} tablename={getTableName} />
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
        )
}