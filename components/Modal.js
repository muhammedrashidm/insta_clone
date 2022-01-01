import React from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { CameraIcon } from '@heroicons/react/outline'
import { useState, useRef } from 'react'
import { db, storage } from '../firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from '@firebase/firestore'
import { useSession } from 'next-auth/react'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'

function Modal() {
    const [open, setOpen] = useRecoilState(modalState)
    const filePickerRef = useRef()
    const [selectedFile, setSelectedFile] = useState(null)
    const captionRef = useRef()
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);

        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    const uploadPost = async () => {
        if (loading) return


        setLoading(true);

        // create a post add to firestore posts collection
        //get the post id
        //upload image to firebase storage with post id
        // get a download url from firebase storage and update to post with image

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: captionRef.current.value,
            profileImage: session.user.image,
            timeStamp: serverTimestamp(),

        })



        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        await uploadString(imageRef, selectedFile, "data_url").then(async (snapshot) => {

            const downloadUrl = await getDownloadURL(imageRef)

            await updateDoc(doc(db, 'posts', docRef.id), {
                image: downloadUrl
            })

        })

        setOpen(false)
        setLoading(false)
        setSelectedFile(null)
    }


    const uploadStory = async () => {

        if (loading) return


        setLoading(true);

        // create a post add to firestore posts collection
        //get the post id
        //upload image to firebase storage with post id
        // get a download url from firebase storage and update to post with image

        const docRef = await addDoc(collection(db, 'stories'), {
            username: session.user.username,
            userId: session.user.uid,
            profileImage: session.user.image,
            timeStamp: serverTimestamp(),

        })


        const imageRef = ref(storage, `stories/${docRef.id}/image`);

        await uploadString(imageRef, selectedFile, "data_url").then(async (snapshot) => {
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(db, 'stories', docRef.id), {
                media: downloadUrl
            })

        })

        setOpen(false)
        setLoading(false)
        setSelectedFile(null)
    }
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={setOpen}>

                <div className="flex items-end justify-center min-h-[880px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle
                   sm:max-w-sm sm:w-full sm:p-6 ">
                            <div>
                                {selectedFile ? (
                                    <img src={selectedFile} alt="preview" className="w-full" />
                                ) : (
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                                        onClick={() => filePickerRef.current.click()}
                                    >
                                        <CameraIcon />
                                    </div>

                                )}


                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Upload a Photo</Dialog.Title>
                                        <div>
                                            <input
                                                ref={filePickerRef}
                                                type="file"
                                                hidden
                                                onChange={addImageToPost}
                                            >
                                            </input>
                                        </div>
                                        <div className="mt-2">
                                            <input className="border-none focus:right-0 w-full text-center"
                                                type="text"
                                                placeholder="Add a caption..."
                                                ref={captionRef}
                                                onChange={(e) => { }}
                                            ></input>
                                        </div>

                                    </div>
                                </div>

                            </div>




                            <div className="mt-5 sm:mt-6">
                                <button onClick={uploadPost} disabled={!selectedFile || loading} type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium
                            text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300
                            disabled:cursor-not-allowed disabled:hover:bg-gray-300" >
                                    {loading ? "uploading" : "Upload As Post"}
                                </button>
                                <button onClick={uploadStory} disabled={!selectedFile || loading} type="button" className="mt-5 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium
                            text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 sm:text-sm disabled:bg-gray-300
                            disabled:cursor-not-allowed disabled:hover:bg-gray-300" >
                                    {loading ? "uploading" : (<div><p>Upload As Status </p><p className="text-xs text-red-300" >Caption won't Appear</p></div>)}
                                </button>


                            </div>
                        </div>

                    </Transition.Child>
                </div>

            </Dialog>

        </Transition.Root>

    )
}

export default Modal
