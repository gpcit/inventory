import { lato } from "@/styles/font";
import Layout from "../layout";
import SuppliesTableInventory from "@/components/ui/tables/otherstable";
import { CreateInventory } from "@/components/ui/buttons";
import { useState } from "react";
import Modal from "@/components/modal";
import Form from "@/components/ui/inventory/create-data/CreateSupply";
import DeliverForm from "@/components/ui/inventory/create-data/CreateDeliver";
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const openModal = () =>{
        setIsModalOpen(true);
    }
    const handleSubmit = () => {
        setIsModalOpen(false)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const handleActiveTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex)
    }
   return (
    <Layout>
        <div className={`bg-white max-h-full `}>
            <div className="h-full" >
                <div className="px-2 ">
                    <div className="p-5">
                        <h1 className={`text-2xl ${lato.className}`}>IT Supply</h1>
                    </div>
                    <div className="flex items-end justify-end gap-2 mt-4 md:mt-8">
                        {activeTab > 1 ? ( ''  ) :  <CreateInventory onClick={openModal}/>}
                    </div>
                    <div className="py-5">
                        <div className=" bg-gray-100">
                            <SuppliesTableInventory onDataSubmitted={handleSubmit} onActiveTabChange={handleActiveTabChange} />
                        </div>
                    </div>
                </div>
                {isModalOpen && activeTab === 0 &&  (
                <Modal onClose={closeModal} title="Add Supply" companyName="" tablename="" onSubmit={() => ({})}>
                    <Form onDataSubmitted={handleSubmit} />
                </Modal> )}
                {isModalOpen && activeTab === 1 &&  (
                <Modal onClose={closeModal} title="Add Supply" companyName="" tablename="" onSubmit={() => ({})}>
                    <DeliverForm onDataSubmitted={handleSubmit} />
                </Modal> )}
            </div>
        </div>
    </Layout>
   )
}