import React from 'react'
import { PhotographIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/react/outline'

function ChatInputBox() {
    return (
        <div className="mx-8   flex justify-between items-center rounded-full border-2 pl-4 bg-white">
            <input type="text" className="w-full h-10 bg-transparent  border-none focus:outline-none outline-none" placeholder="Type a message..." />
            <PhotographIcon className="w-10 h-10" />
            <PaperAirplaneIcon className="w-10 h-10 rotate-90" />
        </div>
    )
}

export default ChatInputBox
