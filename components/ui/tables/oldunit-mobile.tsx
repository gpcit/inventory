'use-client'

import { useEffect, useState } from "react";
import { fetchMobileInventoryList } from "@/lib/definition";
import CustomPagination from "@/components/Pagination";

export default function OldMobile() {
    const [inventories, setInventories] = useState<fetchMobileInventoryList[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isValid, setIsValid] = useState(false);

   
    useEffect(() => {
        const fetchOldUnit = async (page: number) => {
            try {
                const response = await fetch(`/api/mobile-oldunit?page=${page}`)
                if(response.ok){
                    const data = await response.json()
                    const get_date = data?.inventory.map((date: any) => date.date_issued)
                    console.log(get_date);
                    setInventories(data.results)
                    setTotalPages(data.totalPages)
                    setCurrentPage(page)
                } else {
                    throw new Error ('Failed to fetch data')
                }
            } catch (error) {
                console.error('Error Fetching Old Mobile:', error)
            }
        }
        fetchOldUnit(currentPage)
        // console.log("this is current page inside useEffect: ", currentPage)
    }, [currentPage])
    
    const handlePageClick = async (selected: { selected: number }) => {
        try {
            const newPage = selected.selected + 1;
            const apiUrlEndpoint = `/api/mobile-oldunit?page=${newPage}`; // Changed
    
            const response = await fetch(apiUrlEndpoint);
            if (response.ok) {
                const data = await response.json();
                setInventories(data.results);
                setTotalPages(data.totalPages);
                setCurrentPage(newPage);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };
    
    // const handlePageClick = async (selected: { selected: number }) => {
    //     try {
    //       const newPage = selected.selected + 1
          
    //       if (newPage > currentPage) {
    //       const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_URL}/api/mobile-oldunit/?page=${newPage}`;
    //       const response = await fetch(apiUrlEndpoint);
    //       const data = await response.json()
    //       setInventories(data.results)
    //       setTotalPages(data.totalPages)
    //       } else if (newPage < currentPage) {
    //       const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_URL}/api/mobile-oldunit/?page=${newPage}`;
    //       const response = await fetch(apiUrlEndpoint);
    //       const data = await response.json()
    //       setInventories(data.results)
    //       setTotalPages(data.totalPages)
    //       }
    //       setCurrentPage(newPage)
    //       console.log("result total page",totalPages);
    //       console.log("result select",currentPage);
    //     } catch ( error) {
    //       console.error('Error fetching inventory data:', error)
    //     }
        
    //   };

    function calculateYearsAge(dateIssued: string): string {
        const dateNow = new Date()
        const issuedDate = new Date(dateIssued);

        let diff = dateNow.getTime() - issuedDate.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let years = Math.floor(days / 365);
        let remainingDays = days % 365;

        const currentYear = dateNow.getFullYear()
        const issuedYear = issuedDate.getFullYear()
        
        for(let year = issuedYear; year < currentYear; year++){
            if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                remainingDays++
            }
        }
        return `${years} years ${remainingDays} days`
    }
    return (
        <>
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
                                Assigned To
                                </th>
                                
                                <th scope="col" className="px-3 py-5 font-medium">
                                IMEI
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                Serial Number
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                Date Issued
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                Age
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                          
                  {inventories.map((inventory) => (
                    <tr key={inventory.id + inventory.source_table}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                    <td className="px-3 py-3 pl-6 whitespace-nowrap">
                        {inventory.source_table}
                    </td>
                      <td className="py-3 pl-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <p>{inventory.assigned_to}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {inventory.imei?.split("IMEI").map((imei, index) => (
                            index > 0 && (
                            <div key={index}>
                                IMEI{imei.trim()}
                            </div>
                        )
                        ))}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {inventory.serial_number}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {inventory.date_issued}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {calculateYearsAge(inventory.date_issued)} 
                      </td>
                    </tr>
                  ))}
                </tbody>
                    </table>
                </div>
                
            </div>
            
        </div>
        <CustomPagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageClick}/>
        </>
        )
}