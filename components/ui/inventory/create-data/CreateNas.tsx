'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { getSession } from 'next-auth/react';
import { SupplyInventory } from '@/lib/definition';

interface FormProps {
  onDataSubmitted: () => void;
}

export default function NasForm({ onDataSubmitted }: FormProps) {
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    ip_address: '',
    mac_address: '',
    manufacturer: '',
    model: '',
    specs: '',
    location_area: '',
    date_purchased: '',
    date_installed: '',
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
    const fetchNasData = async () => {
      try {
        const apiUrlEndpoint = `/api/nas/data`
        const resonse = await fetch(apiUrlEndpoint)
        const data = await resonse.json()

        setItemName(data.results)
        
      } catch (error) {
        console.error('Error adding inventory:', error);
      }
    }
    fetchNasData()
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

  
  
  async function addNas(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addNas = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        name: formData.name,
        company_name: formData.company_name,
        ip_address: formData.ip_address,
        mac_address: formData.mac_address,
        manufacturer: formData.manufacturer,
        model: formData.model,
        specs: formData.specs,
        location_area: formData.location_area,
        date_purchased: formData.date_purchased,
        date_installed: formData.date_installed,
        // user_id: userDetails.userId,
        // user_name: userDetails.userName.toUpperCase(),
        // company_name: getCompany,
        // details: `"${formData.printer_name}" has been added to record - (${triggerValue})`,
        // db_table: tablename,
        // actions: "ADD"
        }),
      };
      const data = await fetch(`/api/nas/data`, addNas);
      const response = await data.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            name: '',
            company_name: '',
            ip_address: '',
            mac_address: '',
            manufacturer: '',
            model: '',
            specs: '',
            location_area: '',
            date_purchased: '',
            date_installed: '',
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
    <form onSubmit={addNas}>
      <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
        {/* Name */}
        <div className="mb-4 col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-semibold">
              Name
            </label>
            <input
            type='text'
            value={formData.name}
            onChange={handleChange}
            name="name"
            id="name" 
            className='block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md'
            placeholder='Enter Name'
            />
          
        </div>
        
        {/* Company Name */}
        <div className="mb-4 col-span-2">
          <label htmlFor="company_name" className="block mb-2 text-sm font-semibold">
            Company Name
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
            placeholder="Enter Company Name"
          />
        </div>

          {/* IP Address */}
        <div className="mb-2 col-span-2">
            <label htmlFor="ip_address" className="block mb-2 text-sm font-semibold">
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
        
        {/* MAC Address */}
        <div className="mb-4 col-span-2">
            <label htmlFor="mac_address" className="block mb-2 text-sm font-semibold">
                MAC Address
            </label>
            <input
                type="text"
                id="mac_address"
                name="mac_address"
                value={formData.mac_address}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter MAC Address"
            />
        </div>
        {/* Manufacturer */}
        <div className="mb-4 col-span-2">
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

        {/* Specs */}
        <div className="mb-4 col-span-3">
            <label htmlFor="specs" className="block mb-2 text-sm font-semibold">
                Specs
            </label>
            <textarea
                rows={1}
                id="specs"
                name="specs"
                value={formData.specs}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter Specs"
            />
        </div>

        {/* Location Area */}
        <div className="mb-4 col-span-3">
            <label htmlFor="location_area" className="block mb-2 text-sm font-semibold">
                Location Area
            </label>
            <input
                type="text"
                id="location_area"
                name="location_area"
                value={formData.location_area}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                placeholder="Enter location_area"
            />
        </div>

        {/* Date Purchased */}
        <div className="mb-4 col-span-3">
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
        {/* Date Installed */}
        <div className="mb-4 col-span-3">
            <label htmlFor="date_installed" className="block mb-2 text-sm font-semibold">
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
