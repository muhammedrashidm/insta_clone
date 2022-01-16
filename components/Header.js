import React, { useEffect } from 'react'
import Image from 'next/image'
import { SearchIcon, PlusCircleIcon, UserGroupIcon, HeartIcon, PaperAirplaneIcon, MailIcon, MenuIcon } from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { modalState, statusViewState, profileRecoilState } from '../atoms/modalAtom'
import { db } from '../firebase'
import { collection, doc, getDoc, setDoc } from '@firebase/firestore'
import { async } from '@firebase/util'
function Header() {
    const { data: session } = useSession()
    const router = useRouter()
    const [open, setOpen] = useRecoilState(modalState)




    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-10">
            <div className="flex justify-between max-w-6xl mx-5 xl:mx-auto">

                {/* left */}
                <div className='relative hidden lg:inline-grid w-24 '>
                    <Image onClick={() => router.push('/')} objectFit="contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png" layout="fill" />
                </div>
                <div className='relative  lg:hidden w-10 '>
                    <Image onClick={() => router.push('/')} objectFit="contain" src="https://toppng.com/uploads/preview/instagram-logo-1155105798346ilx9kcc6.png" layout="fill" />
                </div>
                {/* mid -search */}
                <div className="max-w-xs">
                    <div className='relative mt-1 p-3 rounded-md '>
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <input type="text" placeholder="Search" className="bg-gray-50 block w-full pl-10 lg:text-sm
                    border-gray-300 rounded-md focus:ring-black focus:border-black "></input>
                    </div>
                </div>

                {/* right */}

                <div className="flex items-center justify-end space-x-4">
                    <HomeIcon onClick={() => router.push('/')} className="  navBtn" />
                    <MenuIcon className="h-6 md:hidden cursor-pointer" />

                    {session ? (
                        <>
                            <div className="relative navBtn">
                                <PaperAirplaneIcon className=" navBtn rotate-45" onClick={() => router.push('/Messenger')} />
                                <div className="absolute -top-2 -right-1 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white ">3</div>
                            </div>
                            <PlusCircleIcon onClick={() => setOpen(true)} className=" navBtn" />
                            <UserGroupIcon className=" navBtn" />
                            <HeartIcon className=" navBtn" />
                            <img className="h-7 w-7 hover:scale-125 transition-all duration-150 ease-out object-cover rounded-full cursor-pointer"
                                src={session.user.image} onClick={signOut} />
                        </>
                    ) : (
                        <button onClick={signIn}>Sign in</button>
                    )
                    }



                </div>

            </div>

        </div>
    )
}

export default Header
