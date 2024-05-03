import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins } from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

 

export default function BarChart () {
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

const [legendPosition, setLegendPosition] = useState('right')

const fetchData = async () => {
    try {
      const [gpcDesktop, gpcLaptop, gpcMac, gpcMobile, lsiDesktop, lsiLaptop, lsiMac, lsiMobile, gkcDesktop, gkcLaptop, gkcMac, gkcMobile, gsrcDesktop, gsrcMac, gsrcLaptop, gsrcMobile] = await Promise.all([
        fetch(`api/gpc_inventory/computer_type/desktop/oldunit`),
        fetch(`api/gpc_inventory/computer_type/laptop/oldunit`),
        fetch(`api/gpc_inventory/computer_type/mac/oldunit`),
        fetch(`api/gpc_mobile_inventory/mobile-oldunit`),
        fetch(`api/lsi_inventory/computer_type/desktop/oldunit`),
        fetch(`api/lsi_inventory/computer_type/laptop/oldunit`),
        fetch(`api/lsi_inventory/computer_type/mac/oldunit`),
        fetch(`api/lsi_mobile_inventory/mobile-oldunit`),
        fetch(`api/gkc_inventory/computer_type/desktop/oldunit`),
        fetch(`api/gkc_inventory/computer_type/laptop/oldunit`),
        fetch(`api/gkc_inventory/computer_type/mac/oldunit`),
        fetch(`api/gkc_mobile_inventory/mobile-oldunit`),

        fetch(`api/gsrc_inventory/computer_type/desktop/oldunit`),
        fetch(`api/gsrc_inventory/computer_type/laptop/oldunit`),
        fetch(`api/gsrc_inventory/computer_type/mac/oldunit`),
        fetch(`api/gsrc_mobile_inventory/mobile-oldunit`),
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
      
    } catch (error) {
      console.error('Error fetching data', error);
      
    }
}
useEffect(() => {
    fetchData()
})



useEffect(() => {
    const handleResize = () => {
        const isMobile = window.innerWidth <= 768;
        setLegendPosition(isMobile ? 'top' : 'right');
    }
    window.addEventListener('resize', handleResize);
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
}, [])

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: legendPosition as 'right' | 'top' | 'center' | 'left' | 'bottom' | 'chartArea' | undefined,
        },
        title: {
            display: true,
            text: 'Old Units',
        },
    },
};

 const data = {
    labels : ['GPC', 'LSI', 'GKC', 'GSRC'
],
    datasets: [
        {
            label: 'LAPTOP',
            data: [gpcLaptopToCount, lsiLaptopToCount, gkcDataToCount, gsrcLaptopToCount],
            backgroundColor: 'rgba(0, 255, 0, .6)',
        },
        {
            label: 'DESKTOP',
            data: [gpcDataToCount, lsiDataToCount, gkcLaptopToCount, gsrcDataToCount],
            backgroundColor: 'rgba(255, 0, 0, .6)',
        },
        {
            label: 'MOBILE',
            data: [gpcMobileToCount, lsiMobileToCount, gkcMobileToCount, gsrcMobileToCount],
            backgroundColor: 'rgba(0, 0, 255, .6)',
        },
    ]
}
     return <Bar options={options} data={data}/>
}