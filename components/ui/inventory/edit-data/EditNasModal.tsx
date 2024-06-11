import { NasInventory } from "@/lib/definition"
import { FormEvent, useEffect, useState } from "react"
import toast from "react-hot-toast";

interface NasInventoryProps {
    onClose: () => void
    id: number | null;
    onSubmit: () => void;
}

export default function EditNasInventory ({onSubmit, onClose, id}: NasInventoryProps) {
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
    })

    useEffect(() => {
        const fetchNasData = async () => {
            try {
                const apiUrlEndpoint = `/api/nas/data/${id}`
                const data = await fetch(apiUrlEndpoint)
                const response = await data.json()
                console.log("result for response: ", response.results)
                setFormData(response.results[0])
            } catch (error) {
                console.error('Error fetching data')
            }
        }
        fetchNasData()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
        
    }, [onClose])

    const updateNasData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const editNasToast = toast.loading(`Updating the NAS Data. Please wait...`, {duration: 3000, position: "top-center"})
        try {
            const updateQuery = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    company_name: formData.company_name,
                    ip_address: formData.ip_address,
                    mac_address: formData.mac_address,
                    manufactuter: formData.manufacturer,
                    model: formData.model,
                    specs: formData.specs,
                    location_area: formData.location_area,
                    date_purchased: formData.location_area,
                    date_installed: formData.date_installed
                })
            }
            const result = await fetch(`/api/nas/data/${id}`, updateQuery);
            // if(!result.ok) {
            //     throw new Error('Failed to updated data')
            // }
            // console.log("Result: ", result)
            const response = await result.json();
    
            if(result.ok) {
                if(response.response.message === 'success') {
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
                        date_installed: ''
                        })
                        onSubmit()
                        toast.success(`Successfully update the data`, {id: editNasToast})
                    }, 2000)
                }  else { 
                    setTimeout(()=> {
                        toast.error(response.error, {id: editNasToast}) 
                    }, 2000)
                           
                }
            } else {
                setTimeout(()=> {
                toast.error(response.error || 'An unexpected error occurred', {id: editNasToast});
                }, 2000)
            }
            
        } catch (error) {
            console.error('Error updating the data:', error);
        }
    }
    
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-[680px] ">
          <div className="relative grid grid-col md:w-[680px] w-auto bg-white rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between py-3 px-5 border-b border-solid rounded-t border-blueGray-200">
              
              <h3 className="text-xl font-semibold">Edit Data</h3>
              <button
                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
              </button>
              
            </div>
            <div className="grid px-2 pt-2">
            <form onSubmit={updateNasData}>
              <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
                {/* Name */}
                <div className="mb-2 col-span-4">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium">
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
                {/* Company Name */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="company_name" className="block mb-2 text-sm font-medium">
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
                  <label htmlFor="ip_address" className="block mb-2 text-sm font-medium">
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
                <div className="mb-2 col-span-2">
                  <label htmlFor="mac_address" className="block mb-2 text-sm font-medium">
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
                {/* Model */}
                <div className="mb-2 col-span-2">
                  <label htmlFor="model" className="block mb-2 text-sm font-medium">
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
                <div className="mb-2 col-span-3">
                  <label htmlFor="specs" className="block mb-2 text-sm font-medium">
                    Specs
                  </label>
                  <textarea
                    id="specs"
                    name="specs"
                    value={formData.specs}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Specs"
                  />
                </div>
                {/* Location Area */}
                <div className="mb-2 col-span-3">
                  <label htmlFor="location_area" className="block mb-2 text-sm font-medium">
                    Location Area
                  </label>
                  <textarea
                    id="location_area"
                    name="location_area"
                    value={formData.location_area}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                    placeholder="Enter Location Area"
                  />
                </div>
                {/* Date Purchased */}
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
                 {/* Date Installed */}
                <div className="mb-2 col-span-3">
                  <label htmlFor="date_installed" className="block mb-2 text-sm font-medium">
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
                  
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
                  >
                  Save
                </button>
              </div>
              
            </form>
            </div>
          </div>
        </div>
      </div>
    )
}