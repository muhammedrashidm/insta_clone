import React from 'react'
import {
  DotsHorizontalIcon,
  InformationCircleIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import { useRecoilState } from 'recoil'
import {
  currentChatState,
  videoCallState,
  videoWindowCallState,
} from '../../../atoms/modalAtom'
import { Shimmer } from 'react-shimmer'
function ChatBoxTopBar({ profile }) {
  const [open, setOpen] = useRecoilState(videoWindowCallState)
  const [_videoCallState, setVideoCallState] = useRecoilState(videoCallState)
  const [_currentChatState, setCurrentChatState] =
    useRecoilState(currentChatState)
  const handleVideoButton = () => {
    setVideoCallState({
      isCalling: true,
      isIncoming: false,
      otherUserId: _currentChatState?.id,
      roomName: _currentChatState?.id,
    })
    setOpen(true)
  }
  return (
    <div>
      <div className="flex items-center justify-between border-b-2 px-4 py-2 h-14">
        {profile.name ? (
          <div className="flex">
            <img
              className="w-8  h-8 object-cover rounded-full border p-[2px] "
              src={profile.photoURL}
            />
            <div className="flex-1 mx-4">
              <h2 className="font-bold">{profile.name}</h2>
            </div>
          </div>
        ) : (
          <Shimmer width={240} height={56} />
        )}

        {currentChatState?.id !== null ? (
          <div className='flex'>
            <VideoCameraIcon
              onClick={() => handleVideoButton()}
              className="h-6 mr-4"
            />
            <InformationCircleIcon className="h-6" />{' '}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default ChatBoxTopBar
