import React from 'react'
import Post from './Post'
import { useState, useEffect } from 'react'

import { collection, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'

function Posts() {

    const [posts, setposts] = useState([])

    useEffect(
        () =>
            onSnapshot(
                query(collection(db, 'posts'), orderBy('timeStamp', 'desc')),
                (snapshot) => {
                    setposts(snapshot.docs);
                }
            ),
        [db]
    );



    return (
        <div>
            {posts.map((post, index) =>

            (<Post key={post.id} id={post.id}
                username={post.data().username}
                userImg={post.data().profileImage}
                img={post.data().image}
                caption={post.data().caption} />
            )
            )}



        </div>
    )
}

export default Posts
