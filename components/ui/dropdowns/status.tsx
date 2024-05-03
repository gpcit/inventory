"use client"
import { useEffect, useState } from "react";
import { status } from "@/lib/company";

interface statusProps {
    onStatusChange: (value: string) => void,
    value: string;
}

export default function Status({onStatusChange, value} : statusProps){
    const [selectedCompany, setSelectedCompany] = useState<string>("")
    
    const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setSelectedCompany(selectedValue)
    onStatusChange(selectedValue)
   }
   console.log("getting the value: ", value)
   
    return (
       
        <select onChange={handleChangeStatus}>
            <option value="">Select</option>
            {status.map(status => (
                <option key={status.name} value={value}>{status.name}</option>
            ))}
        </select>
          
    )
}