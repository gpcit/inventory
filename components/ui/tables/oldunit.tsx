'use client'
import { useState, useEffect } from "react";
import { FetchInventoryList, InventoryList } from "@/lib/definition";
import { tableName } from "@/lib/company";

export default function Oldunit (){

    const [inventories, setInventories] = useState<FetchInventoryList[]>([]);
   
    const fetchOldUnit = async () => {
        try {
            const response = await fetch('/api/oldunit');
            if(response.ok){
                const data = await response.json();
                setInventories(data.results);
            } else {
                throw new Error('Failed to fetch data')
            }
        } catch (error){
            console.error('Error fetching data: ', error)
        }
      }
      
    useEffect(() => {
          fetchOldUnit()
    }, [])
    function calculateYearsAge(datePurchased: string): string {
    const now = new Date();
    const purchasedDate = new Date(datePurchased);

    // Calculate the difference in milliseconds
    let diff = now.getTime() - purchasedDate.getTime();

    // Convert milliseconds to days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Estimate years and remaining days
    let years = Math.floor(days / 365);
    let remainingDays = days % 365;

    // Adjust for leap years
    const currentYear = now.getFullYear();
    const purchasedYear = purchasedDate.getFullYear();
    for (let year = purchasedYear; year < currentYear; year++) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            remainingDays++; // Add an extra day for leap years
        }
    }

    // Format the output string
    return `${years} years ${remainingDays} days`;
    }

    return (
    <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
            <div className="p-2 rounded-lg bg-gray-50 md:pt-0">
                <table className="min-w-full text-gray-900 md:table">
                    <thead className="text-sm font-normal text-left rounded-lg">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            Company
                            </th>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                            PC Name
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            Mac Address
                            </th>
                            {/* <th scope="col" className="px-3 py-5 font-medium">
                            Computer Type
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            Specs
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            Supplier
                            </th> */}
                            <th scope="col" className="px-3 py-5 font-medium">
                            Date Purchased
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            Age
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {inventories.map((inventory) => (
                          <tr
                            key={inventory.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                          >
                            <td className="px-3 py-3 pl-6 whitespace-nowrap">
                              {inventory.source_table}
                            </td>
                            <td className="py-3 pl-6 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <p>{inventory.pc_name}</p>
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {inventory.mac_address}
                            </td>
                            {/* Uncomment and add other fields as needed */}
                            {/* <td className="px-3 py-3 whitespace-nowrap">
                              {inventory.computer_type}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {inventory.specs}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {inventory.supplier}
                            </td> */}
                            <td className="px-3 py-3 whitespace-nowrap">
                              {inventory.date_purchased}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              {calculateYearsAge(inventory.date_purchased)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {inventories.length === 0 ? (
                  <div className='flex justify-center items-center text-sm'><span>***** There's no data  *****</span></div>
                ): (
                  ''
                )}
        </div>
    </div>
    )
}