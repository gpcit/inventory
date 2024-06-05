'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { accountTables } from '@/lib/company';
import { getSession } from 'next-auth/react';

interface FormProps {
  onDataSubmitted: () => void;
}

export default function Form({ onDataSubmitted }: FormProps) {
  const [formData, setFormData] = useState({
    item_no: '',
    name: '',
    manufacturer: '',
    description: '',
    cost_per_item: '',
    stock_quantity: '',
    reorder_level: '',
    days_per_reorder: '',
    item_reorder_quantity: '',
    item_discontinued: '',
  });

  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })
  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if(session) {
        setUserDetails({userId: session?.user?.uid, userName: session?.user?.username})
      }
    }
    fetchUserDetails()
  }, [])
  
 
  // const [create, setCreated] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
   
  };
  
  async function addSuppliesInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addPrinter = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        item_no: formData.item_no,
        name: formData.name,
        manufacturer: formData.manufacturer,
        description: formData.description,
        cost_per_item: formData.cost_per_item,
        stock_quantity: formData.stock_quantity,
        reorder_level: formData.reorder_level,
        days_per_reorder: formData.days_per_reorder,
        item_reorder_quantity: formData.item_reorder_quantity,
        item_discontinued: formData.item_discontinued,

        // user_id: userDetails.userId,
        // user_name: userDetails.userName.toUpperCase(),
        // company_name: getCompany,
        // details: `"${formData.printer_name}" has been added to record - (${triggerValue})`,
        // db_table: tablename,
        // actions: "ADD"
        }),
      };
      const res = await fetch(`/api/supplies`, addPrinter);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            item_no: '',
            name: '',
            manufacturer: '',
            description: '',
            cost_per_item: '',
            stock_quantity: '',
            reorder_level: '',
            days_per_reorder: '',
            item_reorder_quantity: '',
            item_discontinued: '',
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

  const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = (event.target.value)
    setFormData(prevState => ({
      ...prevState,
      item_discontinued: selectedValue
    }));
  }

  return (
    <form onSubmit={addSuppliesInventory}>
      <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
       
        {/* Item No */}
        <div className="mb-4 col-span-3">
          <label htmlFor="item_no" className="block mb-2 text-sm font-semibold">
            Item No
          </label>
          <input
            type="text"
            id="item_no"
            name="item_no"
            value={formData.item_no}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Item No."
          />
        </div>
        {/* Name */}
        <div className="mb-4 col-span-3">
          <label htmlFor="name" className="block mb-2 text-sm font-semibold">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Item Name"
          />
        </div>

          {/* Manufacturer */}
        <div className="mb-2 col-span-3">
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

          {/* Description */}
        <div className="mb-4 col-span-3">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
              placeholder="Enter Description"
            />
        </div>
        
        {/* Cost Item */}
        <div className="mb-4 col-span-2">
            <label htmlFor="cost_per_item" className="block mb-2 text-sm font-semibold">
                Cost Item
            </label>
            <input
                type="text"
                id="cost_per_item"
                name="cost_per_item"
                value={formData.cost_per_item}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter Item"
            />
        </div>
            {/* Serial Number */}
        <div className="mb-4 col-span-2">
            <label htmlFor="stock_quantity" className="block mb-2 text-sm font-semibold">
                Stock Quantity
            </label>
            <input
                type="text"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter Stock Quantity"
            />
        </div>
        
        {/* Comment */}
        <div className='col-span-2'>
          <div className="">
            <label htmlFor="reorder_level" className="block mb-2 text-sm font-semibold">
              Re-Order Level
            </label>
            <textarea
              rows={1}
              id="reorder_level"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
              placeholder='Enter Re-Order Level'
            />
          </div>
        </div>
        {/* Days Per Re-Order */}
        <div className="mb-4 col-span-2">
          <label htmlFor="days_per_reorder" className="block mb-2 text-sm font-semibold">
            Days Per Re-Order
          </label>
          <input
            type="text"
            id="days_per_reorder"
            name="days_per_reorder"
            value={formData.days_per_reorder}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder='Enter Days per Re-Order'
          />
        </div>

        {/* Item Re-Order (QTY) */}
        <div className="mb-4 col-span-2">
          <label htmlFor="item_reorder_quantity" className="block mb-2 text-sm font-semibold">
            Item Re-Order (QTY)
          </label>
          <input
            type="text"
            id="item_reorder_quantity"
            name="item_reorder_quantity"
            value={formData.item_reorder_quantity}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder='Enter Item Re-Order (QTY)'
          />
        </div>
        {/* Item Discontinued? */}
        <div className="mb-4 col-span-2">
          <label htmlFor="item_discontinued" className="block mb-2 text-sm font-semibold">
            Item Discontinued?
          </label>
          <select
          value={formData.item_discontinued}
          onChange={handleChangeStatus}
          name="item_discontinued" 
          id="item_discontinued" 
          className='block w-full px-2 py-2 text-sm border-md border border-gray-600/35 rounded-md font-extrabold '>
            <option key="Yes" value="Yes">Yes</option>
            <option key= "No" value="No">No</option>
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
  );
}
