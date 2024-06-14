import { useState, useEffect } from "react";
import  {tableName}  from "../../../lib/company";
import { lusitana } from "../../../styles/font";
import  {Select, Option} from "@material-tailwind/react"
interface DropdownProps {
    onCompanyChange: (value: string) => void
    tablename: string;
}

export default function TransferDropdown({tablename, onCompanyChange}: DropdownProps){
   const[value, setValue] = useState("")
    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value
    setValue(values)
    onCompanyChange(values)
    // window.location.href = `/dashboard/inventory/${values}`;
   }
   
    return (
    <select 
    onChange={handleCompanyChange}
    className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md focus:outline-none focus:border-black shadow-md">
        
            <option className="rounded border text-black" value="">Select</option>
            {tableName.map(company => (
            <option className="font-extrabold text-sm" disabled={tablename === company.table} key={company.name} value={company.table}>{company.displayName}</option>
            ))}
        
    </select>
             
            // <Select value={value} labelId="selet-company" id="select-company" label="Select Company" onChange?={handleCompanyChange}>
            //     <Option value="">Select</Option>
            //     {tableName.map(company => (
            //     <Option key={company.name} value="company.name">{company.displayName}</Option>
            //      ))}
            // </Select>
        
          
    )
}