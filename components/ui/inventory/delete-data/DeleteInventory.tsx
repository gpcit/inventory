import { accountTables } from '@/lib/company';
import { getSession } from 'next-auth/react';
import React, { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  id: number | null;
  tablename: string;
  triggerValue: string
}
const DeleteInventoryModal: React.FC<ModalProps> = ({triggerValue, onClose, onSubmit, tablename, id}) => {
  const [userDetails, setUserDetails] = useState({
    userId: 0,
    userName: ''
  })
  const [formData, setFormData] = useState({
    name: '',
  });

  const getCompany = accountTables[tablename] || ""

  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if(session){
        setUserDetails({ userId: session?.user?.uid, userName: session?.user?.username})
      }
    }
    fetchUserDetails()
  }, [])

  useEffect(() => {
    async function fetchInventoryTable() {
      try {
        const res = await fetch(`/api/${tablename}/accounts/${id}`);
        if(!res.ok){
          throw new Error('Failed to fetch inventory item')
        }
        const data = await res.json();
        setFormData(data.results[0])
      } catch(error) {
        console.error('Error fetching inventory item:', error)
      }
    }
    fetchInventoryTable()
  }, [tablename, id])

  async function deleteInventory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const deleteToast = toast.loading('Deleting Data. Please wait..', {duration: 2500, position: "top-center"})
    try {
      const deleteRequest = {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userDetails.userId,
          user_name: userDetails.userName.toUpperCase(),
          company_name: getCompany,
          details: `Delete data of "${formData.name}" - (${triggerValue})`,
          db_table: tablename,
          actions: "DELETE"
        })
      }
      const res = await fetch(`/api/${tablename}/${id}`, deleteRequest)

      if(!res.ok) {
        throw new Error ('Failed to delete data')
      }

      const response = await res.json();
      if(response.response && response.response.message === "success") {
        setTimeout(() => {
            onSubmit();
            toast.success('Data has been successfully delete,', {id: deleteToast})
            onClose
        }, 3000)
      } else {
        throw new Error ('Delete request failed with unexpected response')
      }
    } catch (error) {
      console.error('Error deleting inventory:', error);
      toast.error('Unable to delete the data')
    }
  }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // console.log('Key pressed: ', event.key)
      if(event.key === 'Escape'){
        onClose()
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    };
  }, [onClose])

  
  
  return (
    // <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
    //         <div className="w-[680px] flex flex-col">
      <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
        <div className="relative w-[680px] ">
          <div className="relative grid grid-col md:w-[680px] w-auto bg-white rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
              
              <h3 className="text-xl font-semibold">Delete Data</h3>
              <button
                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="block w-6 h-6 text-2xl text-black outline-none focus:outline-none">×</span>
              </button>
              
            </div>
            <div className="grid px-2 pt-2">
            <form onSubmit={deleteInventory}>
            <div className="p-4 rounded-md ">
                {/* Assigned To */}
                <h3 className='text-3xl'>Are you sure you want to delete this data? </h3>
            </div>
            <div className="flex justify-center gap-2 py-2 mt-2">
                <button
                  type="submit"
                  
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-2 border-black hover:border-white bg-blue-500 rounded-lg hover:text-black  focus:outline-none focus:ring-2 focus:ring-offset-2 "
                  >
                  Yes
                </button>
                <button
                  onClick={() => onClose()}
                  className="flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-colors border-2 border-black hover:border-white bg-red-400 rounded-lg hover:text-black  focus:outline-none focus:ring-2 focus:ring-offset-2 "
                  >
                  NO
                </button>
            </div> 
            </form>
            </div>
          </div>
        </div>
      </div>
  );

};

export default DeleteInventoryModal;
