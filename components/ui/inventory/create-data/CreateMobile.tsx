'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { accountTables, status } from '@/lib/company';
import { getSession } from 'next-auth/react';

interface FormProps {
  tablename: string;
  triggerValue: string;
  onDataSubmitted: () => void; // Callback function to handle data submission
}

export default function Form({triggerValue, tablename, onDataSubmitted }: FormProps) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    date_issued: '',
    comment: '',
    date_purchased: '',
    date_returned: '',
    is_active_id: 0
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if(triggerValue === 'active'){
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
  async function addMobileInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      let res;
      const postInventory = {
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
        comment: formData.comment,
        date_issued: formData.date_issued,
        date_purchased: formData.date_purchased,
        date_returned: formData.date_returned,
        is_active_id: formData.is_active_id,
        
        user_id: userDetails.userId,
        user_name: userDetails.userName.toUpperCase(),
        company_name: getCompany,
        details: `"${formData.assigned_to}" has been added to record - (${triggerValue})`,
        db_table: tablename,
        actions: "ADD"
        }),
      };
      // if(triggerValue === 'active') {
        res = await fetch(`/api/${tablename}/cellphones`, postInventory);
      // } else {
      //   res = await fetch(`/api/${tablename}/cellphones/inactive`, postInventory);
      // }
       const response = await res.json();
      if (response && response.response && response.response.message === "success") {
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
          comment: '',
          date_issued: '',
          date_purchased: '',
          date_returned: '',
          is_active_id: 0
          });
          onDataSubmitted();
          toast.success("Data has been successfully added", {id: addToastLoading});
        }, 3000)
        
      } else {
        setIsDuplicate(true)
        setErrorMessage(response.error)
        toast.error(response.error, {id: addToastLoading})
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast.error('Unable to add new data')
    }
  }
  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(event.target.value)
    setFormData(prevState => ({
      ...prevState,
      is_active_id: selectedValue
    }));
  }
 

  return (
    <form onSubmit={addMobileInventory}>
      <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
       
        {/* Assigned To */}
        <div className="mb-2 col-span-4">
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
        <div className="mb-2 col-span-2">
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

        {/* Contact Number */}
        <div className="mb-2 col-span-2">
          <label htmlFor="number" className="block mb-2 text-sm font-semibold">
            Number
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Number"
          />
        </div>
        {/* Brand */}
        <div className="mb-2 col-span-2">
          <label htmlFor="brand" className="block mb-2 text-sm font-semibold">
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
          <label htmlFor="serial_number" className="block mb-2 text-sm font-semibold">
            Serial Number
          </label>
          <input
            type="text"
            id="serial_number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            className={`block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md ${!isDuplicate ? 'text-black' : 'text-red-700'}`}
            placeholder="Enter Serial Number"
          />
           {isDuplicate && (
            <span className='text-red-700 text-sm'>{errorMessage}</span>
          )}
        </div>

        {/* Email and Password */}
        <div className="mb-2 col-span-3">
          <label htmlFor="email_password" className="block mb-2 text-sm font-semibold">
            Email and Password
          </label>
          <input
            type="text"
            id="email_password"
            name="email_password"
            value={formData.email_password}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Email and Password"
          />
        </div>
        {/* IMEI */}
        <div className="mb-2 col-span-3">
          <label htmlFor="imei" className="block mb-2 text-sm font-semibold">
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
          <label htmlFor="inclusion" className="block mb-2 text-sm font-semibold">
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

        {/* Model Specs */}
        <div className="mb-2 col-span-2">
          <label htmlFor="model_specs" className="block mb-2 text-sm font-semibold">
            Model / Specs
          </label>
          <textarea
            id="model_specs"
            name="model_specs"
            value={formData.model_specs}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Specs"
          />
        </div>
        {/* Comment */}
        <div className="mb-2 col-span-2">
          <label htmlFor="comment" className="block mb-2 text-sm font-semibold">
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
        <div className="mb-2 col-span-3">
          {triggerValue === 'active' ? (
            <>
            <label htmlFor="date_issued" className="block mb-2 text-sm font-semibold">
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
          </>
          ): (
            <>
            <label htmlFor="date_returned" className="block mb-2 text-sm font-semibold">
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
          </>
          )}
        </div>
        {/* Date Purchased */}
        <div className="mb-2 col-span-3">
          <label htmlFor="date_purchased" className="block mb-2 text-sm font-semibold">
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
        {/* Status */}
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
            className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
            Save
          </button>
        </div>
    </form>
  );
}
