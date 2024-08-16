import { accountTables, status } from '@/lib/company';
import { getSession } from 'next-auth/react';
import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TransferDropdown from '../../dropdowns/transferDropdown';
import { usePathname } from 'next/navigation';

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  id: number | null;
  tablename: string;
  triggerValue: string;
}



const TransferComputerModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [formData, setFormData] = useState({pc_name: '',
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
    date_installed: '',
    date_pullout: '',
  });
  const [tableName, setTableName] = useState<string>("")
  const [value, setValue] = useState<string>("")

  const fromCompany = accountTables[tablename] || ""
  const toCompany = accountTables[value] || ""

  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })
  const pathname = usePathname();
  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if(session){
        setUserDetails({ userId: session?.user?.uid, userName: session?.user?.username})
      }
    }
    fetchUserDetails()
  }, [])
  // handle for changing the value in inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  // handle for getting the specific data in database using the unique id
  
  useEffect(() => {
    async function fetchInventoryItem() {
      try {
        const res = await fetch(`/api/${tablename}${pathname}/transfer/${id}`);
        console.log("Result res:", res)
        if(!res.ok){
          throw new Error('Failed to fetch inventory item')
        }
        const data = await res.json();
        console.log("Result for formData: ", res)
        setFormData(data.results[0])
      } catch(error) {
        console.error('Error fetching inventory item:', error)
      }
    }
    fetchInventoryItem()
  }, [tablename, id, pathname])
  
  // this function to be called upon clicking the save button in edit modal and automaticall save in the database and show in the table
  
  async function updateInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const editMobileToast = toast.loading('Update the data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addInventory = {
        method: "POST",
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
            date_purchased: formData.date_purchased,
            date_installed: formData.date_installed,
            date_pullout: formData.date_pullout,

            db_table: value,
            uid: id,
            user_id: userDetails.userId,
            user_name: userDetails.userName.toUpperCase(),
            company_name: toCompany,
            inventory_type: "mobile",
            details: `"${formData.name}" has been transfered from ${fromCompany} to ${toCompany}`,
            actions: "TRANSFER"
        }),
      };
      const res = await fetch(`/api/${tablename}${pathname}/transfer`, addInventory);
      if(!res.ok){
        throw new Error('Failed to update inventory')
      }
      const response = await res.json();
      if (response.response.message === "success") {
        setTimeout(() => {
          setFormData({
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
            date_installed: '',
            date_pullout: '',
          });
          onSubmit();
          toast.success('Data has been successfully updated.', {id: editMobileToast})
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

  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setFormData(prevState => ({
      ...prevState,
      is_active_id: selectedValue
    }));
  }
  const handleDropdown = (value: string) => {
    setTableName(value)
    setValue(value)
  }
  
  return (
    // <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
    //         <div className="w-[680px] flex flex-col">
      <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-[680px] ">
          <div className="relative grid grid-col md:w-[680px] w-auto bg-white rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between py-3 px-5 border-b border-solid rounded-t border-blueGray-200">
              
              <h3 className="text-xl font-semibold">Transfer from {fromCompany} to {toCompany}</h3>
              <button
                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
              </button>
              
            </div>
            <div className="grid px-2 pt-2">
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
                <div className='flex flex-row justify-between items-center col-span-6'>
                    {/* Company */}
                    <div className="flex flex-row items-center">
                    <label htmlFor="is_active_id" className="block mb-1 mx-2 w-full text-sm font-semibold">
                        Transfer To:
                    </label>
                    <TransferDropdown onCompanyChange={handleDropdown} tablename={fromCompany} />
                    </div>
                    {/* Status */}
                    <div className="flex flex-row items-center">
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
            </div>
              <div className="flex justify-end py-2 mt-2">
                <button
                  type="submit"
                  
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
                  >
                  Transfer Data
                </button>
              </div>
              
            </form>
            </div>
          </div>
        </div>
      </div>
  );

};

export default TransferComputerModal
;
