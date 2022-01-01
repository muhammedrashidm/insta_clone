import React, { useRef, useEffect, useState, useContext } from 'react'
import ChatInputBox from './ChatInputBox'
import ChatBoxTopBar from './ChatBoxTopBar'
import Message from './Message'
import { useRecoilState } from 'recoil'
import { currentChatState, videoCallState, videoWindowCallState } from '../../../atoms/modalAtom'
import { PaperAirplaneIcon, PhotographIcon } from '@heroicons/react/outline'
import { async } from '@firebase/util'
import { useSession } from 'next-auth/react'
import { io } from "socket.io-client";
import VideoCallWindow from '../../videoCall/VideoCallWindow'
import SocketContext from '../../../SocketContext'
function ChatBox() {
    const [currerntChat, setCurrentChat] = useRecoilState(currentChatState)
    const divRef = useRef(null);
    const [messageText, setMessageText] = useState('');
    const [conversationId, setconversationId] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [currentConversation, seCurrentConversation] = useState({})
    const { data: session } = useSession()
    const [messageList, setMessageList] = useState([]);
    const socket = useContext(SocketContext)
    const [open, setOpen] = useRecoilState(videoWindowCallState)
    const [_videoCallState, setVideoCallState] = useRecoilState(videoCallState)


    useEffect(() => {
        console.log('chat box mounted');

        socket.on('success', (socketId) => {
            console.log('connected to ' + socketId);
            socket.emit("addUser", session.user.uid);
        })



        socket.on("getMessage", (data) => {
            console.log(data);
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })

        });

        socket.on("incomingCall", (data) => {
            console.log(data);

            setVideoCallState({
                isCalling: true,
                isIncoming: true,
                otherUserId: data.senderId,
                roomName: data.roomName,
            })
            setOpen(true)

        })
    }, [])


    useEffect(() => {

        arrivalMessage && currentConversation.members?.includes(arrivalMessage.senderId) &&
            setMessageList((prevVal) => [...prevVal, arrivalMessage])

    }, [arrivalMessage, currentConversation]);

    useEffect(() => {

        socket.on("getUsers", (users) => {


        });
    }, [session]);


    useEffect(() => {

        divRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    }, [messageList]);


    useEffect(() => {
        const createConversation = async () => {
            const members = { reciverId: currerntChat?.id, senderId: session.user.uid }
            const res = await fetch('/api/messaging/conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(members),
            })
            const { data } = await res.json()
            setconversationId(data._id)
            seCurrentConversation(data)
        }


        const checkForConversation = async () => {
            if (session.user && currerntChat.id) {
                const res = await fetch(`/api/messaging/conversation/find/${session.user?.uid}/${currerntChat?.id}`, {
                    method: 'GET',
                })
                const resObj = await res.json()
                let data = await resObj.data
                if (data) {
                    setconversationId(data._id)
                    seCurrentConversation(data)

                }
                else {
                    createConversation()
                }
            }
        }



        checkForConversation()
    }, [currerntChat])


    const messageSendHandler = async () => {
        if (messageText.trim() !== '') {

            const newMessage = {
                conversationId: conversationId,
                senderId: session.user.uid,
                text: messageText,
            }


            const res = await fetch('/api/messaging/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessage)
            })

            const { data } = await res.json()
            const receiverId = currentConversation.members.find(
                (member) => member !== session.user.uid
            );
            let msg = {
                "senderId": session.user.uid,
                "receiverId": receiverId,
                "text": messageText,
                "conversationId": conversationId
            }
            try {
                socket.emit("sendMessage", msg);
                setMessageList((prevVal) => {
                    prevVal && [...prevVal, newMessage]
                    if (prevVal) {
                        return [...prevVal, newMessage]
                    } else {
                        return [newMessage]
                    }
                })
            } catch (error) {
                console.log(error)
            }


            setMessageText('')
        }
    }

    useEffect(() => {
        const fetchMessages = async () => {
            if (conversationId) {
                const res = await fetch(`/api/messaging/message/${conversationId}`, {
                    method: 'GET',
                })
                const { data } = await res.json()

                setMessageList(data)
            }
        }
        fetchMessages()
    }, [conversationId]);

    return (

        <div className="flex flex-col h-screen justify-start items-center ">
            <div className=" w-11/12">
                {
                    currerntChat &&
                    <ChatBoxTopBar profile={currerntChat} />
                }

            </div>
            <div className=" h-4/6 mb-16 w-11/12 overflow-y-auto">
                <div ref={divRef}>
                    {
                        messageList &&
                        messageList.map((message, index) => {
                            return <Message key={index} message={message} own={session.user.uid === message.senderId} senderImg={currerntChat?.photoURL} />
                        })
                    }

                </div>
            </div>
            <div className="fixed z-50 w-2/4 bottom-2">
                {currerntChat &&
                    <div className="mx-8   flex justify-between items-center rounded-full border-2 pl-4 bg-white">
                        <input value={messageText} onChange={(e) => setMessageText(e.target.value)} type="text" className="w-full h-10 bg-transparent  border-none focus:outline-none outline-none" placeholder="Type a message..." />
                        <PhotographIcon className="w-10 h-10" />
                        <button onClick={(e) => { messageSendHandler() }}>
                            <PaperAirplaneIcon className="w-10 h-10 rotate-90" />
                        </button>

                    </div>
                }

            </div>





        </div>
    )
}

export default ChatBox
