"use client"
import Search from "@/components/ui/search";
import Layout from "../layout";
import { FC } from "react";
import { lato, lusitana } from "@/styles/font";
import {CreateInventory, ExportInventory} from "@/components/ui/buttons";
import { Fragment, use, useEffect, useState } from "react";
import Dropdown from "@/components/ui/dropdowns/dropdown";
import MobileTableInventory from "@/components/ui/tables/mobiletable";
import  {tableName}  from "@/lib/company";
import Form from "@/components/ui/inventory/create-data/CreateMobile";
import Modal from "@/components/modal";
import { MobileInventoryList } from "@/lib/definition";
import Upload from "@/components/Upload";
import toast from "react-hot-toast";
import StatusToggle from "@/components/StatusToggle";
import { duration } from "html2canvas/dist/types/css/property-descriptors/duration";
import Head from "next/head";

export default function Page(){
const [isModalOpen, setIsModalOpen] = useState(false);
const [value, setValue] = useState<string>("")
const [loading, setLoading] = useState<boolean>(true);
const [tablename, setTableName] = useState<string>("")
const [mobileInventory, setMobileInventory] = useState<MobileInventoryList[]>([])
const [triggerValue, setTriggerValue] = useState<string>("active")
const [dataUploaderHandler, setDataUploaderHandler] = useState<() => void>(() => () => {}) 

    let name = tableName.find(company => company.name === value)?.displayName || value
    let getName = tableName.find(company => company.name === tablename)?.name || tablename
    let getTable = tableName.find(company => company.name === tablename)?.table || tablename
    let get_status = mobileInventory.map(status => status.is_active_id)
    
    // function for changing company
    const handleDropdown = (value: string) => {
        if(name === '') {
            setTriggerValue("active");
        }
        setTableName(value)
        setValue(value)
    }
    
    // function for create modal
    const openModal = () => {
        setIsModalOpen(true);
    }
    // function for closing create modal
    const closeModal = () => {
        setIsModalOpen(false)
    }
    // this function is handling for closing modal after successfully edit or create data
    const handleFormSubmit = async () =>{
        closeModal();
    }
    // this will be effect after successfully import excel file data
    useEffect(()=> {
        if(tablename) {
        const handleDataUploaded = async () => {
        try {
            let apiUrlEndpoint
            apiUrlEndpoint = `/api/${getTable}/cellphone`
            const response = await fetch(apiUrlEndpoint);
            const data = await response.json();
            setMobileInventory(data.results)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        setDataUploaderHandler(() => handleDataUploaded)
        handleDataUploaded()
        setLoading(false)
        // to use the handleDataUploaded function outside the useEffect
       } 
    }, [tablename, getTable])
    // this function is for StatusToggle and handling triggerValue
    const handleTrigger = () =>{
        if(triggerValue === 'active') {
            setTriggerValue(triggerValue === 'active' ? 'inactive' : 'active')
        } else {
            setTriggerValue(triggerValue === 'inactive' ? 'active' : 'inactive')
        }
    }
    
    return (
        <Layout>
            <Head>
            <title>GPC | Cellphone</title>
            <meta name="description" content="List of inventory for Mobile Phones" />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <div className={`p-2 border rounded shadow-2xl shadow-black relative ${name === '' ? 'h-screen' : 'h-full'} bg-gray-100`}>
                <div className="p-5 border bg-white rounded">
                    <div className="flex items-center justify-between w-full">
                        <h1 className={`${lato.className} text-2xl`}> {name} Mobile</h1>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-12">
                
                       {name !== '' && <> <Search placeholder="Search...." /><CreateInventory onClick={openModal}/> </>}
                    </div>
                        {getTable !== '' && (mobileInventory?.length === 0 || mobileInventory === undefined) && <Upload tablename={getTable} onDataUploaded={dataUploaderHandler}/>}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center mt-1">
                            <div className="relative flex flex-col items-center justify-between md:mt-2">
                                <label className="">Select Company:</label>
                                <Dropdown onCompanyChange={handleDropdown} />
                            </div>
                            
                        </div>
                        <div className="mx-2">
                        {name !=='' &&  <StatusToggle loading={loading} onChange={handleTrigger}/> }
                        </div>
                    </div>
                    {name !=='' && <MobileTableInventory inventory_type="mobile" triggerValue={triggerValue} getTableName={getTable} onDataSubmitted={handleFormSubmit}/>}
                    {isModalOpen && (
                            <Modal onClose={closeModal} title="Mobile" companyName={name} onSubmit={handleFormSubmit} tablename={getTable}>
                                <Form tablename={getTable} onDataSubmitted={handleFormSubmit} triggerValue={triggerValue}/>
                            </Modal>
                        )}
                </div>
            </div>
        </Layout>
    )
}