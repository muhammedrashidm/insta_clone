import React from 'react'
import Stories from '../components/Stories'
import MiniProfile from './MiniProfile'
import Posts from './Posts'
import Suggestions from './Suggestions'
import { useSession } from 'next-auth/react'
function Feed() {
    const { data: session } = useSession()
    return (
        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!session && "!grid-cols-1 !max-w-3xl"}`}>
            {/* sec- left */}
            <section className="col-span-2">
                {/* stories */}
                <Stories />
                {/* posts */}
                <Posts />
            </section>




            {/* section right */}
            {session &&
                <section className="hidden xl:inline-grid md:col-span-1">
                    <div className="fixed top-20">
                        {/* mini profile */}
                        <MiniProfile />
                        {/* suggetions */}
                        <Suggestions />

                    </div>

                </section>

            }



        </main>
    )
}

export default Feed
