import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { accountTables, status, tableName } from "@/lib/company";
import { getSession } from 'next-auth/react';
import { ActivityLogInventory } from '@/lib/definition';

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  id: number | null;
  tablename: string;
  triggerValue: string;
}



const EditAccountModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [getstatus, setGetStatus] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    username: '',
    password: '',
    is_active_id: '',
    notes: ''
  });

  const getCompany = accountTables[tablename] || ""

  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })
 
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
  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const selectedValue = event.target.value
    setFormData(prevState => ({
      ...prevState,
      is_active_id: selectedValue
    }));

  }

  // handle for getting the specific data in database using the unique id
  useEffect(() => {
    async function fetchAccountTable() {
      try {
        const res = await fetch(`/api/${tablename}/accounts/${id}`);
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
  
  async function updateAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const editAccountToast = toast.loading('Updating data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const updateAccount = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          department: formData.department,
          username: formData.username,
          password: formData.password,
          is_active_id: formData.is_active_id,
          notes: formData.notes,

          user_id: userDetails.userId,
          user_name: userDetails.userName.toUpperCase(),
          company_name: getCompany,
          details: `Edit the details of "${formData.name}" - (${triggerValue})`,
          db_table: tablename,
          inventory_type: 'account',
          actions: "EDIT"
        }),
      };
      const res = await fetch(`/api/${tablename}/accounts/${id}`, updateAccount);
      if(!res.ok){
        throw new Error('Failed to update inventory')
      }
      const response = await res.json();
      if (response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            name: '',
            department: '',
            username: '',
            password: '',
            is_active_id: '',
            notes: ''
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
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
              
            <h3 className="text-xl font-semibold">Edit Account for {formData.name}</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
            </button>
            
          </div>
          <div className="flex-auto pt-2 px-2">
          <form onSubmit={updateAccount}>
          <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
        
              {/* Name */}
              <div className="mb-4 col-span-4">
                <label htmlFor="name" className="block mb-2 text-sm font-semibold">
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

              <div className='col-span-2'>
                {/* Username */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="username" className="block mb-2 text-sm font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Username"
                  />
                </div>
                {/* Password */}
                <div className="mb-4 col-span-2">
                  <label htmlFor="password" className="block mb-2 text-sm font-semibold">
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Password"
                  />
                </div>
              </div>
              {/* Notes */}
              <div className="mb-4 col-span-4">
                <label htmlFor="notes" className="block mb-2 text-sm font-semibold">
                  Notes
                </label>
                <textarea
                  rows={5}
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                  placeholder="Add Notes"
                />
              </div>
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

export default EditAccountModal;
