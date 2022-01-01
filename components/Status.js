import React from 'react'
import DotsHorizontalIcon from '@heroicons/react/outline'

function Status({ media, profileImage, username, timeStamp, userId }) {
    return (
        <div>
            <div className="flex fixed items-center pt-2 pl-5 z-50">
                <img src={profileImage} className="rounded-full h-12 w-12 object-cover border p-1 mr-3" />
                <p className="flex-1 font-bold text-red-500">{username}</p>
            </div>
            <div className="h-screen  fixed top-0 ">
                <img className="h-screen object-contain" src={media} />
            </div>
        </div>
    )
}

export default Status
