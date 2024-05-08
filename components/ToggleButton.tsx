import { useState } from "react";

export default function ToggleButton({ loading, onChange} : {  loading: boolean, onChange: () => void}){

    const [toggle, setToggle] = useState('graph')

    const handleToggleChange = () => {
        
            setToggle(toggle === 'detail' ? 'graph' : 'detail')
            onChange();
        
    }
    return (
        <div className="flex items-center">
        <input
            type="checkbox"
            id="toggle-checkbox"
            className="sr-only"
            checked={toggle === 'graph'}
            onChange={handleToggleChange}
        />
        <label
                htmlFor="toggle-checkbox"
                className={`cursor-pointer relative w-14 h-6  rounded-full p-1 transition-colors duration-200 ease-in-out ${toggle === 'graph' ? 'bg-green-300' : 'bg-black'}`}
            >
                <span
                    className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${toggle === 'graph' ? 'translate-x-8 ' : 'translate-x-0 '}`}
                ></span>
        </label>
            <p className="ml-2"><strong>{toggle === 'graph' ? 'G R A P H' : 'D E T A I L'}</strong></p>
    </div>
    )
}