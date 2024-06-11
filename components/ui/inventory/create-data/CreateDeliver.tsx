'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { SupplyInventory } from '@/lib/definition';

interface FormProps {
  onDataSubmitted: () => void;
}

export default function DeliverForm({ onDataSubmitted }: FormProps) {
  const [formData, setFormData] = useState({
    date_acquired: '',
    quantity: '',
    description: '',
    location: '',
    name: '',
    item_name: ''
  });
  const [itemName, setItemName] = useState<SupplyInventory[]>([])
  const [selectedItemQty, setSelectedItemQty] = useState<number | null >(null)
  const [item, setItem] = useState<string | null >(null)
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
  
  useEffect(() => {
    const fetchSupply = async () => {
      try {
        const apiUrlEndpoint = `/api/supplies/allData`
        const resonse = await fetch(apiUrlEndpoint)
        const data = await resonse.json()

        setItemName(data.results)
        
      } catch (error) {
        console.error('Error adding inventory:', error);
      }
    }
    fetchSupply()
  }, [])

  // const getQty = itemName.map((qty) => (
    
  // ))
 
  // const [create, setCreated] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
   
  };
  
  async function addDeliver(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addDeliver = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        date_acquired: formData.date_acquired,
        name: formData.name,
        item_name: item,
        quantity: formData.quantity,
        description: formData.description,
        location: formData.location,

        // user_id: userDetails.userId,
        // user_name: userDetails.userName.toUpperCase(),
        // company_name: getCompany,
        // details: `"${formData.printer_name}" has been added to record - (${triggerValue})`,
        // db_table: tablename,
        // actions: "ADD"
        }),
      };
      const res = await fetch(`/api/deliver`, addDeliver);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            name: '',
            quantity: '',
            description: '',
            location: '',
            date_acquired: '',
            item_name: ''
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
  const handleSelectItem = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = (event.target.value)
    setFormData(prevState => ({
      ...prevState,
      description: selectedValue
    }));
    const selectedItem = itemName.find(item => item.description === selectedValue);
    setSelectedItemQty(selectedItem ? selectedItem.stock_quantity : null)
    setItem(selectedItem ? selectedItem.name : null)
  }

  return (
    <form onSubmit={addDeliver}>
      <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
        {/* Description */}
        <div className="mb-4 col-span-3">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold">
              Description | Item Name
            </label>
            <select
            value={formData.description}
            onChange={handleSelectItem}
            name="description" 
            id="description" 
            className='block w-full px-2 py-2 text-sm border-md border border-gray-600/35 rounded-md font-extrabold '>
              <option value="">Select</option>
            {itemName?.map((item) => (
              <option key={item.name} value={item.description}>{item.name} - {item.description}</option>

            ))}
          </select>
        </div>
        
        {/* Name */}
        <div className="mb-4 col-span-3">
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
            placeholder="Enter Item Name"
          />
        </div>

          {/* quantity */}
        <div className="mb-2 col-span-3">
            <label htmlFor="quantity" className="block mb-2 text-sm font-semibold">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
              placeholder="Enter quantity"
              disabled={selectedItemQty === 0 || formData.description == ''}
              
            />
            {formData.description !== '' && (
              <span className={`text-sm text-red-500 justify-center items-center`}>Available: {selectedItemQty}</span>
            )}
            
        </div>
        
        {/* Location */}
        <div className="mb-4 col-span-3">
            <label htmlFor="location" className="block mb-2 text-sm font-semibold">
                Location
            </label>
            <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter Location"
            />
        </div>
        {/* Date Acquired */}
        <div className="mb-4 col-span-3">
          <label htmlFor="date_acquired" className="block mb-2 text-sm font-semibold">
            Date Acquired
          </label>
          <input
            type="date"
            id="date_acquired"
            name="date_acquired"
            value={formData.date_acquired}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
          />
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
