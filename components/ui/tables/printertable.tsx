'use client'
import EditPrinterModal from "../inventory/edit-data/EditPrinterModal";
import { PrinterInventoryList } from "@/lib/definition"
import { useEffect, useState } from "react"
import { DeleteInventory, UpdateInventory } from "../buttons";
import CustomPagination from "@/components/Pagination";
import {tableName} from "@/lib/company";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import DeletePrinterModal from "../inventory/delete-data/DeletePrinterInventory";
import ActivityLog from "./activity_log";

interface PrinterInventoryProps {
    getTableName: string,
    onDataSubmitted: () => void;
    triggerValue: string;
}

export default function PrinterTableInventory ({triggerValue, getTableName, onDataSubmitted}: PrinterInventoryProps) {

const [printerInventories, setPrinterInventories] = useState<PrinterInventoryList[]>([])
const [selectedId, setSelectedId] = useState<number | null>(null)
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [modalData, setModalData] = useState<any>(null)

const getQuery = new URLSearchParams(window.location.search)
const queryValue = getQuery.get('query')
let company = tableName.find(company => company.name === getTableName)?.displayName || getTableName



async function fetchPrinter(trigger: string) {
  try {
    let apiUrlEndpoint;
    let response;
    let data;
    if(queryValue) {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/printer/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      } else {
        apiUrlEndpoint = `/api/${getTableName}/printer/inactive/?query=${queryValue}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }
      setPrinterInventories(data.results)
      setCurrentPage(1);
      setTotalPages(data.totalPages);
    } else {
      if(trigger === 'active') {
        apiUrlEndpoint = `/api/${getTableName}/printers/?page=${currentPage}`;
        response = await fetch(apiUrlEndpoint);
        data = await response.json()
      } else {
        apiUrlEndpoint = `/api/${getTableName}/printers/inactive/?page=${currentPage}`
        response = await fetch(apiUrlEndpoint);
        data = await response.json();
      }
      setPrinterInventories(data.results);
      setCurrentPage(1);
      setTotalPages(data.totalPages)
    }
  } catch (error) {
      console.error('Error fetching data', error)
  }
}
useEffect(() => {
  async function fetchPrinterInventory () {
    try {
      let apiUrlEndpoint;
      let response;
      let data;
      if(queryValue) {
        if(triggerValue === 'active') {
          apiUrlEndpoint = `/api/${getTableName}/printers/?query=${queryValue}`
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
        } else {
          apiUrlEndpoint = `/api/${getTableName}/printers/inactive/?query=${queryValue}`
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
        }
        setPrinterInventories(data.results)
        setTotalPages(data.totalPages);
      } else {
          if(triggerValue === 'active') {
            apiUrlEndpoint = `/api/${getTableName}/printers`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json()
          } else {
            apiUrlEndpoint = `/api/${getTableName}/printers/inactive`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json()
          }
          setPrinterInventories(data.results);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
      }
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
  fetchPrinterInventory()
}, [getTableName, onDataSubmitted, queryValue, triggerValue])

const handleFormSubmit = async () => {
  if(triggerValue === 'active') {
    fetchPrinter('active');
    closeModal();
    onDataSubmitted()
  } else {
    fetchPrinter('inactive')
    onDataSubmitted()
    closeModal();
  }
  console.log("Result after submiting update on edit: ", getTableName)
  console.log("Result after submiting update on edit accountInventories: ", printerInventories)
}



const handlePageClick = async (selected: { selected: number }) => {
  try {
    const newPage = selected.selected + 1
    
    if (newPage > currentPage) {
    const apiUrlEndpoint = `/api/${getTableName}/printers?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setPrinterInventories(data.results)
    setTotalPages(data.totalPages)
    } else if (newPage < currentPage) {
    const apiUrlEndpoint = `/api/${getTableName}/printers?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setPrinterInventories(data.results)
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


const openEdit = async (id: number) => {
  setSelectedId(id)
  setIsEditModalOpen(true)
  try {
    const res = await fetch (`/api/${getTableName}/printers/${id}`)
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
    const res = await fetch (`/api/${getTableName}/printers/${id}`)
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
            <thead className="text-sm text-left bg-gradient-to-r  from-green-600 text-black border rounded-lg border-black">
              <tr>
                <th scope="col" className="px-4 py-1  font-extrabold">
                  Printer Name
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Department
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Assigned To
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Manufacturer
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Model
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Serial Number
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold text-center">
                  Status
                </th>
                <th scope="col" className="py-3 pl-6 pr-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white ">
              {printerInventories?.length === 0 ? (
                <tr className="">
                  <td colSpan={8} className="text-center"> No data found... </td>
                </tr>
              ) : (
                <>
                {printerInventories?.map((printer) => (
                  <tr key={printer.id}
                    className="w-full shadow-md shadow-gray-700 rounded text-sm hover:border-t-0"
                  >
                    <td className=" pl-6 pr-3 whitespace-nowrap relative cursor-pointer">
                      <div className="flex items-center gap-3">
                        <p>{printer.printer_name} </p>
                      </div>
                    </td>
                    <td className="px-3  whitespace-nowrap">
                      {printer.department}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {printer.assigned_to}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {printer.manufacturer}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {printer.model}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {printer.serial_number}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                          {printer.is_active_id === 1 ? <CheckCircleIcon className="rounded-full w-5 h-5 bg-white text-green-800"/> : <XCircleIcon className="rounded-full w-5 h-5 bg-white text-red-800"/>}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <UpdateInventory id={printer.id} onClick={openEdit}/>
                        <DeleteInventory id={printer.id} onClick={openDeleteModal}/>
                      </div>
                    </td>
                  </tr>
                ))}
                </>
              )}
            </tbody>
             
           
          </table>
         
            {isEditModalOpen && (
              <EditPrinterModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
            )} 
            {isDeleteModalOpen && (
              <DeletePrinterModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
            )} 

        </div>
        {!queryValue && totalPages > 0 &&
        <CustomPagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />}
      </div>
      <div className="w-full border-black border mt-10"></div>
        <div className="p-4 my-2 border rounded-md bg-white">
            <div className="">
                <h1 className="text-lg">Recent Activity</h1>
                <ActivityLog tablename={getTableName} originTable={company} onDataSubmitted={handleFormSubmit} />
            </div>
        </div>
    </div>     
    )
}