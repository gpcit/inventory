'use client'

import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';

interface FormProps {
  gettableName: string;
  onDataSubmitted: () => void; // Callback function to handle data submission
}

export default function Form({ gettableName, onDataSubmitted }: FormProps) {
  // console.log("This is from create-form", gettableName)
  const [formData, setFormData] = useState({
    pcname: '',
    name: '',
    ip_address: '',
    mac_address: '',
    computer_type: '',
    monitor: '',
    department: '',
    specs: '',
    anydesk: '',
    supplier: '',
    comment: '',
    date_purchased: '',
    date_installed: '',
  });
  // const [create, setCreated] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  async function addInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addInventoryToast = toast.loading('Adding new data...', { duration: 3500, position: "top-center"})
    try {
      const postInventory = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pc_name: formData.pcname,
          name: formData.name,
          mac_address: formData.mac_address,
          ip_address: formData.ip_address,
          computer_type: formData.computer_type,
          monitor: formData.monitor,
          specs: formData.specs,
          department: formData.department,
          anydesk: formData.anydesk,
          supplier: formData.supplier,
          comment: formData.comment,
          date_purchased: formData.date_purchased,
          date_installed: formData.date_installed
          
          // tableName: gettableName
        }),
      };
      const res = await fetch(`/api/${gettableName}`, postInventory);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            pcname: '',
            name: '',
            ip_address: '',
            mac_address: '',
            computer_type: '',
            monitor: '',
            department: '',
            specs: '',
            anydesk: '',
            supplier: '',
            comment: '',
            date_purchased: '',
            date_installed: '',
          });
          onDataSubmitted();
          toast.success('Data has been successfully added', {id: addInventoryToast})
        }, 3000)
        
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
      toast.error('Unable to add a new data!')
    }
  }

  return (
    <form onSubmit={addInventory}>
      <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
        {/* Name */}
        <div className="mb-4 col-span-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Name"
            required
          />
        </div>

        {/* Department */}
        <div className="mb-4 col-span-2">
          <label htmlFor="department" className="block mb-2 text-sm font-medium">
            Department:
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter department"
          />
        </div>

        {/* PC Name */}
        <div className="mb-4 col-span-2">
          <label htmlFor="pcname" className="block mb-2 text-sm font-medium">
            PC Name:
          </label>
          <input
            type="text"
            id="pcname"
            name="pcname"
            value={formData.pcname}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter PC Name"
          />
        </div>

        {/* IP Address*/}
        <div className="mb-4 col-span-2">
          <label htmlFor="ip_address" className="block mb-2 text-sm font-medium">
            IP Address:
          </label>
          <input
            type="text"
            id="ip_address"
            name="ip_address"
            value={formData.ip_address}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter IP Address"
          />
        </div>
        {/* Mac Address */}
        <div className="mb-4 col-span-2">
          <label htmlFor="mac_address" className="block mb-2 text-sm font-medium">
            Mac Address:
          </label>
          <input
            type="text"
            id="mac_address"
            name="mac_address"
            value={formData.mac_address}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Mac Address"
          />
        </div>
        {/* Monitor */}
        <div className="mb-4 col-span-2">
          <label htmlFor="monitor" className="block mb-2 text-sm font-medium">
            Monitor:
          </label>
          <input
            type="text"
            id="monitor"
            name="monitor"
            value={formData.monitor}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Monitor"
          />
        </div>
        
        {/* Supplier */}
        <div className="mb-4 col-span-2">
          <label htmlFor="supplier" className="block mb-2 text-sm font-medium">
            Supplier:
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Supplier"
          />
        </div>
        {/* Computer Type */}
        <div className="mb-4 col-span-2">
          <label htmlFor="computer_type" className="block mb-2 text-sm font-medium">
            Computer Type:
          </label>
          <input
            type="text"
            id="computer_type"
            name="computer_type"
            value={formData.computer_type}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Computer Type"
          />
        </div>
        {/* Anydesk */}
        <div className="mb-4 col-span-2">
          <label htmlFor="anydesk" className="block mb-2 text-sm font-medium">
            Anydesk:
          </label>
          <textarea
            id="anydesk"
            name="anydesk"
            value={formData.anydesk}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Anydesk"
          />
        </div>
        {/* Specs */}
        <div className="mb-4 col-span-2">
          <label htmlFor="specs" className="block mb-2 text-sm font-medium">
            Specs:
          </label>
          <textarea
            id="specs"
            name="specs"
            value={formData.specs}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Specs"
          />
        </div>
        {/* Comments */}
        <div className="mb-4 col-span-2">
          <label htmlFor="comment" className="block  mb-2 text-sm font-medium">
            Comments:
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder="Enter Comment"
          />
        </div>
        {/* Date Purchased */}
        <div className="mb-4 col-span-3">
          <label htmlFor="date_purchased" className="block mb-2 text-sm font-medium">
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
        <div className="mb-4 col-span-3">
          <label htmlFor="date_installed" className="block mb-2 text-sm font-medium">
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
