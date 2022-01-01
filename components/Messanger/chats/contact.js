import { doc, getDoc } from '@firebase/firestore'
import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { currentChatState } from "../../../atoms/modalAtom";
import { useRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';
function Contact({ uid, drawer, setIsOpen }) {
    const [profile, setProfile] = useState({})
    const [currentChat, setCurrentChat] = useRecoilState(currentChatState)

    useEffect(() => {
        const getProfile = async () => {

            if (uid) {
                const docRef = doc(db, "profiles", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {

                    setProfile(docSnap.data())
                } else {
                    console.log("No such document!");
                }
            }
        }
        getProfile()

    }, [uid, db])


    const manageOnClick = async (e) => {
        setProfile(profile)
        setCurrentChat(profile)
        if (drawer) {
            setIsOpen(false)
        }
    }
    return (

        <div className="flex items-center justify-between my-4 mx-2 cursor-pointer" onClick={manageOnClick}>
            <img className="w-12  h-12 object-cover rounded-full border p-[2px] " src={profile.photoURL} />
            <div className="flex-1 mx-4">
                <h2 className="font-bold">{profile.name}</h2>

            </div>

        </div>
    )
}

export default Contact
