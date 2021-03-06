import '../styles/global.css'
import '../styles/Slider.css'
import React, { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import { doc, getDoc, getDocs, setDoc } from '@firebase/firestore'
import { db } from '../firebase'
import { io } from 'socket.io-client'
import SocketContext from '../SocketContext'



function MyApp({ Component, pageProps: { session, ...pageProps } }) {




  const socket = io('http://localhost:3000')
  

  return (




    <SessionProvider session={session}>
      <RecoilRoot>
        <SocketContext.Provider value={socket}>

          <Component {...pageProps} />
        </SocketContext.Provider>
      </RecoilRoot>

    </SessionProvider>

  )
}

export default MyApp
