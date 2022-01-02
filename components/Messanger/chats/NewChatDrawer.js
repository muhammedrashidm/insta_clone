import React, { useEffect,useState } from "react";
import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import Contact from "./contact";
import { useSession } from 'next-auth/react'
import { db } from '../../../firebase'
import { doc, getDoc } from "@firebase/firestore";
import { useRecoilState } from "recoil";
import { profileRecoilState } from "../../../atoms/modalAtom";
export default function Drawer({ children, isOpen, setIsOpen }) {
    const { data: session } = useSession()
    const [profile, setProfile]  = useState({})
    useEffect(() => {

        const getProfile = async () => {
        if (session) {
            const docRef = doc(db, "profiles", session.user.uid);
            const docSnap = await getDoc(docRef);
            setProfile(docSnap.data())
        }
    }
        getProfile()
    },[]);

    return (
        <main>

            <section
                className={
                    " ml-0 left-0 w-1/5 max-w-sm  absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  overflow-y-scroll" +
                    (isOpen ? " translate-x-0 " : " -translate-x-full ")
                }
            >
                <div className="flex justify-between top-0">
                    <p className="px-2 py-2 font-semibold">Select A Contact</p>
                    <ArrowCircleLeftIcon className="h-10 px-2 py-2" onClick={() => {
                        setIsOpen(false);
                    }} />
                </div>


                <div className="">
                    {
                        profile.followers?.map(uid => {
                            return (

                                <Contact key={uid} uid={uid} setIsOpen={setIsOpen} drawer={true} />

                            )
                        })

                    }



                </div>


            </section>

        </main>
    );
}


{/* <main
    className={
        " fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
            ? " transition-opacity opacity-100 duration-500 translate-x-0  "
            : " transition-all delay-500 opacity-0 translate-x-full  ")
    }
> */}