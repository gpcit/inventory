import { useState, useEffect } from "react";
import  {tableName, tableInventoryMap, tableMobileMap}  from "../../../lib/company";
import { usePathname } from "next/navigation";
interface DropdownProps {
    onCompanyChange: (value: string) => void
    tablename: string;
}

export default function TransferDropdown({tablename, onCompanyChange}: DropdownProps){
   const[value, setValue] = useState("")
   const pathname = usePathname()

   console.log(tablename)
   const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value
    setValue(values)
    onCompanyChange(values)
    // window.location.href = `/dashboard/inventory/${values}`;
   }
   const renderOption = (map: Record<string, string>) => {
    return Object.keys(map).map((key) => (
        <option
        className="font-extrabold text-sm"
        key={key}
        value={key}
        disabled = {map[key] === tablename}>
            {map[key]}
        </option>
    ))
   }
     
  
    return (
    <select 
    onChange={handleCompanyChange}
    className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md focus:outline-none focus:border-black shadow-md">
        
        <option className="rounded border text-black" value="">Select</option>
        {pathname === '/inventory' && renderOption(tableInventoryMap)}
        {pathname === '/cellphone' && renderOption(tableMobileMap)}
        
    </select>
             
            // <Select value={value} labelId="selet-company" id="select-company" label="Select Company" onChange?={handleCompanyChange}>
            //     <Option value="">Select</Option>
            //     {tableName.map(company => (
            //     <Option key={company.name} value="company.name">{company.displayName}</Option>
            //      ))}
            // </Select>
        
          
    )
}