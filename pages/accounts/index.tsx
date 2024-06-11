"use client"
import Layout from "../layout";
import { lato } from "@/styles/font";
import { tableName, branchName, accountTableMap } from "@/lib/company";
import { useEffect, useState } from "react";
import Dropdown from "@/components/ui/dropdowns/dropdown";
import Search from "@/components/ui/search";
import { CreateInventory } from "@/components/ui/buttons";
import { ServerAccountsInventory } from "@/lib/definition";
import Upload from "@/components/Upload";
import AccountInventoryTable from "@/components/ui/tables/accounttable";
import Modal from "@/components/modal";
import Form from "@/components/ui/inventory/create-data/CreateAccount";
import GetBranch from "@/components/ui/dropdowns/select-company";
import toast from "react-hot-toast";
import StatusToggle from "@/components/StatusToggle";
import ActivityLog from "@/components/ui/tables/activity_log";

export default function Page() {
    const [valueX, setValueX] = useState<string>("")
    const [branch, setBranch] = useState<string>("")
    const [tablename, setTablename] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [tableAccounts, setTableAccounts] = useState<ServerAccountsInventory[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [triggerValue, setTriggerValue] = useState("active")
    const [dataUploaderHandler, setDataUploaderHandler]  = useState<() => void>(() => () => {})
    const [activityLogKey, setActivityLogKey] = useState(0);

    const name = tableName.find(display => display.name === valueX)?.displayName || valueX
    const companyName = tableName.find(company => company.name === valueX)?.company || valueX
    const gettable = tableName.find(table => table.name === tablename)?.accounts || tablename
    const title = "Accounts"

    const handleDropdown = (value: string) => {
        const pageLoading = toast.loading(`Selecting company, Please wait...`, {duration: 3000})
        setTimeout(() => {
            toast.success(`Loading Successful`, {id: pageLoading})
            if(value === 'gpc_inventory') {
                setBranch('Balintawak')
                setTablename('gpc_accounts')
            } else if (value === 'lsi_inventory') {
                setBranch('Valenzuela')
                setTablename('lsi_accounts')
            } else if (value === 'gkc_inventory') {
                setTablename('gkc_accounts')
            } else if (value === 'gsrc_inventory') {
                setTablename('gsrc_accounts')
            } else if (value === 'gcc_inventory') {
                setTablename('gcc_accounts')
            } else if (value === 'steniel_inventory') {
                setTablename('steniel_accounts')
            } else {
                setBranch('')
            }
            if(name === '') {
                setTriggerValue("active");
            }
            setCompany(value)
            setValueX(value)
        }, 2000)
        
    }
    const openModal = () => {
        setIsModalOpen(true)
        console.log("result for clicking add new data: " ,gettable ,branch)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const handleFormSubmit = () => {
        setActivityLogKey(prevKey => prevKey + 1);
        closeModal()
    }
    const handleEditSubmit = () => {
        setActivityLogKey(prevKey => prevKey + 1);
        closeModal()
    }
    useEffect(() => {
        setActivityLogKey(prevKey => prevKey + 1);
    }, [])
    useEffect(() => {
        if(tablename) {
            const handleDataUploaded = async () => {
                try {
                    const url = `/api/${gettable}/accounts`;
                    const response = await fetch(url);
                    const data = await response.json();
                    setTableAccounts(data.results);
                } catch (error) {
                    console.error('Unable to fetch data: ', error);
                }
            }
            setDataUploaderHandler(() => handleDataUploaded)
            handleDataUploaded();
        }
    }, [gettable, tablename])

    const handleBranchChange = (value: string) => {
        const branchTableName = accountTableMap[value as keyof typeof accountTableMap] || value;
        const companyChange = toast.loading(`Changing branch...`, {duration: 3000})
        
        setTimeout(() => {
            toast.success('Changed successful!', {id: companyChange})
            setTablename(branchTableName)
            setBranch(value)
            dataUploaderHandler()
        }, 2000)
    }

    const handleTrigger = () =>{
        if(triggerValue === 'active') {
            setTriggerValue(triggerValue === 'active' ? 'inactive' : 'active')
        } else {
            setTriggerValue(triggerValue === 'inactive' ? 'active' : 'inactive')
        }
    }

    return (
        <Layout>
            <div className={`p-2 border rounded shadow-2xl shadow-black relative ${name === '' ? 'h-screen' : 'h-full'} bg-gray-100`}>
                <div className="border rounded p-5 bg-white">
                    <div className="grid grid-rows-1 self-end w-full">
                        <h1 className={`${lato.className} text-2xl`}> {name} Server Accounts</h1>
                        <div className="relative flex flex-col  w-28 top-2 sm:top-7">
                        {(valueX === 'gpc_inventory' || valueX === 'lsi_inventory') && branchName.length > 1 && (
                            <>
                            <span>Change Branch: </span>
                            <div className=" w-full border-gray-400">
                                 <GetBranch onCompanyChange={handleBranchChange} getCompany={valueX} />
                            </div>
                            </>
                        )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-4 md:mt-8">
                
                       {name !== '' && <> <Search placeholder="Search...." /><CreateInventory onClick={openModal} /> </>}
                    </div>
                        {name && gettable !== '' && (tableAccounts?.length === 0 || tableAccounts === null || tableAccounts === undefined) && <Upload tablename={gettable} onDataUploaded={dataUploaderHandler}/>}
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row items-center mt-1">
                            <div className="relative flex flex-col items-center justify-between md:mt-2">
                                <label className="">{name === '' ? 'Select' : 'Change'} Company:</label>
                                <Dropdown onCompanyChange={handleDropdown} />
                            </div>
                        </div>
                        <div className="mx-2">
                        {name !=='' &&  <StatusToggle loading={false} onChange={handleTrigger} /> }
                        </div>
                    </div>
                    {company === 'gpc_inventory' && branch === 'Balintawak' && <AccountInventoryTable inventory_type="account" triggerValue={triggerValue} getTableName={tablename} onDataSubmitted={handleFormSubmit}/>}
                        {company === 'gpc_inventory' && branch === 'SQ'  && <AccountInventoryTable inventory_type="account" triggerValue={triggerValue} getTableName={tablename} onDataSubmitted={handleFormSubmit}/>}
                
                        {company === 'lsi_inventory' && branch === 'Valenzuela' && <AccountInventoryTable inventory_type="account" triggerValue={triggerValue} getTableName={tablename} onDataSubmitted={handleFormSubmit}/>}
                        {company === 'lsi_inventory' && branch === 'Canlubang'  && <AccountInventoryTable inventory_type="account" triggerValue={triggerValue} getTableName={tablename} onDataSubmitted={handleFormSubmit}/>}
                    {(company !== 'gpc_inventory' && company !== 'lsi_inventory' ) && company !== '' && <AccountInventoryTable inventory_type="account" triggerValue={triggerValue} getTableName={gettable} onDataSubmitted={handleFormSubmit}/>}
                    {isModalOpen && (
                            <Modal onClose={closeModal} title={`${branch} Accounts`} companyName={name} onSubmit={handleFormSubmit} tablename={gettable}>
                                <Form triggerValue={triggerValue} tablename={gettable} onDataSubmitted={handleFormSubmit}/>
                            </Modal>
                        )}
                </div>
            </div>  
        </Layout>
    )
}