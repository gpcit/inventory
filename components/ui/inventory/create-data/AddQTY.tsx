'use client'
import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { accountTables } from '@/lib/company';
import { getSession } from 'next-auth/react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface FormProps {
  onDataSubmitted: () => void;
  id: number | null
  onClose: () => void;
}

export default function AddQTYForm({onClose, onDataSubmitted, id }: FormProps) {
  const [formData, setFormData] = useState({
    stock_quantity: 0,
  });
  const [quantity, setQuantity] = useState(0)

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
    async function fetchQTY() {
      try {
        const res = await fetch(`/api/supplies/${id}`);
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
    fetchQTY()
  }, [id, formData.stock_quantity])
  
 
  // const [create, setCreated] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
   
  };
  
  async function updateQTYSupply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const addToastLoading = toast.loading('Adding QTY. Please wait...', {duration: 3500, position: "top-center"})
    try {
      const updateQTY = {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        stock_quantity: (formData.stock_quantity + quantity),

        // user_id: userDetails.userId,
        // user_name: userDetails.userName.toUpperCase(),
        // company_name: getCompany,
        // details: `"${formData.printer_name}" has been added to record - (${triggerValue})`,
        // db_table: tablename,
        // actions: "ADD"
        }),
      };
      const res = await fetch(`/api/supplies/${id}`, updateQTY);
      const response = await res.json();
      if (response && response.response && response.response.message === "success") {
        setTimeout(() => {
          setFormData({
            stock_quantity: 0,
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



  const qtyIncrement = () => {
    setQuantity(prev => Math.min(prev + 1, 100))
  }

  const qtyDecrement = () => {
    setQuantity(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-auto">
          <div className="relative grid grid-col w-96 bg-white rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-xl font-semibold">Add Quantity</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
            </button>
            </div>
          <div className="flex-auto pt-2 px-2"></div>
            <form onSubmit={updateQTYSupply}>
            <div className="p-4 rounded-md border-2 mx-2 gap-1 ">

                {/* Stock Quantity */}
                <div className="mb-4 col-span-2 flex flex-col justify-center">
                    <label htmlFor="stock_quantity" className="block mb-2 text-sm font-semibold">
                        Stock Quantity
                    </label>
                    <input
                        type="text"
                        id="stock_quantity"
                        name="stock_quantity"
                        value={formData.stock_quantity + quantity}
                        onChange={event => setQuantity(Number(event.target.value))}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black shadow-md"
                        placeholder="Enter Stock Quantity"
                        disabled
                    />
                </div>
                <div className='flex justify-start gap-2 p-1'>
                    <a
                        type='submit'
                    onClick={() => qtyIncrement()}
                    className="p-2 border rounded-md bg-green-100"
                    >
                        <PlusIcon className="w-5" /></a>
                    <a 
                    onClick={() => qtyDecrement()}
                    className='p-2 border rounded-md bg-red-100'
                    >
                        <MinusIcon className='w-5 ' />
                    </a>
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
  );
}
