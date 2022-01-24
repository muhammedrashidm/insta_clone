import React from 'react'

import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore'
import { useState, useEffect } from 'react'
import { db } from '../firebase'
import Moment from 'react-moment'
import { Shimmer } from 'react-shimmer'

function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession()
  const [comment, setComment] = useState('')
  const [comments, setcomments] = useState([])
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)

  const addComment = async (e) => {
    e.preventDefault()
    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      profileImage: session.user.image,
      timeStamp: serverTimestamp(),
    })
  }

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user?.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user?.uid), {
        username: session.user?.username,
      })
    }
  }

  useEffect(() => {
    //learn diffrnce b/w find and findIndex
    setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1)
  }, [likes])

  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
      setLikes(snapshot.docs)
    })
  }, [db, id])

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timeStamp', 'desc')
        ),
        (snapshot) => {
          setcomments(snapshot.docs)
        }
      ),
    [db]
  )

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* header */}

      <div className="flex items-center p-5">
        <img
          src={userImg}
          className="rounded-full h-12 w-12 object-cover border p-1 mr-3"
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* image */}
    
        <img src={img} className="w-full h-auto object-cover" />
    
      {/* button */}
      {session && (
        <div className="flex justify-between px-4 pt-4 pb-4">
          <div className="flex space-x-4 ">
            {liked ? (
              <HeartIconFilled
                onClick={likePost}
                className="btn text-red-500"
              />
            ) : (
              <HeartIcon onClick={likePost} className="btn" />
            )}

            <ChatIcon className="btn " />
            <PaperAirplaneIcon className="btn rotate-45 " />
          </div>
          <BookmarkIcon className="btn " />
        </div>
      )}

      {/* caption */}

      <p className="p-5 truncate">
        {likes.length > 0 && <div className="font-bold">{likes.length}</div>}
        <span className="font-bold mr-1"> {username} </span>
        {caption}
      </p>

      {/* comments */}
      {comments?.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map((comment, index) => (
            <div key={index} className="flex items-center justify-between p-2">
              <div className="flex justify-start items-center">
                <img
                  src={comment.data().profileImage}
                  className="rounded-full h-12 w-12 object-cover border p-1 mr-3"
                />
                <p className=" font-semibold">{comment.data().username}</p>
                <p className="ml-2">{`${comment.data().comment}`}</p>
                <Moment className=" pl-5 text-xs" fromNow>
                  {comment.data().timeStamp?.toDate()}
                </Moment>
              </div>
              <HeartIcon className={`h-4 w-4 mr-4`} />
            </div>
          ))}
        </div>
      )}

      {/* input box */}
      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-5" />
          <input
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border-none focus:ring-0 outline-none"
          />
          <button
            disabled={!comment.trim()}
            type="submit"
            onClick={addComment}
            className="font-semibold text-blue-400 disabled:text-gray-600"
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
