import { useState, useEffect } from "react";

export default function StatusToggle({ loading, onChange} : {  loading: boolean, onChange: () => void}){

    const [toggle, setToggle] = useState("active")

    
    const handleToggleChange = () => {
             
        const newToggle = toggle === 'active' ? 'inactive' : 'active'
        setToggle(newToggle)
            onChange();
    }
    return (
    <div className="flex items-center flex-col-reverse me-5">
        <input
            type="checkbox"
            id="toggle-checkbox"
            className="sr-only"
            checked={toggle === 'active'}
            onChange={handleToggleChange}
        />
        <label
                htmlFor="toggle-checkbox"
                className={`cursor-pointer relative w-14 h-6 shadow-md shadow-black rounded-full p-1 transition-colors duration-200 ease-in-out ${toggle === 'inactive' ? 'bg-red-500' : 'bg-green-500'}`}
            >
                <span
                    className={`block w-4 h-4  shadow-black rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${toggle === 'inactive' ? 'translate-x-8 shadow-black bg-white' :'translate-x-0 bg-white'  }`}
                ></span>
        </label>
            <p className=""><strong>{toggle === 'active' ? 'Active' : 'Inactive'}</strong></p>
    </div>
    )
}