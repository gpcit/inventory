import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTimeout } from 'usehooks-ts';

interface ModalProps {
  onClose: () => void;
  id: number | null;
  tablename: string;
}



const ViewModal: React.FC<ModalProps> = ({onClose, tablename, id}) => {
  const [formData, setFormData] = useState({
    pc_name: '',
    name: '',
    mac_address: '',
    ip_address: '',
    computer_type: '',
    monitor: '',
    specs: '',
    department: '',
    anydesk: '',
    comment: '',
    supplier: '',
    date_purchased: '',
    date_installed: ''
  });
  // handle for changing the value in inputs
 
  // handle for getting the specific data in database using the unique id
  
  useEffect(() => {
    async function fetchInventoryItem() {
      try {
        const res = await fetch(`/api/${tablename}/${id}`);
        if(!res.ok){
          throw new Error('Failed to fetch inventory item')
        }
        const data = await res.json();
        
        setFormData(data.results[0])
      } catch(error) {
        console.error('Error fetching inventory item:', error)
      }
    }
    fetchInventoryItem()
  }, [tablename, id])

  // this function to be called upon clicking the save button in edit modal and automaticall save in the database and show in the table
  
  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed: ', event.key)
      if(event.key === 'Escape'){
        onClose()
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    };
  }, [onClose])
  
  return (
    <div className="fixed inset-0 z-50 bg-black  bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-[680px] ">
          <div className="relative grid grid-col md:w-[680px] w-auto bg-white rounded-md shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-4 border-b-2 border-dashed rounded-t">
                <h3 className="text-xl font-semibold">View details</h3>
                <button
                className="float-right ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                onClick={onClose}
                >
                <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
                </button>
            </div>
          <div className="flex-auto py-3 px-2">
            <form className=''>
                <div className="p-4 rounded-md grid grid-cols-6 border-2  shadow-2xl mx-2 gap-1 bg-[#fffff1]">
                    {/* Name */}
                    <div className="mb-4 col-span-4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Name
                        </label>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-50 text-black shadow-md"
                        placeholder="Enter Name"
                        disabled
                        />
                    </div>

                    {/* Department */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="department" className="block mb-2 text-sm font-medium">
                        Department
                        </label>
                        <input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Department"
                        disabled
                        />
                    </div>

                    {/* PC Name */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="pc_name" className="block mb-2 text-sm font-medium">
                        PC Name
                        </label>
                        <input
                        type="text"
                        id="pc_name"
                        name="pc_name"
                        value={formData.pc_name}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter PC Name"
                        disabled
                        />
                    </div>

                    {/* IP Address */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="ip_address" className="block mb-2 text-sm font-medium">
                        IP Address
                        </label>
                        <input
                        type="text"
                        id="ip_address"
                        name="ip_address"
                        value={formData.ip_address}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter IP Address"
                        disabled
                        />
                    </div>
                    {/* Mac Address */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="mac_address" className="block mb-2 text-sm font-medium">
                        Mac Address
                        </label>
                        <input
                        type="text"
                        id="mac_address"
                        name="mac_address"
                        value={formData.mac_address}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Mac Address"
                        disabled
                        />
                    </div>
                    {/* Monitor */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="monitor" className="block mb-2 text-sm font-medium">
                        Monitor
                        </label>
                        <input
                        type="text"
                        id="monitor"
                        name="monitor"
                        value={formData.monitor}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter monitor"
                        disabled
                        />
                    </div>
                    
                    {/* Supplier */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="supplier" className="block mb-2 text-sm font-medium">
                        Supplier
                        </label>
                        <input
                        type="text"
                        id="supplier"
                        name="supplier"
                        value={formData.supplier}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Supplier"
                        disabled
                        />
                    </div>
                    {/* Computer Type */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="computer_type" className="block mb-2 text-sm font-medium">
                        Computer Type
                        </label>
                        <input
                        type="text"
                        id="computer_type"
                        name="computer_type"
                        value={formData.computer_type}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Computer Type"
                        disabled
                        />
                    </div>

                    {/* Anydesk */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="anydesk" className="block mb-2 text-sm font-medium">
                        Anydesk
                        </label>
                        <textarea
                        id="anydesk"
                        name="anydesk"
                        value={formData.anydesk}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Anydesk"
                        disabled
                        />
                    </div>
                    {/* Specs */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="specs" className="block mb-2 text-sm font-medium">
                        Specs
                        </label>
                        <textarea
                        id="specs"
                        name="specs"
                        value={formData.specs}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter Specs"
                        disabled
                        />
                    </div>
                    {/* Comment */}
                    <div className="mb-4 col-span-2">
                        <label htmlFor="comment" className="block mb-2 text-sm font-medium">
                        Comment
                        </label>
                        <textarea
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        placeholder="Enter comment"
                        disabled
                        />
                    </div>
                    {/* Date Purchased */}
                    <div className="mb-4 col-span-3">
                        <label htmlFor="date_purchased" className="block mb-2 text-sm font-medium">
                        Date Purchased
                        </label>
                        <input
                        type="date"
                        id="date_purchased"
                        name="date_purchased"
                        value={formData.date_purchased}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        disabled
                        />
                    </div>

                    {/* Date Purchased */}
                    <div className="mb-4 col-span-3">
                        <label htmlFor="date_installed" className="block mb-2 text-sm font-medium">
                        Date Installed
                        </label>
                        <input
                        type="date"
                        id="date_installed"
                        name="date_installed"
                        value={formData.date_installed}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none text-opacity-30 text-black shadow-md"
                        disabled
                        />
                    </div>
                </div>
                {/* <div className="flex justify-end py-2 mt-2">
                <button
                    type="submit"
                    
                    className=" flex items-center justify-center h-10 px-4 text-sm font-medium text-black transition-colors border-4  "
                    disabled
                    >
                    View Only
                </button>
                </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
