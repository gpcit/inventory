import { status } from '@/lib/company';
import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTimeout } from 'usehooks-ts';

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  id: number | null;
  tablename: string;
  triggerValue: string
}



const EditInventoryModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [formData, setFormData] = useState({
    pc_name: '',
    name: '',
    mac_address: '' ,
    ip_address: '',
    computer_type: '',
    monitor: '',
    specs: '',
    department: '',
    anydesk: '',
    comment: '',
    supplier: '',
    is_active_id: '',
    date_purchased: '',
    date_installed: ''
  });
  // handle for changing the value in inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || '',
    }));
  };
  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const selectedValue = event.target.value
    setFormData(prevState => ({
      ...prevState,
      is_active_id: selectedValue
    }));
  }

  // handle for getting the specific data in database using the unique id
  useEffect(() => {
    async function fetchInventoryItem() {
      try {
        const res = await fetch(`/api/${tablename}/${id}`);
        if(!res.ok){
          throw new Error('Failed to fetch inventory item')
        }
        const data = await res.json();
        setFormData(data.results[0] )
      } catch(error) {
        console.error('Error fetching inventory item:', error)
      }
    }
    fetchInventoryItem()
  }, [tablename, id])

  // this function to be called upon clicking the save button in edit modal and automaticall save in the database and show in the table
  
  async function updateInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const editInventoryToast = toast.loading('Updating data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const formattedDate = formData.date_purchased ? new Date(formData.date_purchased).toISOString().split('T')[0]: '';
      const putInventory = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pc_name: formData.pc_name,
          name: formData.name,
          mac_address: formData.mac_address,
          ip_address: formData.ip_address,
          computer_type: formData.computer_type,
          specs: formData.specs,
          department: formData.department,
          monitor: formData.monitor,
          anydesk: formData.anydesk,
          comment: formData.comment,
          supplier: formData.supplier,
          is_active_id: formData.is_active_id,
          date_purchased: formattedDate,
          date_installed: formData.date_installed,
          // tableName: gettableName
        }),
      };
      const res = await fetch(`/api/${tablename}/${id}`, putInventory);
      if(!res.ok){
        throw new Error('Failed to update inventory')
      }
      const response = await res.json();
      if (response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            pc_name: '',
            name: '',
            ip_address: '',
            mac_address: '',
            computer_type: '',
            monitor: '',
            specs: '',
            department: '',
            anydesk: '',
            comment: '',
            supplier: '',
            is_active_id: '',
            date_purchased: '',
            date_installed: '',
          });
        onSubmit();
        toast.success('Data has been successfully updated.', {id: editInventoryToast})
        }, 3000)
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast.error('Unable to update the data')
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // console.log('Key pressed: ', event.key)
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-[680px] ">
          <div className="relative grid grid-col md:w-[680px] w-auto bg-white rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between py-3 px-5 border-b border-solid rounded-t border-blueGray-200">
              
            <h3 className="text-xl font-semibold">Edit Inventory</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
            </button>
            
          </div>
          <div className="flex-auto pt-2 px-2">
          <form onSubmit={updateInventory}>
          <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
        
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Name"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Department"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter PC Name"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter IP Address"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Mac Address"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter monitor"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Supplier"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Computer Type"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Anydesk"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter Specs"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Enter comment"
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
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                />
              </div>
              {triggerValue === 'active' ? (
              <div className="mb-4 col-span-3">
                <label htmlFor="date_installed" className="block mb-2 text-sm font-medium">
                  Date Installed
                </label>
                <input
                  type="date"
                  id="date_installed"
                  name="date_installed"
                  value={formData.date_installed}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                />
              </div>
              ): (
              <div className="mb-4 col-span-3">
                <label htmlFor="date_installed" className="block mb-2 text-sm font-medium">
                  Date Pullout
                </label>
                <input
                  type="date"
                  id="date_installed"
                  name="date_installed"
                  value={formData.date_installed}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                />
              </div>
              )}
              
              {/* Status */}
              <div className="mb-4 col-span-3 flex flex-row sm:col-start-5 justify-center items-center">
                <label htmlFor="is_active_id" className="block mb-1 mx-2 text-sm font-semibold">
                  Status:
                </label>
                <select 
                id='is_active_id'
                name='is_active_id'
                value={formData.is_active_id}
                onChange={handleChangeStatus}
                className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md focus:outline-none focus:border-black shadow-md"
                >
                  {status.map((status) => (
                  <option key={status.name} value={status.value}>{status.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end py-2 mt-2">
              <button
                type="submit"
                
                className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
                >
                Save
              </button>
            </div>
            
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;
