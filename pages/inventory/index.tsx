"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import  {branchName, branchTableMap, tableName, tableInventoryMap} from "@/lib/company";
import { lusitana } from "@/styles/font";
import GPCInventoryTable from "@/components/ui/tables/inventorytable";
import Dropdown from "@/components/ui/dropdowns/dropdown";
import Layout from "../layout";
import { CreateInventory } from "@/components/ui/buttons";
import Modal from "@/components/modal";
import Form from "@/components/ui/inventory/create-data/CreateInventory";
import { InventoryList } from "@/lib/definition";
import Search from "@/components/ui/search";
import Upload from "@/components/Upload";
import AreaChartView from "@/components/AreaChart";
import Card, { CardBody, CardHeader } from "@/components/CardLayout";
import GetBranch from "@/components/ui/dropdowns/select-company";
import toast from "react-hot-toast";
import { duration } from "html2canvas/dist/types/css/property-descriptors/duration";
import StatusToggle from "@/components/StatusToggle";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Page({searchParams,}:{searchParams?: {search?: string}}) {
    let search = searchParams?.search || ''
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inventories, setInventories] = useState<InventoryList[]>([]);
    const [company, setCompany] = useState<string>("");
    const [branch, setBranch] = useState<string>("");
    const [tblName, setTblName] = useState<string>("");
    const [triggerValue, setTriggerValue] = useState<string>("active")
    const [dataUploaderHandler, setDataUploaderHandler] = useState<() => void>(() => () => {})
    const { data: session, status } = useSession();
    const router = useRouter();
    
    let initial = tableInventoryMap[tblName] || ''
    let name = tableName.find(companyName => companyName.name === company)?.displayName || ''
        
    let table = tableName.find(company => company.name === tblName)?.name || ''
    let mobileTable = tableName.find(company => company.name === tblName)?.table || tblName
    // const inventories = await fetchGPCInventoryList()
    // console.log(inventories)

    // modal for edit
    const openModal = () =>{
        setIsModalOpen(true);
    }

    // close modal
    const closeModal = () => {
        setIsModalOpen(false)
    }
   
    // Handle selecting company
    const handleCompanyChange = (value: string) => {
        if(value === 'gpc_inventory'){
            setBranch('Balintawak')
        } else if (value === 'lsi_inventory') {
            setBranch('Valenzuela');
        } else {
            setBranch('')
        }
    //    search === " "
            setCompany(value)
            setTblName(value)
    }
    useEffect(() => {
        if(tblName){
        const handleDataUploaded = async () =>{
            try {
                const apiUrlEndpoint = `/api/${tblName}`
                const response = await fetch(apiUrlEndpoint);
                const data = await response.json()
                setInventories(data.results)
            } catch (error){
                console.error('Error fetching data: ', error)
            }
        }
        setDataUploaderHandler(() => handleDataUploaded)
        handleDataUploaded()
        }
    }, [tblName])
    
    // this function is trigger after successfully add or edit a data
    const handleFormSubmit = async () =>{
        closeModal();
        // await getPageData();
        dataUploaderHandler()
    }

    // this will be effect after successfully upload excel file
   
    // this function handle changing branch
    const handleBranchChange = (value: string) => {
        const branchTableName = branchTableMap[value as keyof typeof branchTableMap] || company;
        const companyChange = toast.loading('Please wait...', {duration: 3000})
        setTimeout(() => {
            toast.success('Loading successful!', {id: companyChange})
            setBranch(value)
            setTblName(branchTableName)
            dataUploaderHandler()
        }, 2000)
    }
    // This function for StatusToggle and handling triggerValue 
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
            <title>GPC | Computers and Laptops</title>
            <meta name="description" content="List of inventory for Computers and Laptops" />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <div className={`p-2 border rounded shadow-2xl shadow-black relative ${initial === '' ? 'h-screen' : 'h-full'} bg-gray-100`}>
                <div className="p-5 border bg-white rounded">
                    <div className="grid grid-rows-1 self-end w-full">
                        <h1 className={`${lusitana.className} text-2xl`}> {initial} Inventory</h1>
                
                        <div className="relative flex flex-col  w-28 top-2 sm:top-7">
                        {(company === 'gpc_inventory' || company === 'lsi_inventory') && branchName.length > 1 && (
                            <>
                            <span>Change Branch: </span>
                            <div className=" border-gray-400">
                                 <GetBranch onCompanyChange={handleBranchChange} getCompany={company} />
                            </div>
                            </>
                        )}
                        </div>
                
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-4 md:mt-8">
                        {tblName !== "" && <><Search placeholder="Search..." /> <CreateInventory onClick={openModal}/></> }
                    </div>
                        {(tblName !== '' || company !=='') && (inventories?.length === 0 || inventories === undefined ) && <Upload tablename={tblName} onDataUploaded={dataUploaderHandler} />}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center mt-1">
                            <div className="relative flex flex-col items-center justify-between md:mt-2">
                                <label className="">{company === '' ? 'Select' : 'Change' } Company:</label>
                                <Dropdown onCompanyChange={handleCompanyChange} />
                            </div>
                        </div>
                        <div className="mx-2">
                            {initial !=='' &&  <StatusToggle loading={false} onChange={handleTrigger} /> }
                        </div>
                    </div>
                
                        {company === 'gpc_inventory' && branch === 'Balintawak' && <GPCInventoryTable inventory_type="computer" triggerValue={triggerValue} query={search} gettableName={company} onDataSubmitted={handleFormSubmit}/>}
                        {company === 'gpc_inventory' && branch === 'SQ'  && <GPCInventoryTable inventory_type="computer" triggerValue={triggerValue} query={search} gettableName={tblName} onDataSubmitted={handleFormSubmit}/>}
                
                        {company === 'lsi_inventory' && branch === 'Valenzuela' && <GPCInventoryTable inventory_type="computer" triggerValue={triggerValue} query={search} gettableName={company} onDataSubmitted={handleFormSubmit}/>}
                        {company === 'lsi_inventory' && branch === 'Canlubang'  && <GPCInventoryTable inventory_type="computer" triggerValue={triggerValue} query={search} gettableName={tblName} onDataSubmitted={handleFormSubmit}/>}
                
                        {(company !== 'gpc_inventory' && company !== 'lsi_inventory' ) && company !== '' && <GPCInventoryTable inventory_type="computer" triggerValue={triggerValue} query={search} gettableName={company} onDataSubmitted={handleFormSubmit}/>}
                
                
                
                        {isModalOpen && (
                            <Modal onClose={closeModal} title={branch} companyName={name} onSubmit={handleFormSubmit} tablename={tblName}>
                                <Form triggerValue={triggerValue} tablename={tblName} onDataSubmitted={handleFormSubmit}/>
                            </Modal>
                        )}
                
                </div>
                { company === '' &&
                <div className=" p-6 mt-2 flex justify-center items-center">
                    <Card>
                        <Card.Header>{name} Inventory</Card.Header>
                        <Card.Body>
                            <div className="lg:h-[500px] sm:h-[200px] ">
                                <AreaChartView tableName={table} mobileTable={mobileTable} />
                            </div>
                        </Card.Body>
                    </Card>
                </div>}
            </div>
            
        </Layout>
        
     )
}
