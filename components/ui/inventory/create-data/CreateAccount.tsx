'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { accountTables } from '@/lib/company';

interface FormProps {
  tablename: string;
  triggerValue: string;
  onDataSubmitted: () => void; // Callback function to handle data submission
}

export default function Form({triggerValue, tablename, onDataSubmitted }: FormProps) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    username: '',
    password: '',
    is_active_id: 0,
    notes: ''
  });
  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })
  
  const getCompany = accountTables[tablename] || ""

  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if(session) {
        setUserDetails({userId: session?.user?.uid, userName: session?.user?.username})
      }
    }
    fetchUserDetails()
  }, [])
  useEffect(() => {
    if(triggerValue === 'active') {
      setFormData(prevState => ({
        ...prevState,
        is_active_id: 1
      }))
    } else {
      setFormData(prevState => ({
        ...prevState,
        is_active_id: 2
      }))
    }
  }, [triggerValue])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
   
  };
  
  async function addAccountInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addAccounts = {
        method: "POST",
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
        details: `"${formData.name}" has been added to record - (${triggerValue})`,
        db_table: tablename,
        actions: "ADD"
          // tableName: gettableName
        }),
      };
      const res = await fetch(`/api/${tablename}/accounts`, addAccounts);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
          name: '',
          department: '',
          username: '',
          password: '',
          is_active_id: 0,
          notes: '',
          });
          onDataSubmitted();
          toast.success("Data has been successfully added", {id: addToastLoading});
        }, 3000)
        
      } else {
        setTimeout(() => {
          toast.error(response.error, {id: addToastLoading})
        }, 3000)
        
        
      }
      
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast.error('Unable to add new data')
    }
  }

  return (
    <form onSubmit={addAccountInventory}>
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
            placeholder=""
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
              type="password"
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
        <div className="m3-4 col-span-4">
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
        <div className="mb-4 col-span-3 flex flex-row sm:col-start-5">
          <label htmlFor="status" className="block m-2 text-sm font-semibold">
            Status:
          </label>
          {triggerValue === 'active' ? (
            <input
            type="text"
            id="status"
            name="status"
            value={formData.is_active_id === 1 ? 'Active' : 'Inactive'}
            disabled
            className="block w-full px-3 py-2 text-sm border bg-green-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Password"
          />
          ) : (
            <input
            type="text"
            id="status"
            name="status"
            value={formData.is_active_id === 1 ? 'Active' : 'Inactive'}
            disabled
            className="block w-full px-3 py-2 text-sm border bg-red-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Password"
          />
          )}
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
  );
}
