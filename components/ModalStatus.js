import React from 'react'
import { useRecoilState } from 'recoil'
import { modalState, statusViewState, storiesRecoilState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useState, useRef, useEffect } from 'react'
import { db, storage } from '../firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from '@firebase/firestore'
import { useSession } from 'next-auth/react'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import { SliderData } from './SliderData'
import Status from './Status'
function ModalStatus() {
    const [open, setOpen] = useRecoilState(statusViewState)
    const [stories, setStories] = useRecoilState(storiesRecoilState)

    const { data: session } = useSession()
    const [current, setCurrent] = useState(0);
    const length = stories.length;
    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    if (!Array.isArray(stories) || stories.length <= 0) {
        return null;
    }



    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-20 inset-0 overflow-y-auto"
                onClose={setOpen}>

                <div className="flex items-center justify-center  sm:min-h-screen pt-4 px-4 pb-20 text-center sm:flex sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">



                        <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-50" />

                    </Transition.Child>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >

                        <div className="h-screen w-2/4 top-0 fixed  flex justify-center items-center">
                            <FaArrowAltCircleLeft size="50" onClick={() => prevSlide()} />
                            <div className=" z-30 top-0 h-screen inline-block align-bottom bg-white rounded-lg   text-left overflow-hidden shadow-xl transform transition-all  sm:align-middle
                   sm:max-w-sm sm:w-full  ">
                                {
                                    stories.map((story, index) => {
                                        return (
                                            <div
                                                className={index === current ? 'slide active' : 'slide'}
                                                key={index}
                                            >
                                                {index === current && (

                                                    <Status
                                                        media={story.media}
                                                        profileImage={story.profileImage}
                                                        username={story.username}
                                                        timeStamp={story.timeStamp}
                                                        userId={story.userId}
                                                    />
                                                )}
                                            </div>
                                        )

                                    })
                                }





                            </div>
                            <FaArrowAltCircleRight size="50" onClick={() => nextSlide()} />
                        </div>
                    </Transition.Child>
                </div>

            </Dialog>

        </Transition.Root>

    )
}

export default ModalStatus
