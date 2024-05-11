'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import Status from '../../dropdowns/status';

interface FormProps {
  gettableName: string;
  triggerValue: string;
  onDataSubmitted: () => void; // Callback function to handle data submission
}

export default function Form({triggerValue, gettableName, onDataSubmitted }: FormProps) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [getValue, setGetValue] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState('')
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
  // const [create, setCreated] = useState(false);
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
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
   
  };
  
  async function addPrinterInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding new data. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const addPrinter = {
        method: "POST",
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
          // tableName: gettableName
        }),
      };
      const res = await fetch(`/api/${gettableName}/printers`, addPrinter);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
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
    <form onSubmit={addPrinterInventory}>
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
        <div className="mb-4 col-span-4">
          <label htmlFor="comment" className="block mb-2 text-sm font-semibold">
            Comment
          </label>
          <textarea
            rows={5}
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm border border-gray-600/35 rounded-md focus:outline-none focus:border-gray-400 shadow-md"
            placeholder='Enter Comment'
          />
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
            className="flex items-center justify-center h-10 px-4 text-sm font-semibold text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
            Save
          </button>
        </div>
    </form>
  );
}
