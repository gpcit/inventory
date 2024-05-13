"use client"
import { ExportInventory } from "@/components/ui/buttons";
import Layout from "./layout";
import { lato } from "@/styles/font";
import { useState } from "react";
import toast from "react-hot-toast";
import StatusToggle from "@/components/StatusToggle";
import GetBranch from "@/components/ui/dropdowns/select-company";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Page() {
    const [getTable, setGetTable] = useState<string>("")
    const [selectedBranch, setSelectedBranch] = useState("Balintawak")

    const handleradioChange = (tableName: string) => {
            setGetTable(tableName)
    }

    const handleBranchChange = (branch: string) => {
        setSelectedBranch(branch)
        console.log("Getting branch", selectedBranch)
    }

    const isCellphoneDisabled = () => {
        const disabledBranches = ["SQ", "Canlubang"]
        return selectedBranch ? disabledBranches.includes(selectedBranch) : false
    }

    const clearSelection = () => {
        setGetTable("")
    }
    const handleExport = async () => {
        const exportLoading = toast.loading(`Exporting data`, {duration: 3000})
        if(getTable) {
            try {
                
                const response = await fetch(`/api/${getTable}/export`)
                console.log("Result for Response: ", response)
                
                if (response.ok) {

                    const blob = await response.blob();
                    setTimeout(() => {
                    // Create a temporary object URL for the blob
                    const url = window.URL.createObjectURL(blob);
            
                    // Create a temporary anchor element to trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${getTable}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
            
                    // Revoke the object URL to release browser resources
                    window.URL.revokeObjectURL(url);
            
                    // Remove loading toast and show success message
                    toast.success('File exported successfully!', { id: exportLoading });
                    }, 2500)
                } else {
                    throw new Error('Failed to export data');
                }
                
            } catch (error) {
                console.error("Error exporting Data: ", error)
            }
        } else {
            setTimeout(() => {
                toast.error("No table selected for export", {id: exportLoading})
                console.error("No table selected for export")
            }, 2500)
            
        }
    }
    return (
        <Layout>
            <div className=" p-3 border rounded shadow-2xl shadow-black mx-2 relative mt-6 sm:mt-1 h-screen bg-gray-100">
                <div className="p-5 border bg-white rounded">
                    <h1 className={`${lato.className} text-2xl`}> Export Data</h1>
                    <div className="border border-black mt-5"></div>
                    <div className="py-2 items-end justify-end flex">
                        <span>Refresh</span>
                        <ArrowPathIcon onClick={() => clearSelection()} className="w-5 h-5 ml-2" />
                    </div>
                    <div className="grid grid-cols-8 sm:p-10">
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="p-5 mt-2 md:col-span-3 col-span-4">
                            <div className="flex sm:justify-between flex-col sm:flex-row justify-around sm:items-center items-start">
                                <div>
                                    <h3 className="text-2xl">GPC</h3>
                                </div>
                                <div className="flex items-center flex-row sm:flex-col py-2">
                                    <span className="text-sm me-1">Select Branch</span>
                                    <GetBranch onCompanyChange={handleBranchChange} getCompany="gpc_inventory"/>
                                </div>
                            </div> 
                            {selectedBranch === "Balintawak" && 
                            <div className="border rounded-md border-gray-200 p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_inventory"}
                                        onChange={() => handleradioChange("gpc_inventory")}
                                        id="gpcCpuLaptop" 
                                    />
                                    <label htmlFor="gpcCpuLaptop"> CPU / Laptop</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_mobile_inventory"}
                                        onChange={() => handleradioChange("gpc_mobile_inventory")}
                                        id="gpcMobile" 
                                        disabled={isCellphoneDisabled()}
                                    />
                                    <label htmlFor="gpcMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_printer"}
                                        onChange={() => handleradioChange("gpc_printer")}
                                        id="gpcPrinter" 
                                    />
                                    <label htmlFor="gpcPrinter"> Printer</label>
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_accounts"}
                                        onChange={() => handleradioChange("gpc_accounts")}
                                        id="gpcAccounts" 
                                    />
                                    <label htmlFor="gpcAccounts"> Server Accounts</label>
                                </div>
                            </div>
                            }
                            {selectedBranch === "SQ" && 
                            <div className="border rounded-md border-gray-200 p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_inventory"}
                                        onChange={() => handleradioChange("gpc_sq_inventory")}
                                        id="gpcCpuLaptop" 
                                    />
                                    <label htmlFor="gpcCpuLaptop"> CPU / Laptop</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_mobile_inventory"}
                                        onChange={() => handleradioChange("gpc_sq_mobile_inventory")}
                                        id="gpcMobile" 
                                        disabled={isCellphoneDisabled()}
                                    />
                                    <label htmlFor="gpcMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_printer"}
                                        onChange={() => handleradioChange("gpc_sq_printer")}
                                        id="gpcPrinter" 
                                    />
                                    <label htmlFor="gpcPrinter"> Printer</label>
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_accounts"}
                                        onChange={() => handleradioChange("gpc_sq_accounts")}
                                        id="gpcAccounts" 
                                    />
                                    <label htmlFor="gpcAccounts"> Server Accounts</label>
                                </div>
                            </div>
                            }
                        </div>
                        <div className="p-5 mt-2 md:col-span-3 col-span-4">
                            <div className="flex sm:justify-between flex-col sm:flex-row justify-around sm:items-center items-start">
                                <div>
                                    <h3 className="text-2xl">LSI</h3>
                                </div>
                                <div className="flex items-center flex-row sm:flex-col py-2">
                                    <span className="text-sm me-1">Select Branch</span>
                                    <GetBranch onCompanyChange={() => {}} getCompany="gpc_inventory"/>
                                </div>
                            </div>
                            <div className="border rounded-md border-gray-200 p-5  grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_inventory"}
                                        onChange={() => handleradioChange("lsi_inventory")}
                                        id="lsiCpuLaptop" 
                                    />
                                    <label htmlFor="lsiCpuLaptop"> CPU / Laptop</label>   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_mobile_inventory"}
                                        onChange={() => handleradioChange("lsi_mobile_inventory")}
                                        id="lsiMobile" 
                                    />
                                    <label htmlFor="lsiMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_printer"}
                                        onChange={() => handleradioChange("lsi_printer")}
                                        id="lsiPrinter" 
                                    />
                                    <label htmlFor="lsiPrinter"> Printer</label>
                                   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_accounts"}
                                        onChange={() => handleradioChange("lsi_accounts")}
                                        id="lsiAccounts" 
                                    />
                                    <label htmlFor="lsiAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="p-5 mt-2 md:col-span-3 col-span-4">
                            <h3 className="text-2xl">GKC</h3>
                            <div className="border rounded-md border-gray-200 p-5  grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gkc"
                                        checked={getTable === "gkc_inventory"}
                                        onChange={() => handleradioChange("gkc_inventory")}
                                        id="gkcCpuLaptop" 
                                    />
                                    <label htmlFor="gkcCpuLaptop"> CPU / Laptop</label> 
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gkc"
                                        checked={getTable === "gkc_mobile_inventory"}
                                        onChange={() => handleradioChange("gkc_mobile_inventory")}
                                        id="gkcMobile" 
                                    />
                                    <label htmlFor="gkcMobile"> Cellphone</label>  
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gkc"
                                        checked={getTable === "gkc_printer"}
                                        onChange={() => handleradioChange("gkc_printer")}
                                        id="gkcPrinter" 
                                    />
                                    <label htmlFor="gkcPrinter"> Printer</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gkc"
                                        checked={getTable === "gkc_accounts"}
                                        onChange={() => handleradioChange("gkc_accounts")}
                                        id="gkcAccounts" 
                                    />
                                    <label htmlFor="gkcAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-5 mt-2 md:col-span-3 col-span-4">
                            <h3 className="text-2xl">GSRC</h3>
                            <div className="border rounded-md border-gray-200 p-5  grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gsrc"
                                        checked={getTable === "gsrc_inventory"}
                                        onChange={() => handleradioChange("gsrc_inventory")}
                                        id="gsrcCpuLaptop" 
                                    />
                                    <label htmlFor="gsrcCpuLaptop"> CPU / Laptop</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gsrc"
                                        checked={getTable === "gsrc_mobile_inventory"}
                                        onChange={() => handleradioChange("gsrc_mobile_inventory")}
                                        id="gsrcMobile" 
                                    />
                                    <label htmlFor="gsrcMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gsrc"
                                        checked={getTable === "gsrc_printer"}
                                        onChange={() => handleradioChange("gsrc_printer")}
                                        id="gsrcPrinter" 
                                    />
                                    <label htmlFor="gsrcPrinter"> Printer</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gsrc"
                                        checked={getTable === "gsrc_accounts"}
                                        onChange={() => handleradioChange("gsrc_accounts")}
                                        id="gsrcAccounts" 
                                    />
                                    <label htmlFor="gsrcAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <ExportInventory table={getTable} onClick={handleExport} />
                </div>
            </div>
        </Layout>
    )
}