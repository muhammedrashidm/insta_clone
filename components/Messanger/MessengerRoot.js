import React, { useEffect, useRef, useState } from 'react'
import ChatBox from './chatbox/ChatBox'
import Chats from './chats/Chats'
import Online from './onlineContacts/Online'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'


function MessengerRoot() {
    const { data: session } = useSession()
    const router = useRouter()


    return (
        <>
            {session &&
                <div className="pt-8 ">
                    <div className="shadow-md mx-14  flex fixed justify-between w-11/12 max-h-screen overflow-hidden">

                        <Chats />


                        <div className="flex-1 h-screen border-2 ">
                            <ChatBox />
                        </div>


                    </div>
                </div>

            }
            {session === null &&
                <div className="pt-32 flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center">
                    <button className=" p-3 bg-blue-500 rounded-lg text-white" onClick={() => signIn()}>Sign In</button>
                </div>
            }


        </>
    )



}

export default MessengerRoot
