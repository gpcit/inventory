"use client"
import Search from "@/components/ui/search";
import Layout from "../layout";
import { lusitana } from "@/styles/font";
import {CreateInventory} from "@/components/ui/buttons";
import { Fragment, use, useEffect, useState } from "react";
import Dropdown from "@/components/ui/dropdowns/dropdown";
import AccountTableInventory from "@/components/ui/tables/mobiletable";
import  {tableName}  from "@/lib/company";
import Form from "@/components/ui/inventory/create-data/CreateMobile";
import Modal from "@/components/modal";
import { MobileInventoryList } from "@/lib/definition";
import Upload from "@/components/Upload";
import toast from "react-hot-toast";

export default function Page(){
const [isModalOpen, setIsModalOpen] = useState(false);
const [value, setValue] = useState<string>("")
const [tablename, setTableName] = useState<string>("")
const [mobileInventory, setMobileInventory] = useState<MobileInventoryList[]>([])
const [dataUploaderHandler, setDataUploaderHandler] = useState<() => void>(() => () => {}) 

    let name = tableName.find(company => company.name === value)?.displayName || value
    let getName = tableName.find(company => company.name === tablename)?.name || tablename
    let getTable = tableName.find(company => company.name === tablename)?.table || tablename

    const handleDropdown = (value: string) => {
        const pageLoading = toast.loading(`Selecting company, Please wait...`, {duration: 2500})
        setTimeout(() => {
        toast.success(`Loading Successful`, {id: pageLoading})
            setTableName(value)
            setValue(value)
        }, 2000)
    }
    
    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const handleFormSubmit = async () =>{
        closeModal();
        dataUploaderHandler();
    }
    
    useEffect(()=> {
        if(tablename) {
        const handleDataUploaded = async () => {
        try {
            const apiUrlEndpoint = `/api/${getTable}/cellphones`
            const response = await fetch(apiUrlEndpoint);
            const data = await response.json();
            setMobileInventory(data.results)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }
        setDataUploaderHandler(() => handleDataUploaded)
        handleDataUploaded()
        // to use the handleDataUploaded function outside the useEffect
       } 
    }, [tablename, getTable])
    
    
    return (
        <Layout>
            <div className=" p-5 border border-collapse rounded shadow-2xl mx-5 relative mt-5">
                <div className="flex items-center justify-between w-full">
                    <h1 className={`${lusitana.className} text-2xl`}> {name} Mobile</h1>
                </div>
                <div className="flex items-center justify-between gap-2 mt-4 md:mt-8">
                    
                   {name !== '' && <> <Search placeholder="Search...." /><CreateInventory onClick={openModal}/> </>}
                </div>
                    {getTable !== '' && (mobileInventory?.length === 0 || mobileInventory === undefined) && <Upload tablename={getTable} onDataUploaded={dataUploaderHandler}/>}
                <div className="flex flex-row items-center mt-1">
                    <div className="relative flex flex-col items-center justify-between md:mt-2">
                        <label className="">Select Company:</label>
                        <Dropdown onCompanyChange={handleDropdown} />
                    </div>
                </div>
                {name !== '' && <AccountTableInventory getTableName={getTable} onDataSubmitted={handleFormSubmit}/>}
                {isModalOpen && (
                        <Modal onClose={closeModal} title="Mobile" companyName={name} onSubmit={handleFormSubmit} tablename={getTable}>
                            <Form gettableName={getTable} onDataSubmitted={handleFormSubmit}/>
                        </Modal>
                    )}
            </div>
        </Layout>
    )
}