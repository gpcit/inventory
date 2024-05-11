import React, { useState, useEffect } from 'react';
import Layout from '../layout';
import { lusitana } from '@/styles/font';
import { lato } from '@/styles/font';
import TableSkeleton, { CardSkeleton } from '@/components/ui/skeleton';
import Card from '@/components/ui/cards';
import { Suspense } from 'react';
import Oldunit from '@/components/ui/tables/oldunit';
import OldMobile from '@/components/ui/tables/oldunit-mobile';
import DoughnutChart from '@/components/DougnutChart';
import ToggleButton from '@/components/ToggleButton';
import BarChart from '@/components/BarChart';


export default function Page() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [desktopToCount, setDesktopToCount] = useState<number | null>(null)
  const [laptopToCount, setLaptopToCount] = useState<number | null>(null)
  const [mobileCount, setMobileCount] = useState<number | null>(null)
  const [triggerValue, setTriggerValue] = useState<string>("graph")
  
  
  
  const fetchData = async () => {
    try {
      const [desktop, mac, apple, system, laptop, cellphone] = await Promise.all([
        fetch(`api/computer_type/desktop`),
        fetch(`api/computer_type/mac`),
        fetch(`api/computer_type/apple`),
        fetch(`api/computer_type/system`),
        fetch(`api/computer_type/laptop`),
        fetch(`api/countMobile`)
      ]);
      if (!desktop.ok || !laptop.ok) {
        throw new Error('Failed to fetch data');
      }
      const desktopData = await desktop.json();
      const macData = await mac.json();
      const appleData = await apple.json();
      const systemData = await system.json();
      const laptopData = await laptop.json();
      const mobileData = await cellphone.json()
      
      setDesktopToCount(desktopData.count + macData.count + systemData.count + appleData.count);
      setLaptopToCount(laptopData.count);
      setMobileCount(mobileData.count);
    } catch (error) {
      setError('Error fetching data');
    } finally {
      setLoading(false)
    }
  }
  console.log("Result for data: ")
  useEffect(() => {
    const delayTime = 1000;
    const delayTimer = setTimeout(() => {
      fetchData()
    }, delayTime);
    return () => clearTimeout(delayTimer);
  }, []);
  
  const handleTrigger = () =>{
   setTriggerValue(triggerValue === 'graph' ? 'detail' : 'graph')
  }
  
  return (
    <Layout>
      <div className='p-1 border rounded shadow-2xl relative my-5 bg-gray-200/50'>
        <div className="p-3 rounded-t-lg bg-black mb-1">
          <h1 className={`${lato.className} text-xl md:text-xl custom-font   sm:text-left`}>Summary</h1>
        </div>
        <div className="px-4 overflow-y-hidden rounded-lg bg-white shadow-md border">
            <div className='flex flex-col pb-2'>
                <h3 className='text-2xl'>Inventory</h3>
                <ToggleButton loading={loading} onChange={handleTrigger}/>
            </div>
            <div className='grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-[500px] lg:w-auto md:w-auto'>
              {triggerValue === 'detail' ? (
                <>
                {(desktopToCount === null || laptopToCount === null) && <><CardSkeleton /> <CardSkeleton /> <CardSkeleton /></>}
                {desktopToCount !== null && laptopToCount !== null && (
                  <>
                    <Card title="Desktop" value={desktopToCount} type="desktop" />
                    <Card title="Laptop" value={laptopToCount} type="laptop" />
                    <Card title="Cellphone" value={mobileCount} type="cellphone" />
                  </>
                )}
                </>
              ): null}
            </div>
            <div className="grid gap-4 py-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 lg:w-auto md:w-auto">
            
              {triggerValue === 'graph' ? (
              <>
                <div className=''>
                  <h6 className='text-center border-b-2 border-x-2 border-b-current'>GPC</h6>
                  <DoughnutChart tableName='gpc_inventory' mobileTable='gpc_mobile_inventory'/>
                </div>
                <div className=''>
                  <h6 className='text-center border-b-2 border-x-2 border-b-current'>LSI</h6>
                  <DoughnutChart tableName='lsi_inventory' mobileTable='lsi_mobile_inventory'/>
                </div>
                <div className=''>
                  <h6 className='text-center border-b-2 border-x-2 border-b-current'>GKC</h6>
                  <DoughnutChart tableName='gkc_inventory' mobileTable='gkc_mobile_inventory'/>
                </div>
                <div className=''>
                  <h6 className='text-center border-b-2 border-x-2 border-b-current'>GSRC</h6>
                  <DoughnutChart tableName='gsrc_inventory' mobileTable='gsrc_mobile_inventory'/>
                </div>
              </>
              ): null}
          </div>
        </div>

        {/* Trigger for Detail */}
        {triggerValue === 'detail' ? (
            <>
        <div className="p-2 my-1 rounded-t-lg bg-black">
          <h1 className={`${lusitana.className} text-white text-xl md:text-[15px] sm:text-[10px]`}>Desktop/Laptop Unit/s 5years old and Above</h1>
        </div>
        <div className="  rounded-lg shadow-md border">
            <div className="grid">
              <Suspense fallback={<TableSkeleton />}>
              {(desktopToCount === null || laptopToCount === null) && <TableSkeleton />}
               <Oldunit />
              </Suspense>
            </div>
        </div>
         
        <div className="p-2 mt-2 rounded-t-lg bg-black">
          <h1 className={`${lusitana.className} text-white text-xl md:text-[15px] sm:text-[10px]`}>Mobile Issued 5 years old and above </h1>
        </div>
        <div className='p-1  rounded-t-lg shadow-md border'>
          <div className='grid'>
            <OldMobile />
          </div>
        </div>
        </>
        ) : '' }
        {/* Trigger for Graph Chart */}
        {triggerValue === 'graph' ? (
              <>
            <div className="p-2 mt-2 rounded-t-lg bg-black mb-1" >
              <h1 className={`${lusitana.className} text-white text-xl md:text-[15px] sm:text-[10px] `}>Old Units with more then 5 years of age</h1>
            </div>
            <div className="p-1 bg-white rounded-lg shadow-md border">
              <div className='flex justify-center lg:h-[400px]'>
                <BarChart />
              </div>
            </div>
            </>
            ) : !triggerValue }
      </div>
    </Layout>
  );
}
