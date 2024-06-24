"use client"
import { ExportInventory } from "@/components/ui/buttons";
import Layout from "./layout";
import { lato } from "@/styles/font";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { accountTables } from "@/lib/company";

export default function Page() {
    const [getTable, setGetTable] = useState<string>("")
    const [selectedBranch, setSelectedBranch] = useState("Balintawak")
    const [selectedLSIBranch, setSelectedLSIBranch] = useState("Valenzuela")
    const [isLoading, setIsLoading] = useState(false);

    const handleradioChange = (tableName: string) => {
            setGetTable(tableName)
    }
    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const values = event.target.value
        setSelectedBranch(values)
        // window.location.href = `/dashboard/inventory/${values}`;
    }
    const handleLsiBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const values = event.target.value
        setSelectedLSIBranch(values)
        // window.location.href = `/dashboard/inventory/${values}`;
    }
    const resetBrach = () => {
        setSelectedBranch("Balintawak")
        setSelectedLSIBranch("Valenzuela")
    }
    const isCellphoneDisabled = () => {
        const disabledBranches = ["SQ", "Canlubang"]
        return selectedBranch ? disabledBranches.includes(selectedBranch) : false
    }

    const fileName = getTable.split('_')?.join(' ')

    const sheetName = accountTables[getTable] || ''

    const clearSelection = () => {
        
        setIsLoading(true)
        setTimeout(() => {
            resetBrach()
            setGetTable("")
            setIsLoading(false)
        }, 2000)
        
    }
    const handleExport = async () => {
        const exportLoading = toast.loading(`Exporting data`, {duration: 3000})
        if(getTable) {
            try {
                
                const response = await fetch(`/api/${getTable}/export`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sheetName })
                })
                console.log("Result for Response: ", response)
                
                if (response.ok) {

                    const blob = await response.blob();
                    setTimeout(() => {
                    // Create a temporary object URL for the blob
                    const url = window.URL.createObjectURL(blob);
            
                    // Create a temporary anchor element to trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${fileName}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
            
                    // Revoke the object URL to release browser resources
                    window.URL.revokeObjectURL(url);
            
                    // Remove loading toast and show success message
                    toast.success('File exported successfully!', { id: exportLoading });
                    }, 2500)
                } else {
                    setTimeout(() => {
                        toast.error(`Failed to export data or No existing data`, {id: exportLoading})
                    }, 2500)
                    
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
            <div className=" p-3 border rounded shadow-2xl shadow-black relative mt-6 sm:mt-1 h-screen bg-gray-100">
                <div className="p-5 border bg-white rounded">
                    <h1 className={`${lato.className} text-2xl`}> Export Data</h1>
                    <div className="border border-black mt-5"></div>
                    <div className="py-2 items-end justify-end flex">
                        <span>Refresh</span>
                        <ArrowPathIcon onClick={() => clearSelection()} className={`w-5 h-5 ml-2 ${isLoading ? "animate-spin" : ""}`} />
                    </div>
                    <div className="grid sm:grid-cols-8 grid-cols-6 sm:p-10">
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="p-5 mt-2 md:col-span-3 sm:col-span-2 col-span-3">
                            <div className="flex sm:justify-between flex-col sm:flex-row justify-around sm:items-center items-start">
                                <div>
                                    <h3 className="text-2xl">GPC</h3>
                                </div>
                                <div className="flex items-center flex-row sm:flex-col py-2">
                                    <span className="text-sm me-1">Select Branch</span>
                                    <select
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md text-green-800 focus:outline-none font-extrabold focus:border-black ">
                                        <option value="Balintawak">Balintawak</option>
                                        <option value="SQ">SQ</option>
                                    </select>
                                </div>
                            </div> 
                            {selectedBranch === "Balintawak" || selectedBranch === "Canlubang" || selectedBranch === "Valenzuela" ? ( 
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_inventory"}
                                        onChange={() => setGetTable("gpc_inventory")}
                                        id="gpcCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="gpcCpuLaptop"> CPU / Laptop</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_mobile_inventory"}
                                        onChange={() => setGetTable("gpc_mobile_inventory")}
                                        id="gpcMobile" 
                                        disabled={isCellphoneDisabled()}
                                    />
                                    <label className="text-sm" htmlFor="gpcMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_printer"}
                                        onChange={() => setGetTable("gpc_printer")}
                                        id="gpcPrinter" 
                                    />
                                    <label className="text-sm" htmlFor="gpcPrinter"> Printer</label>
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_accounts"}
                                        onChange={() => setGetTable("gpc_accounts")}
                                        id="gpcAccounts" 
                                    />
                                    <label className="text-sm" htmlFor="gpcAccounts"> Server Accounts</label>
                                </div>
                            </div>
                            ) : (      
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_inventory"}
                                        onChange={() => setGetTable("gpc_sq_inventory")}
                                        id="gpcCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="gpcCpuLaptop"> CPU / Laptop</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_mobile_inventory"}
                                        onChange={() => setGetTable("gpc_sq_mobile_inventory")}
                                        id="gpcMobile" 
                                        disabled
                                    />
                                    <label className="text-sm" htmlFor="gpcMobile"> Cellphone</label>   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_printer"}
                                        onChange={() => setGetTable("gpc_sq_printer")}
                                        id="gpcPrinter" 
                                    />
                                    <label className="text-sm" htmlFor="gpcPrinter"> Printer</label>
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gpc"
                                        checked={getTable === "gpc_sq_accounts"}
                                        onChange={() => setGetTable("gpc_sq_accounts")}
                                        id="gpcAccounts" 
                                    />
                                    <label className="text-sm" htmlFor="gpcAccounts"> Server Accounts</label>
                                </div>
                            </div>
                            )}
                        </div>
                        <div className="p-5 mt-2 md:col-span-3 sm:col-span-2 col-span-3">
                            <div className="flex sm:justify-between flex-col sm:flex-row justify-around sm:items-center items-start">
                                <div>
                                    <h3 className="text-2xl">LSI</h3>
                                </div>
                                <div className="flex items-center flex-row sm:flex-col py-2">
                                    <span className="text-sm me-1">Select Branch</span>
                                    <select
                                    value={selectedLSIBranch}
                                    onChange={handleLsiBranchChange}
                                    className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md text-green-800 focus:outline-none font-extrabold focus:border-black ">
                                        <option value="Valenzuela">Valenzuela</option>
                                        <option value="Canlubang">Canlubang</option>
                                    </select>
                                </div>
                            </div>
                            {selectedLSIBranch === 'Valenzuela' ? (
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_inventory"}
                                        onChange={() => setGetTable("lsi_inventory")}
                                        id="lsiCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="lsiCpuLaptop"> CPU / Laptop</label>   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_mobile_inventory"}
                                        onChange={() => setGetTable("lsi_mobile_inventory")}
                                        id="lsiMobile" 
                                    />
                                    <label className="text-sm" htmlFor="lsiMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_printer"}
                                        onChange={() => setGetTable("lsi_printer")}
                                        id="lsiPrinter" 
                                    />
                                    <label className="text-sm" htmlFor="lsiPrinter"> Printer</label>
                                   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_accounts"}
                                        onChange={() => setGetTable("lsi_accounts")}
                                        id="lsiAccounts" 
                                    />
                                    <label className="text-sm" htmlFor="lsiAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                            ): (
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_inventory"}
                                        onChange={() => setGetTable("lsi_can_inventory")}
                                        id="lsiCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="lsiCpuLaptop"> CPU / Laptop</label>   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_mobile_inventory"}
                                        onChange={() => setGetTable("lsi_mobile_inventory")}
                                        id="lsiMobile" 
                                        disabled
                                    />
                                    <label className="text-sm" htmlFor="lsiMobile"> Cellphone</label>
                                    
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_printer"}
                                        onChange={() => setGetTable("lsi_can_printer")}
                                        id="lsiPrinter" 
                                    />
                                    <label className="text-sm" htmlFor="lsiPrinter"> Printer</label>
                                   
                                </div>
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="lsi"
                                        checked={getTable === "lsi_accounts"}
                                        onChange={() => setGetTable("lsi_can_accounts")}
                                        id="lsiAccounts" 
                                    />
                                    <label className="text-sm" htmlFor="lsiAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                            )}     
                        </div>
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="col-span-1 md:block hidden"></div>
                        <div className="p-5 mt-2 md:col-span-3 sm:col-span-2 col-span-3">
                            <h3 className="text-2xl">GKC</h3>
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gkc"
                                        checked={getTable === "gkc_inventory"}
                                        onChange={() => handleradioChange("gkc_inventory")}
                                        id="gkcCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="gkcCpuLaptop"> CPU / Laptop</label> 
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
                                    <label className="text-sm" htmlFor="gkcMobile"> Cellphone</label>  
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
                                    <label className="text-sm" htmlFor="gkcPrinter"> Printer</label>
                                    
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
                                    <label className="text-sm" htmlFor="gkcAccounts"> Server Accounts</label>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="p-5 mt-2 md:col-span-3 sm:col-span-2 col-span-3">
                            <h3 className="text-2xl">GSRC</h3>
                            <div className="border rounded-md border-gray-200 p-2 sm:p-5 grid sm:grid-cols-4 gap-1">
                                <div className="col-span-2 flex flex-row items-center">
                                    <input 
                                        type="radio" 
                                        className="me-2" 
                                        name="gsrc"
                                        checked={getTable === "gsrc_inventory"}
                                        onChange={() => handleradioChange("gsrc_inventory")}
                                        id="gsrcCpuLaptop" 
                                    />
                                    <label className="text-sm" htmlFor="gsrcCpuLaptop"> CPU / Laptop</label>
                                    
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
                                    <label className="text-sm" htmlFor="gsrcMobile"> Cellphone</label>
                                    
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
                                    <label className="text-sm" htmlFor="gsrcPrinter"> Printer</label>
                                    
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
                                    <label className="text-sm" htmlFor="gsrcAccounts"> Server Accounts</label>
                                    
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