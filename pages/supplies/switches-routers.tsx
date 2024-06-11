import { useRouter } from "next/router";
import Layout from "../layout";
import { lato } from "@/styles/font";
import { useState } from "react";
import { CreateInventory } from "@/components/ui/buttons";
import RouterSwitchesInventory from "@/components/ui/tables/routerSwitches-table";

export default function Page () {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const router = useRouter()
    return (
        <Layout>
        <div className={`bg-white max-h-full `}>
            <div className="h-full" >
                <div className="px-2 ">
                    <div className="p-5">
                        <h1 className={`text-2xl ${lato.className}`}>IT Supply</h1>
                    </div>
                    <div className="flex items-end justify-end gap-2 mt-4 md:mt-8">
                        {activeTab > 1 ? ( ''  ) :  <CreateInventory onClick={() => ({})}/>}
                    </div>
                    <div className="py-5">
                        <div className=" bg-gray-100">
                            <RouterSwitchesInventory onDataSubmitted={() => ({})} onActiveTabChange={() => ({})} />
                        </div>
                    </div>
                </div>
                {}
                {}
            </div>
        </div>
    </Layout>
    )
}