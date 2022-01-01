import React from 'react'
import faker from 'faker'
import { useEffect, useState } from 'react'
import Story from './Story';
import { useSession } from 'next-auth/react'
import { statusViewState } from '../atoms/modalAtom';
import { Snapshot, useRecoilState } from 'recoil';
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from '../firebase';
import { storiesRecoilState } from '../atoms/modalAtom';

function Stories() {

    const { data: session } = useSession()
    const [stories, setStories] = useState([]);
    const [storiesRecoilLocalState, setStoriesRecoilLocalState] = useRecoilState(storiesRecoilState)
    useEffect(() => {
        let storiesArray = [];
        const getStories = () => {

            onSnapshot(query(collection(db, 'stories'), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setStories(snapshot.docs);
                    storiesArray = snapshot.docs.map((doc) => doc.data())
                    setStoriesRecoilLocalState(storiesArray);
                }
            )
        }
        getStories()
    }, [db])
    return (
        <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black" >
            {session && (
                <Story img={session.user?.image}
                    username={session.user?.username} />
            )}
            {stories.map((profile) =>
                <div >
                    <Story key={profile.id}
                        img={profile.data().profileImage}
                        username={profile.data().username}

                    />
                </div>
            )}

        </div>
    )
}

export default Stories
