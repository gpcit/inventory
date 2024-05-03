import React, {useEffect, useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
  Title,
  Tooltip,
  Filler,
  Legend,
  
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { duration } from 'html2canvas/dist/types/css/property-descriptors/duration';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);



export default function AreaChartView({tableName, mobileTable}: {tableName: string, mobileTable: string}) {
    const [gpcDataToCount, setGpcDataToCount] = useState(null)
    const [gpcLaptopToCount, setGpcLaptopToCount] = useState(null)
    const [gpcMobileToCount, setGpcMobileToCount] = useState(null)
    
    const [lsiDataToCount, setLsiDataToCount] = useState(null)
    const [lsiLaptopToCount, setLsiLaptopToCount] = useState(null)
    const [lsiMobileToCount, setLsiMobileToCount] = useState(null)
    
    const [gkcDataToCount, setGkcDataToCount] = useState(null)
    const [gkcLaptopToCount, setGkcLaptopToCount] = useState(null)
    const [gkcMobileToCount, setGkcMobileToCount] = useState(null)
    
    const [gsrcDataToCount, setGsrcDataToCount] = useState(null)
    const [gsrcLaptopToCount, setGsrcLaptopToCount] = useState(null)
    const [gsrcMobileToCount, setGsrcMobileToCount] = useState(null)


// console.log(" Area Chart GPC Data to count", gpcDataToCount)
const fetchData = async () => {
    try {
        const [gpcDesktop, gpcLaptop, gpcMac, gpcMobile, lsiDesktop, lsiLaptop, lsiMac, lsiMobile, gkcDesktop, gkcLaptop, gkcMac, gkcMobile, gsrcDesktop, gsrcLaptop, gsrcMac, gsrcMobile] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gpc_inventory/computer_type/desktop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gpc_inventory/computer_type/laptop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gpc_inventory/computer_type/mac`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gpc_mobile_inventory/countMobile`),
  
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/lsi_inventory/computer_type/desktop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/lsi_inventory/computer_type/laptop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/lsi_inventory/computer_type/mac`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/lsi_mobile_inventory/countMobile`),
  
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gkc_inventory/computer_type/desktop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gkc_inventory/computer_type/laptop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gkc_inventory/computer_type/mac`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gkc_mobile_inventory/countMobile`),
  
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gsrc_inventory/computer_type/desktop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gsrc_inventory/computer_type/laptop`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gsrc_inventory/computer_type/mac`),
          fetch(`${process.env.NEXT_PUBLIC_URL}/api/gsrc_mobile_inventory/countMobile`),
        ]);
        if (!gpcDesktop.ok || !lsiDesktop.ok || !gkcDesktop.ok || !gsrcDesktop.ok) {
          throw new Error('Failed to fetch data');
        }
        const gpcdesktopData = await gpcDesktop.json();
        const gpclaptopData = await gpcLaptop.json();
        const gpcmacData = await gpcMac.json();
        const gpcMobileData = await gpcMobile.json();
        
        const lsidesktopData = await lsiDesktop.json();
        const lsilaptopData = await lsiLaptop.json();
        const lsimacData = await lsiMac.json();
        const lsiMobileData = await lsiMobile.json();
  
        const gkcdesktopData = await gkcDesktop.json();
        const gkclaptopData = await gkcLaptop.json();
        const gkcmacData = await gkcMac.json();
        const gkcMobileData = await gkcMobile.json();
  
        const gsrcdesktopData = await gsrcDesktop.json();
        const gsrclaptopData = await gsrcLaptop.json();
        const gsrcmacpData = await gsrcMac.json();
        const gsrcMobileData = await gsrcMobile.json();
        
        
        setGpcDataToCount(gpcdesktopData.count + gpcmacData.count);
        setGpcLaptopToCount(gpclaptopData.count)
        setGpcMobileToCount(gpcMobileData.count)
  
        setLsiDataToCount(lsidesktopData.count + lsimacData.count);
        setLsiLaptopToCount(lsilaptopData.count)
        setLsiMobileToCount(lsiMobileData.count)
  
        setGkcDataToCount(gkcdesktopData.count + gkcmacData.count);
        setGkcLaptopToCount(gkclaptopData.count)
        setGkcMobileToCount(gkcMobileData.count)
  
        setGsrcDataToCount(gsrcdesktopData.count + gsrcmacpData.count);
        setGsrcLaptopToCount(gsrclaptopData.count)
        setGsrcMobileToCount(gsrcMobileData.count)
        
        // console.log("counter for mac", gpcmacData) 
      } catch (error) {
        console.error('Error fetching data', error);
        
      }
}
useEffect(() => {
  fetchData();
})



const options = {
    animations : {
        tension: {
            duration: 1500,
            loop: true,
            from: 1,
            to: 0,
        },
    },
   
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
        display: true,
        text: 'Chart  ',
        },
        filler: {
            propagate: true,
        },
    },
    
};



const data = {
  labels: ['DESKTOP', 'LAPTOP', 'MOBILE'],
  datasets: [
    {
        fill: false,
        label: 'GPC',
        data: [gpcDataToCount, gpcLaptopToCount, gpcMobileToCount],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
        fill: false,
        label: 'LSI',
        data: [lsiDataToCount, lsiLaptopToCount, lsiMobileToCount],
        borderColor: 'rgb(0, 240, 15)',
        backgroundColor: 'rgba(0, 240, 15, 0.5)',
    },
    {
        fill: false,
        label: 'GKC',
        data: [gkcDataToCount, gkcLaptopToCount, lsiMobileToCount],
        borderColor: 'rgb(224, 0, 123)',
        backgroundColor: 'rgba(224, 0, 123, 0.5)',
    },
    {
        fill: false,
        label: 'GSRC',
        data: [gsrcDataToCount, gsrcLaptopToCount, gsrcMobileToCount],
        borderColor: 'rgb(224, 224, 0)',
        backgroundColor: 'rgba(225, 225, 0, 0.5)',
    },
  ],
};
  return ( 
    <div className='h-[100%] w-[100%] shadow-lg '>
        <Line options={options} data={data}  />
    </div>
  
)
}