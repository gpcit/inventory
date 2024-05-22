'use client'
import CustomPagination from "@/components/Pagination";
import { tableName } from "@/lib/company";
import { ActivityLogInventory } from "@/lib/definition"
import { useEffect, useState } from "react"
import { formatInTimeZone } from 'date-fns-tz'

interface ActivityLogProps {
    tablename: string
    originTable: string
    onDataSubmitted: () => void;
}

export default function ActivityLog ({ originTable, tablename, onDataSubmitted}: ActivityLogProps) {

const [activityLog, setActivityLog] = useState<ActivityLogInventory[]>([])
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);

const getQuery = new URLSearchParams(window.location.search)
const queryValue = getQuery.get('query')



useEffect(() => {
  async function fetchActivityLog () {
    try {
       const apiUrlEndpoint = `/api/${tablename}/activity_log`;
       const response = await fetch(apiUrlEndpoint);
       const data = await response.json()
        setActivityLog(data.results);
        setCurrentPage(1);
        setTotalPages(data.totalPages)
        
    } catch (error) {
        console.error('Error fetching data', error)
    }
  }
  fetchActivityLog()
}, [tablename, onDataSubmitted])
// console.log("Result for activity log: ", activityLog)

const handlePageClick = async (selected: { selected: number }) => {
  try {
    const newPage = selected.selected + 1
    
    if (newPage > currentPage) {
    const apiUrlEndpoint = `/api/${tablename}/activity_log?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setActivityLog(data.results)
    setTotalPages(data.totalPages)
    } else if (newPage < currentPage) {
    const apiUrlEndpoint = `/api/${tablename}/activity_log?page=${newPage}`;
    const response = await fetch(apiUrlEndpoint);
    const data = await response.json()
    setActivityLog(data.results)
    setTotalPages(data.totalPages)
    }
    setCurrentPage(newPage)
  } catch ( error) {
    console.error('Error fetching inventory data:', error)
  }
  
};

    return (  
    <div className="overflow-x-auto flex justify-center items-center sm:p-2 text-center">
      <div className="inline-block min-w-full align-middle">
        <div className="p-2 rounded  md:pt-0">
          <table className="min-w-full p-10 table-auto">
            <thead className="text-sm bg-gray-200 text-center text-black border rounded-lg">
              <tr className="text-center">
                <th scope="col" className="px-4 py-1  font-extrabold">
                  User Name
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Company
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Action
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Details
                </th>
                <th scope="col" className="px-3 py-1 font-extrabold">
                  Date Created
                </th>                
              </tr>
            </thead>
            <tbody className="bg-white ">
              {activityLog?.length === 0 || activityLog === undefined ? (
                <tr className="">
                  <td colSpan={7} className="text-center"> No recent activity..</td>
                </tr>
              ) : (
                <>
                {activityLog?.map((activity) => (
                  <tr key={activity.id}
                    className="w-full shadow rounded text-sm "
                  >
                    <td className="px-3 whitespace-nowrap relative cursor-pointer ">
                      {activity.user_name}
                    </td>
                    <td className="px-3  whitespace-nowrap">
                      {activity.company_name}
                    </td>
                    <td className="px-3  whitespace-nowrap">
                      {activity.actions}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {activity.details}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {formatInTimeZone(new Date(activity.date_created), 'Asia/Manila', 'yyyy-MM-dd | HH:mm:ss')}
                    </td>
                  </tr>
                ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        {!queryValue && totalPages > 0 &&
        <CustomPagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />}
      </div>
    </div>     
    )
}