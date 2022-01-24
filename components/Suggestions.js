import React from 'react'
import faker from 'faker'
import { useState, useEffect } from 'react'
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { profileRecoilState } from '../atoms/modalAtom'

function Suggestions() {
  const [suggestions, setSuggestions] = useState([])
  const { data: session } = useSession()
  const [profile, setProfile] = useRecoilState(profileRecoilState)
  useEffect(() => {
    let suggestionsArray = []

    const getSuggetions = async () => {
      let followingsArray = await profile.followings
      onSnapshot(query(collection(db, 'profiles')), (snapshot) => {
        suggestionsArray = snapshot.docs.map((doc) => doc.data())
        if (followingsArray && followingsArray.length > 0) {
          let filteredSuggestions = suggestionsArray.filter( (user) =>!followingsArray.includes(user.id) && user.id !== session.user.uid )
          setSuggestions(filteredSuggestions)
        }else{
          setSuggestions(suggestionsArray)
        }
      })
    }
    getSuggetions()
  }, [profile.followings])

  const followUser = async (targerProfileUserId) => {
    let newSuggestions = suggestions.filter(
      (user) => user.id !== targerProfileUserId
    )

    setSuggestions(newSuggestions)
    const usersProfileRef = doc(db, 'profiles', session.user.uid)
    const targetProfileRef = doc(db, 'profiles', targerProfileUserId)
    await updateDoc(usersProfileRef, {
      followings: arrayUnion(targerProfileUserId),
    })
    await updateDoc(targetProfileRef, {
      followers: arrayUnion(session.user.uid),
    })
  }

  return (
    <div className="mt-4 ml-10  ">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold">Suggestions</h3>
        <button className="text-gray-600">See All</button>
      </div>
      {suggestions
        .filter((item) => item.id !== session.user.uid)
        .map((profile) => (
          <div
            key={profile.id}
            className="flex items-center justify-between mt-3 ml-10"
          >
            <img
              className="w-10 h-10 object-cover rounded-full border p-[2px] "
              src={profile.photoURL}
            />

            <div className="flex-1 ml-4">
              <h2 className="font-semi-bold">{profile.name}</h2>
              <h3 className="truncate text-xs text-gray-400">
                {' '}
                {profile.username}
              </h3>
            </div>
            <button
              onClick={() => followUser(profile.id)}
              className="text-blue-400 text-xs font-bold"
            >
              Follow
            </button>
          </div>
        ))}
    </div>
  )
}

export default Suggestions

// {
//     "email": "kabayanbj@gmail.com",
//     "username": "kabayan_bj",
//     "name": "Kabayan bj",
//     "followers": [
//         "113748175499665767649",
//         "109641435129422835147"
//     ],
//     "photoURL": "https://lh3.googleusercontent.com/a/AATXAJzwRJOpaIFONej_voAilK9G-cCygwDUhhAcOf1A=s96-c",
//     "id": "109733184355572215872"
// }
