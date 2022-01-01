import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import ReactTimeAgo from 'react-time-ago';
import Moment from 'react-moment';
function Message({ message, own, senderImg }) {
    const { data: session } = useSession()
    return (
        <div className={`h-12 my-2 px-4 flex  ${own === true ? 'justify-end' : 'justify-start'}`}>
            {
                !own && (
                    <img className="w-8 m-2  h-8 object-cover rounded-full border p-[2px] " src={senderImg} />
                )
            }

            <div className="bg-gray-300 rounded-md w-max px-4 py-1 mt-1 mb-2 h-11 ">

                <p className="text-gray-800">{message.text}</p>
                <p className="text-gray-400 mt-1  p-0 text-xsm">
                    <Moment className=" pl-5 text-xs" fromNow>{message.createdAt}</Moment>
                </p>
            </div>
            {
                own && (
                    <img className="w-8 m-2  h-8 object-cover rounded-full border p-[2px] " src={session.user.image} />
                )
            }

        </div>
    )
}

export default Message
