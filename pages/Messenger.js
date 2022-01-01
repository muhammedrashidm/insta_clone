import React from 'react'
import Header from '../components/Header'
import ModalStatus from '../components/ModalStatus'
import Head from 'next/head'
import MessengerRoot from '../components/Messanger/MessengerRoot'
import VideoCallWindow from '../components/videoCall/VideoCallWindow'

function Messenger() {
    return (
        <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
            {/* head */}
            <Head>
                <title>rasd-Instagram</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <MessengerRoot />



            <ModalStatus />
            <VideoCallWindow />
        </div>
    )
}

export default Messenger
