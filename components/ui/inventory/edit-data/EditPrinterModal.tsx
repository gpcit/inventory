import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { accountTables, status } from "@/lib/company";
import { getSession } from 'next-auth/react';

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  id: number | null;
  tablename: string;
  triggerValue: string;
}



const EditPrinterModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [getvalue, setGetValue] = useState('');
  const [getstatus, setGetStatus] = useState('')
  const [formData, setFormData] = useState({
    printer_name: '',
    assigned_to: '',
    manufacturer: '',
    model: '',
    ink_type: '',
    serial_number: '',
    description: '',
    department: '',
    comment: '',
    date_purchased: '',
    date_installed: '',
    date_pullout: '',
    is_active_id: 0,
  });
  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })

  // Converting db_table to company Acronym
  const getCompany = accountTables[tablename] || ""
  console.log("Result for get company: ", getCompany)
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
  // handle for changing the value of dropdown
  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(event.target.value)
    setFormData(prevState => ({
      ...prevState,
      is_active_id: selectedValue
    }));
  }


  // handle for getting the specific data in database using the unique id
  
  useEffect(() => {
    async function fetchAccountTable() {
      try {
        const res = await fetch(`/api/${tablename}/printers/${id}`);
        if(!res.ok){
          throw new Error('Failed to fetch inventory item')
        }
        const data = await res.json();
        const accountData = data.results[0];
        setFormData(data.results[0])
      } catch(error) {
        console.error('Error fetching inventory item:', error)
      }
    }
    fetchAccountTable()
  }, [tablename, id, getstatus])

  // this function to be called upon clicking the save button in edit modal and automaticall save in the database and show in the table
  
  async function updatePrinter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const editAccountToast = toast.loading('Updating data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const updatePrinter = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printer_name: formData.printer_name,
          assigned_to: formData.assigned_to,
          manufacturer: formData.manufacturer,
          model: formData.model,
          ink_type: formData.ink_type,
          department: formData.department,
          serial_number: formData.serial_number,
          description: formData.description,
          is_active_id: formData.is_active_id,
          comment: formData.comment,
          date_installed: formData.date_installed,
          date_pullout: formData.date_pullout,
          date_purchased: formData.date_purchased,


          user_id: userDetails.userId,
          user_name: userDetails.userName.toUpperCase(),
          company_name: getCompany,
          details: `Edit the details of "${formData.printer_name}" - (${triggerValue})`,
          db_table: tablename,
          actions: "EDIT"
        }),
      };
      const res = await fetch(`/api/${tablename}/printers/${id}`, updatePrinter);
      if(!res.ok){
        throw new Error('Failed to update inventory')
      }
      const response = await res.json();
      if (response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            printer_name: '',
            assigned_to: '',
            manufacturer: '',
            model: '',
            ink_type: '',
            serial_number: '',
            description: '',
            department: '',
            comment: '',
            date_purchased: '',
            date_installed: '',
            date_pullout: '',
            is_active_id: 0,
          });
        onSubmit();
        toast.success('Data has been successfully updated.', {id: editAccountToast})
        }, 3000)
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast.error('Unable to update the data')
    }
  }

  const statusChange = (value: string) => {
    setGetValue(value)
    if(value === '1') {
      setGetStatus('1')
    } else {
      setGetStatus('2')
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
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
              
            <h3 className="text-xl font-semibold">Edit Account for {formData.assigned_to}</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
            </button>
            
          </div>
          <div className="flex-auto pt-2 px-2">
            <form onSubmit={updatePrinter}>
              <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
                  {/* Printer Name */}
                  <div className="mb-4 col-span-3">
                    <label htmlFor="printer_name" className="block mb-2 text-sm font-semibold">
                      Printer Name
                    </label>
                    <input
                      type="text"
                      id="printer_name"
                      name="printer_name"
                      value={formData.printer_name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                      placeholder="Enter Printer Name"
                    />
                  </div>
                  {/* Printer Name */}
                  <div className="mb-4 col-span-3">
                    <label htmlFor="assigned_to" className="block mb-2 text-sm font-semibold">
                      Assigned To
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
                  <div className="mb-4 col-span-2">
                    <label htmlFor="department" className="block mb-2 text-sm font-semibold">
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
                  {/* Manufacturer */}
                  <div className="mb-2 col-span-2">
                      <label htmlFor="manufacturer" className="block mb-2 text-sm font-semibold">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                        placeholder="Enter Manufacturer"
                      />
                  </div>
                  {/* Model */}
                  <div className="mb-4 col-span-2">
                      <label htmlFor="model" className="block mb-2 text-sm font-semibold">
                        Model
                      </label>
                      <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                        placeholder="Enter Model"
                      />
                  </div>
                  <div className='col-span-3'>
                      {/* Ink Type */}
                      <div className="mb-4 col-span-2">
                          <label htmlFor="ink_type" className="block mb-2 text-sm font-semibold">
                            Ink Type
                          </label>
                          <input
                            type="text"
                            id="ink_type"
                            name="ink_type"
                            value={formData.ink_type}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                            placeholder="Enter Ink Type"
                          />
                      </div>
                      {/* Serial Number */}
                      <div className="mb-4 col-span-2">
                          <label htmlFor="serial_number" className="block mb-2 text-sm font-semibold">
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
                  </div>
                  {/* Comment */}
                  <div className='col-span-4'>
                    <div className="">
                      <label htmlFor="comment" className="block mb-2 text-sm font-semibold">
                        Comment
                      </label>
                      <textarea
                        rows={1}
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
                        placeholder='Enter Comment'
                      />
                    </div>
                    <div className="">
                      <label htmlFor="description" className="block mb-2 text-sm font-semibold">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
                        placeholder='Enter description'
                      />
                    </div>
                  </div>
                  {/* Date Purchased */}
                  <div className="mb-4 col-span-3">
                    <label htmlFor="date_purchased" className="block mb-2 text-sm font-semibold">
                      Date Purchased:
                    </label>
                    <input
                      type="date"
                      id="date_purchased"
                      name="date_purchased"
                      value={formData.date_purchased}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
                    />
                  </div>
                  {/* Date Installed */}
                  {triggerValue === 'active' ? (
                    <div className="mb-4 col-span-3">
                    <label htmlFor="date_installed" className="block mb-2 text-sm font-semibold">
                      Date Installed:
                    </label>
                    <input
                      type="date"
                      id="date_installed"
                      name="date_installed"
                      value={formData.date_installed}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
                    />
                  </div>
                  ) : (
                      // Date Pull Out
                  <div className="mb-4 col-span-3">
                    <label htmlFor="date_pullout" className="block mb-2 text-sm font-semibold">
                      Date Pullout:
                    </label>
                    <input
                      type="date"
                      id="date_pullout"
                      name="date_pullout"
                      value={formData.date_pullout}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
                    />
                  </div>
                  )}
                  <div className=" col-span-3 flex flex-row sm:col-start-5 justify-center items-center">
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
                  className="flex items-center justify-center h-10 px-4 text-sm font-semibold text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
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

export default EditPrinterModal;
