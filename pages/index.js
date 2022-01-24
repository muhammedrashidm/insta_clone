import Head from 'next/head'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ModalStatus from '../components/ModalStatus'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { profileRecoilState } from '../atoms/modalAtom'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from '@firebase/firestore'

export default function Home() {
  const { data: session } = useSession()
  const [profile, setProfile] = useRecoilState(profileRecoilState)


  useEffect(() => {
    const getProfile = async () => {


      if (session) {

        const docRef = doc(db, "profiles", session.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          setProfile(docSnap.data())
        } else {
          console.log('seting doc');
          let res = await setDoc(doc(db, 'profiles', session.user.uid), {
            id: session.user.uid,
            name: session.user.name,
            email: session.user.email,
            username: session.user.username,
            photoURL: session.user.image,
            followers: [],
            followings: [],
          }).then(async () => {
            const docSnap = await getDoc(docRef)
            setProfile(docSnap.data())
          })


        }

      }

    }
    getProfile()

  }, [db, session]);


  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      {/* head */}
      <Head>
        <title>rasd-Instagram</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* feed */}
      <Feed />
      {/* modle */}
      <Modal />
      <ModalStatus />
    </div>
  )
}
