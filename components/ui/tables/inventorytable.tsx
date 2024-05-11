
'use client'
import { ChangeEvent, useEffect, useState } from "react";
import { InventoryList } from "@/lib/definition";
import { DeleteInventory, QRGeneratorButton, UpdateInventory, ViewInventory } from "../buttons";
import  {tableName}  from "@/lib/company";
import EditInventoryModal from "@/components/ui/inventory/edit-data/EditInventoryModal";
import CustomPagination from "@/components/Pagination";
import html2canvas from "html2canvas";
import BarcodeModal from "@/components/QRCodeModal";
import ViewModal from "@/components/ViewInventoryModal";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import DeleteInventoryModal from "../inventory/delete-data/DeleteInventory";

interface GPCInventoryTableProps {
  gettableName: string;
  onDataSubmitted: () => void;
  query: string;
  triggerValue: string
}

export default function GPCInventoryTable ({triggerValue, gettableName, onDataSubmitted, query}:GPCInventoryTableProps){
  const [inventories, setInventories] = useState<InventoryList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [modalData, setModalData] = useState<any>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  
  const getquery = new URLSearchParams(window.location.search)
  const queryvalue = getquery.get('query')
 
  async function fetchInventory(trigger: string){
    try 
    {
      let apiUrlEndpoint;
      let response;
      let data;
        if(trigger === 'active') {
          apiUrlEndpoint = `/api/${gettableName}`;
          response = await fetch(apiUrlEndpoint);
          data = await response.json();
        } else {
          apiUrlEndpoint = `/api/${gettableName}/inactive`;
         response = await fetch(apiUrlEndpoint);
         data = await response.json();
        }
        setInventories(data.results);
        
        console.log(currentPage)
    } catch (error) {
        console.error('Error fetching inventory data:', error);
    }
  }

  // Fetching the data from database
  useEffect(() => {
    async function fetchInventoryData() {
      try {
        let apiUrlEndpoint;
        let response;
        let data;
        if(queryvalue) {
          if(triggerValue === 'active') {
            apiUrlEndpoint = `/api/${gettableName}?query=${queryvalue}`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json();
          } else {
            apiUrlEndpoint = `/api/${gettableName}/inactive/?query=${queryvalue}`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json();
          }
          
          setTotalPages(data.totalPages)
          setInventories(data.results);
          setCurrentPage(1)
        } else {
          if(triggerValue === 'active') {
            apiUrlEndpoint = `/api/${gettableName}`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json();
          } else {
            apiUrlEndpoint = `/api/${gettableName}/inactive`;
            response = await fetch(apiUrlEndpoint);
            data = await response.json();
          }     
          setInventories(data.results);
          setTotalPages(data.totalPages)
          setCurrentPage(1)
        }
        console.log("The current query: ", apiUrlEndpoint)
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    }
    
    fetchInventoryData();
  }, [gettableName, onDataSubmitted, queryvalue, totalPages, triggerValue]);
  
  const handlePageClick = async (selected: { selected: number }) => {
    try {
      const newPage = selected.selected + 1
      
      if (newPage > currentPage) {
      const apiUrlEndpoint = `/api/${gettableName}?page=${newPage}`;
      const response = await fetch(apiUrlEndpoint);
      const data = await response.json()
      setInventories(data.results)
      setTotalPages(data.totalPages)
      } else if (newPage < currentPage) {
      const apiUrlEndpoint = `/api/${gettableName}?page=${newPage}`;
      const response = await fetch(apiUrlEndpoint);
      const data = await response.json()
      setInventories(data.results)
      setTotalPages(data.totalPages)
      }
      setCurrentPage(newPage)
      console.log("result total page",totalPages);
      console.log("result select",currentPage);
    } catch ( error) {
      console.error('Error fetching inventory data:', error)
    }
    
  };

  
  // Getting the specific display name
  let company = tableName.find(company => company.name === gettableName)?.company || gettableName
  // modal for edit
  const openModal = async (id: number) =>{
    setSelectedId(id);
    setIsModalOpen(true);
    // console.log(selectedId)
      try {
        const res = await fetch(`/api/${gettableName}/${id}`)
        if(!res.ok){
          throw new Error('Failed to fetch inventory item');
        }
        const data = await res.json();
        
        setModalData(data.results[0])
      } catch (error){
        console.error('Error fetching inventory item:', error)
      }
  
  }
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }
  const saveBarcodeModalAsImage = async () => {
    if (selectedId && isQRModalOpen) {
        // Wait for the modal to be fully rendered
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Capture the content of the BarcodeModal as an image
        const content = document.getElementById('barcode-modal-content');
        if (content) {
            const canvas = await html2canvas(content);

            // Convert canvas to data URL
            const imageUrl = canvas.toDataURL('image/png');

            // Create a link element to trigger download
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `barcode_modal_${selectedId}.png`;
            link.click();
        }
    }
};
  const closeModal = () => {
      setIsModalOpen(false)
      setIsDeleteModalOpen(false)
      setSelectedId(null)
      setIsQRModalOpen(false);
      setIsViewModalOpen(false)
  }
  
  const qrModal = async (id: number) => {
    setSelectedId(id);
    setIsQRModalOpen(true);
  
    try {
      const res = await fetch(`/api/${gettableName}/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch inventory item');
      }
      const data = await res.json();
      // Make sure to pass necessary arguments if needed
    } catch (error) {
      console.error('Error fetching inventory item:', error);
    }
  };

  const closeQrModal = () => {
    setIsQRModalOpen(false);
    setSelectedId(null)
  }
  
  const handleFormSubmit = async () =>{
    if(triggerValue === 'active') {
      fetchInventory('active')
      onDataSubmitted()
      closeModal();
    } else {
      fetchInventory('inactive')
      onDataSubmitted()
      closeModal();
    }
      

  }
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
    return (  
    <div className="overflow-x-auto sm:p-2">
      <div className="inline-block min-w-full align-middle">
        <div className="py-2 rounded  md:pt-0">
          <table className="min-w-full   md:table">
            <thead className={`text-sm text-left bg-gradient-to-r from-green-600 text-black border-black border rounded`}>
              <tr>
                <th scope="col" className="px-4 py-1  font-extrabold">
                  PC Name
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Mac Address
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Computer Type
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Specs
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Supplier
                </th>
                {triggerValue === 'active' ? (
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Date Installed
                </th>
                ) : (
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Date Pull-out
                </th>
                )}
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Status
                </th>
                <th scope="col" className="py-3 pl-6 pr-3 text-center">
                  Action
                </th>
                
              </tr>
            </thead>
            <tbody className="bg-white ">
              {inventories.length === null || inventories.length === 0? (
                <tr>
                  <td colSpan={8} className="text-center">No data found...</td>  
                </tr>
              ) : (
                <>
              {inventories?.map((inventory) => (
                <tr key={inventory.id}
                  className="w-full shadow-md shadow-gray-700 rounded border-green-500 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg  hover:bg-gray-200 hover:border-t-0"
                >
                  <td className=" pl-6 pr-3 whitespace-nowrap relative cursor-pointer">
                    <div className="flex items-center gap-3">
                      <p>{inventory.pc_name}</p>
                      
                    </div>
                  </td>
                  <td className="px-3  whitespace-nowrap">
                    {inventory.mac_address}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {inventory.computer_type}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {inventory.specs?.split(",").map((specs, index) => (
                      index >= 0 && (
                        <div key={index}>
                          {specs.trim()}
                        </div>
                      )
                    ))}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {inventory.supplier}
                  </td>
                  
                  <td className="px-3 py-3 whitespace-nowrap">
                    {triggerValue === 'active' ? inventory.date_installed : inventory.date_pullout}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {inventory.is_active_id === 1 ?
                      <CheckCircleIcon className="rounded-full w-5 h-5 bg-white text-green-800"/>
                      :
                      <XCircleIcon className="rounded-full w-5 h-5 bg-white text-red-800"/>
                      }
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3 edit-button">
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
         
          {isModalOpen && (
                        <EditInventoryModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={gettableName}/>
                    )} 
          {isDeleteModalOpen && (
                        <DeleteInventoryModal onSubmit={handleFormSubmit} onClose={closeModal} id={selectedId} tablename={gettableName}/>
          )} 
          {isQRModalOpen && (
                      <BarcodeModal modalData={modalData} tablename={gettableName} id={selectedId} onClose={closeQrModal} company={company}/>
                    )}

        </div>
        {!queryvalue && totalPages > 0 &&
        <CustomPagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />   }
      </div>
    </div>     
    )
}


