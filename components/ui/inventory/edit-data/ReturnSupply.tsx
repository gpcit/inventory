import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ReturnSupplyProps {
    id: number | null;
    onClose: () => void;
    onDataSubmitted: () => void
}

const ReturnSupply: React.FC<ReturnSupplyProps> = ({id, onClose, onDataSubmitted}) => {
    const [formData, setFormData] = useState({
        item_name: '',
        description: '',
        name: '',
        date_returned: '',
        quantity: 0,
        date_acquired: ''
    })

    const [supplyData, setSupplyData] = useState({
        item_name: '',
        description: '',
    })

    const [returnData, setReturnData] = useState({
        item_name: '',
        item_description: '',
        name: '',
        date_returned: '',
        quantity: 0,
        deliver_id: ''
    })
    useEffect(() => {
        async function fetchReturnedItem() {
          try {
            const res = await fetch(`/api/deliver/${id}`);
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
        fetchReturnedItem()
    }, [id])

    useEffect(() => {
        async function fetchSupplies() {
          try {
            const res = await fetch(`/api/supplies/${id}`);
            if(!res.ok){
              throw new Error('Failed to fetch inventory item')
            }
            const data = await res.json();
            setSupplyData(data.results[0])
          } catch(error) {
            console.error('Error fetching inventory item:', error)
          }
        }
        fetchSupplies()
    }, [id])
    async function returnItem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const addToastLoading = toast.loading('Returning Data. Please wait...', {duration: 3500, position: "top-center"})
        try {
          const addReturned = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            item_name: formData.item_name,
            item_description: formData.description,
            quantity: formData.quantity,
            name: formData.name,
            deliver_id: id,
            date_returned: formData.date_returned
    
            // user_id: userDetails.userId,
            // user_name: userDetails.userName.toUpperCase(),
            // company_name: getCompany,
            // details: `"${formData.printer_name}" has been added to record - (${triggerValue})`,
            // db_table: tablename,
            // actions: "ADD"
            }),
          };
          const res = await fetch(`/api/return`, addReturned);
          const response = await res.json();
          if (response && response.response && response.response.message === "success") {
            setTimeout(() => {
              setReturnData({
                item_name: '',
                item_description: '',
                name: '',
                date_returned: '',
                quantity: 0,
                deliver_id: ''
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };
    
    return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-auto">
            <div className="relative grid grid-col w-96 bg-white rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-xl font-semibold">Return Supply</h3>
                <button
                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                onClick={onClose}
                >
                <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
                </button>
                </div>
                <div className="flex-auto pt-2 px-2"></div>
                <form onSubmit={returnItem}>
                    <div className="p-4 rounded-md grid grid-cols-6 border-2 border-x-gray-400 shadow-2xl mx-2 gap-1 bg-gray-200">
                        {/* Description */}
                        <div className="mb-4 col-span-3">
                            <label htmlFor="item_name" className="block mb-2 text-sm font-semibold">
                            Description | Item Name
                            </label>
                            <input
                            type="text"
                            id="item_name"
                            name="item_name"
                            value={formData.description}
                            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                            disabled
                            />
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
                            className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                            disabled
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
                            
                            
                            />
                            
                            
                        </div>
                        
                        {/* Location */}
                        <div className="mb-4 col-span-3">
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
                                className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                                disabled
                            />
                        </div>
                        
                    </div>
                    <div className="flex justify-end py-2 mt-2">
                        <button
                            type="submit"
                            className="flex items-center justify-center h-10 px-4 text-sm font-semibold text-white transition-colors border-4 hover:border-black bg-black rounded-lg hover:text-green-800 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
                            >
                            Proceed
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default ReturnSupply;