import { useRouter } from "next/router";
import Layout from "../layout";
import { lato } from "@/styles/font";
import { useState } from "react";
import { CreateInventory } from "@/components/ui/buttons";
import NasTableInventory from "@/components/ui/tables/nastable";
import Modal from "@/components/modal";
import NasForm from "@/components/ui/inventory/create-data/CreateNas";

export default function Page () {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const router = useRouter()

    const handleModal = () => {
        setIsModalOpen(true)
    }

    const fetchNasData = async () => {
        try {
            const apiUrlEndpoint = `/api/nas/data`
            const data = await fetch(apiUrlEndpoint)
            const res = await data.json()
        } catch (error) {

        }
    }

    const handleFormSubmit = () => {
        closeModal()
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    return (
        <Layout>
        <div className={`bg-white max-h-full `}>
            <div className="h-full" >
                <div className="px-2 ">
                    <div className="p-5">
                        <h1 className={`text-2xl ${lato.className}`}>NAS</h1>
                    </div>
                    <div className="flex items-end justify-end gap-2 mt-4 md:mt-8">
                        <CreateInventory onClick={handleModal}/>
                    </div>
                    <div className="py-5">
                        <div className=" bg-gray-100">
                            <NasTableInventory onDataSubmitted={handleFormSubmit} onActiveTabChange={() => ({})} />
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <Modal onClose={closeModal} companyName="" onSubmit={handleFormSubmit} tablename="" title="NAS">
                        <NasForm onDataSubmitted={handleFormSubmit} />
                    </Modal>
                )}
                {}
            </div>
        </div>
    </Layout>
    )
}