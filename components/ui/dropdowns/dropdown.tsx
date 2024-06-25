import { useState, useEffect } from "react";
import  {tableName}  from "../../../lib/company";
import { lusitana } from "../../../styles/font";
import  {Select, Option} from "@material-tailwind/react"
import { usePathname } from "next/navigation";
interface DropdownProps {
    onCompanyChange: (value: string) => void
}

export default function Dropdown({onCompanyChange}: DropdownProps){
   const[value, setValue] = useState("")
    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value
    setValue(values)
    onCompanyChange(values)
    // window.location.href = `/dashboard/inventory/${values}`;
   }
   const pathname = usePathname()
    return (
    <select 
    onChange={handleCompanyChange}
    className="block w-full px-2 py-2 text-sm border border-gray-100 rounded-md  text-green-800 focus:outline-none font-extrabold ">
        
            <option className="rounded border text-black" value="">Select</option>
            {tableName.map(company => (
            <option className="font-extrabold text-sm" key={company.name} value={company.name}>{company.displayName}</option>
            
            ))}
            {pathname === '/inventory' ? ( <option className="font-extrabold text-sm" key="Baling Station" value="baling_inventory">BALING</option>) : null}
        
    </select>
             
        
          
    )
}