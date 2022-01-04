import React, { useEffect, useState } from 'react'
import Chat from './Chat'
import { PencilAltIcon } from '@heroicons/react/outline'
import Drawer from './NewChatDrawer'
import { useSession } from 'next-auth/react'
function Chats() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { data: session } = useSession()
    const [chats, setChats] = useState([])
    useEffect(() => {
        const fetchChats = async () => {
            const res = await fetch(`/api/messaging/conversation/${session.user?.uid}`)
            const chats = await res.json()
            console.log(chats)
            setChats(chats.data)


        }
        fetchChats()

    }, [session]);


    return (
        <div className="flex flex-col border-2 w-1/4">
            <div className="bg-white z-10 relative flex justify-between w-100 px-2 py-4">
                <h1 className="text-2xl font-bold text-center flex-1 ">Direct</h1>
                <PencilAltIcon className="w-6 h-6" onClick={() => setDrawerOpen((prev) => !prev)} />
            </div>
            <div className="  shadow-md overflow-y-scroll   scrollbar-thin">
                <Drawer isOpen={drawerOpen} setIsOpen={setDrawerOpen} />
                {
                    chats &&
                    chats.map((chat) => (
                        <Chat key={chat._id} chat={chat} />
                    ))


                }

                <div className="mt-1">

                </div>
            </div>
        </div>
    )
}

export default Chats
