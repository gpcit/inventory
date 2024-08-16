import React, { useState } from 'react'
import { lato } from '@/styles/font'
import { AssetInventory } from '@/lib/definition'
import { DeleteInventory, UpdateInventory } from '../buttons'

const CompanyAssetTable = () => {
    const [assetInventories, setAssetInventories] = useState<AssetInventory[]>([])
    const tables = {
        headers: ["Asset Type", "Person-in-Charge", "Amount", "Supplier" , "P.O Number", "Invoice Date", "Delivery Date"]
      }
  return (
    <>
      <div className="gap-2">
        <div className="overflow-x-auto sm:p-2">
          <div className="inline-block min-w-full align-middle">
            <div className="p-2 rounded  md:pt-0">
              <table className={`min-w-full md:table ${lato.className}`}>
                <thead className="text-sm text-left bg-gradient-to-r from-green-600 border-black text-black border-2 rounded-lg">
                  <tr>
                    {tables.headers.map((headerItem, index) => (
                      <th key={index} className="px-4 py-3 text-center" scope="col">
                        {headerItem}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white text-center">
                  {assetInventories?.length === 0 ? (
                    <tr className="">
                      <td colSpan={7} className="text-center"> No data found... </td>
                    </tr>
                  ) : (
                    <>
                    {assetInventories?.map((asset) => (
                      <tr key={asset.id}
                        className="w-full shadow-sm shadow-gray-700 rounded text-sm hover:border-t-0"
                      >
                        <td className="px-3 whitespace-nowrap relative cursor-pointer">
                            <p>{asset.asset_type} </p>
                        </td>
                        <td className="px-3  whitespace-nowrap">
                          {asset.person_in_charge}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {asset.amount}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {asset.supplier}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {asset.po_number}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {asset.invoice_date}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {asset.delivery_date}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-3">
                            <UpdateInventory id={asset.id} onClick={() => ({})}/>
                            <DeleteInventory id={asset.id} onClick={() => ({})}/>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </>
                  )}
                </tbody>
        
        
              </table>
        
                {/* {isEditModalOpen && (
                  <EditAccountModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
                )}
                {isDeleteModalOpen && (
                  <DeleteAccountModal triggerValue={triggerValue} onClose={closeModal} onSubmit={handleFormSubmit} id={selectedId} tablename={getTableName}/>
                )} */}
            </div>
            {/* {!queryValue && totalPages > 0 &&
            <CustomPagination
              pageCount={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageClick}
            />} */}
          </div>
        </div>
        <div className="w-full border-black border mt-10"></div>
      </div>
      <div className="p-4 my-2 border rounded-md bg-white">
          <div className="">
              <h1 className="text-md font-bold">Recent Activity</h1>
              {/* <ActivityLog tablename={inventory_type} originTable={company} onDataSubmitted={handleFormSubmit} /> */}
          </div>
      </div>
    </>
  )
}

export default CompanyAssetTable