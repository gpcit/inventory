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



const TransferMobileModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [formData, setFormData] = useState({
    assigned_to: '',
    department: '',
    brand: '',
    model_specs: '',
    imei: '',
    number: '',
    email_password: '',
    serial_number: '',
    inclusion: '',
    plan: '',
    comment: '',
    date_issued: '',
    date_purchased: '',
    date_returned: '',
    is_active_id: 1
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
          assigned_to: formData.assigned_to,
          department: formData.department,
          brand: formData.brand,
          model_specs: formData.model_specs,
          imei: formData.imei,
          number: formData.number,
          email_password: formData.email_password,
          serial_number: formData.serial_number,
          inclusion: formData.inclusion,
          plan: formData.plan,
          comment: formData.comment,
          date_issued: formData.date_issued,
          date_purchased: formData.date_purchased,
          date_returned: formData.date_returned,
          is_active_id: formData.is_active_id,

          db_table: value,
          uid: id,
          user_id: userDetails.userId,
          user_name: userDetails.userName.toUpperCase(),
          company_name: toCompany,
          inventory_type: "mobile",
          details: `"${formData.assigned_to}" has been transfered from ${fromCompany} to ${toCompany}`,
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
            assigned_to: '',
            department: '',
            brand: '',
            model_specs: '',
            imei: '',
            number: '',
            email_password: '',
            serial_number: '',
            inclusion: '',
            plan: '',
            comment: '',
            date_issued: '',
            date_purchased: '',
            date_returned: '',
            is_active_id: 0
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
    const selectedValue = Number(event.target.value)
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
              <div className="p-4 rounded-md grid grid-cols-6 border-2 border-gray-400 shadow-xl mx-2 gap-1 ">
                {/* Assigned To */}
                <div className="mb-2 col-span-4">
                  <label htmlFor="assigned_to" className="block mb-2 text-sm font-medium">
                    Assiged To
                  </label>
                  <input
                    type="text"
                    id="assigned_to"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Assigned To"
                  />
                </div>
                {/* Department */}
                <div className="mb-2 col-span-2">
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
                {/* Number */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="number" className="block mb-2 text-sm font-medium">
                    Number
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Contact Number"
                  />
                </div>
                {/* Brand */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="brand" className="block mb-2 text-sm font-medium">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Brand"
                  />
                </div>
                {/* Serial Number */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="serial_number" className="block mb-2 text-sm font-medium">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Serial Number"
                  />
                </div>
                {/* Email and Password */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="email_password" className="block mb-2 text-sm font-medium">
                    Email and Password
                  </label>
                  <textarea
                    id="email_password"
                    name="email_password"
                    value={formData.email_password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Email and Password"
                  />
                </div>
                {/* Plan */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="plan" className="block mb-2 text-sm font-medium">
                    Plan
                  </label>
                  <textarea
                    id="plan"
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Plan"
                  />
                </div>
                {/* IMEI */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="imei" className="block mb-2 text-sm font-medium">
                    IMEI
                  </label>
                  <textarea
                    id="imei"
                    name="imei"
                    value={formData.imei}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter IMEI"
                  />
                </div>
                
                {/* Inclusion */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="inclusion" className="block mb-2 text-sm font-medium">
                    Inclusion
                  </label>
                  <textarea
                    id="inclusion"
                    name="inclusion"
                    value={formData.inclusion}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Inclusion"
                  />
                </div>
                {/* Model and Specs */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="model_specs" className="block mb-2 text-sm font-medium">
                    Model / Specs
                  </label>
                  <textarea
                    id="model_specs"
                    name="model_specs"
                    value={formData.model_specs}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Model / Specs"
                  />
                </div>
                {/* Comment */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="comment" className="block mb-2 text-sm font-medium">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Comment"
                  />
                </div>
                {/* Date Issued */}
                {triggerValue === 'active' ? ( 
                  <div className="mb-2 col-span-3">
                  <label htmlFor="date_issued" className="block mb-2 text-sm font-medium">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    id="date_issued"
                    name="date_issued"
                    value={formData.date_issued}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  />
                </div>
                ) : (
                <div className="mb-2 col-span-3">
                  <label htmlFor="date_returned" className="block mb-2 text-sm font-medium">
                    Date Returned
                  </label>
                  <input
                    type="date"
                    id="date_returned"
                    name="date_returned"
                    value={formData.date_returned}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  />
                </div>
                )}
                
                {/* Date Issued */}
                <div className="mb-2 col-span-3">
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
                <div className='flex flex-row justify-between items-center col-span-6'>
                  {/* Company */}
                  <div className="flex flex-row items-center">
                    <label htmlFor="is_active_id" className="block mb-1 mx-2 w-full text-sm font-semibold">
                      Transfer To:
                    </label>
                  <TransferDropdown onCompanyChange={handleDropdown} tablename={tablename} />
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

export default TransferMobileModal
;
