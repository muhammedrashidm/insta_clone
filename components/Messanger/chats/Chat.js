import { doc, getDoc } from '@firebase/firestore'
import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import { currentChatState } from '../../../atoms/modalAtom'
import { useRecoilState } from 'recoil'
import { useSession } from 'next-auth/react'
import { Shimmer, ShimmerProps } from 'react-shimmer'

function Chat({ uid, chat }) {
  const [profile, setProfile] = useState({})
  const [currentChat, setCurrentChat] = useRecoilState(currentChatState)
  const { data: session } = useSession()
  const [showShimmer, setShowShimmer] = useState(true)
  useEffect(() => {
    const getProfile = async () => {
      const friendId = chat.members.find((m) => m !== session.user.uid)

      if (friendId) {
        const docRef = doc(db, 'profiles', friendId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setProfile(docSnap.data())
          setShowShimmer(false)
        } else {
          console.log('No such document!')
        }
      }
    }
    getProfile()
  }, [uid, db])

  const manageOnClick = async (e) => {
    setCurrentChat(profile)
  }
  return (
    <div
      className="flex items-center justify-between my-4 mx-2 cursor-pointer"
      onClick={manageOnClick}
    >
      {showShimmer ? (
        <Shimmer height={10} width={10} />
      ) : (
        <img
          className="w-12  h-12 object-cover rounded-full border p-[2px] "
          src={profile.photoURL}
        />
      )}
      <div className="flex-1 mx-4">
        {showShimmer ? (
          <Shimmer height={20} width={400} />
        ) : (
          <h2 className="font-bold">{profile.name}</h2>
        )}
      </div>
    </div>
  )
}

export default Chat
