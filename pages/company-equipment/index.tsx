import React from 'react'
import Layout from '../layout'
import Head from 'next/head'
import { tableName } from '@/lib/company'
import CompanyAssetTable from '@/components/ui/tables/CompanyAssetTable'
import { CreateInventory } from '@/components/ui/buttons'
import Search from '@/components/ui/search'

function CompanyEquipment() {
  return (
    <Layout>
            <Head>
            <title>GPC | Company Asset</title>
            <meta name="description" content="List of Company Assets" />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <div className={`p-2 border rounded shadow-2xl shadow-black relative  h-screen bg-gray-100`}>
                <div className="border rounded p-5 bg-white">
                    <div className="grid grid-rows-1 self-end w-full">
                        <h1>Company Equipments</h1>
                        <div className="relative flex flex-col  w-28 top-2 sm:top-7">
                          
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-4 md:mt-8">
                    { <> <Search placeholder="Search...." /> <CreateInventory onClick={() => ({})} /> </>}
                    </div>
                        
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center mt-1">
                            <div className="relative flex flex-col items-center justify-between md:mt-2">
                                
                            </div>
                        </div>
                        <div className="mx-2">
                        </div>
                    </div>
                    <CompanyAssetTable />
                </div>
            </div>  
        </Layout>
  )
}

export default CompanyEquipment