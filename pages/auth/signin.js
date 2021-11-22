import { getProviders, signIn } from "next-auth/react"
import Header from "../../components/Header"

export default function SignIn({ providers }) {
    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png" alt="rasd-Instagram" className="w-64 mb-4" />
                <p>rasd_insta Clone Next js</p>
                <div className="mt-40">

                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <button onClick={() => signIn(provider.id, { callbackUrl: '/' })} className=" p-3 bg-blue-500 rounded-lg text-white">
                                Sign in with {provider.name}
                            </button>
                        </div>
                    ))}
                </div>


            </div>


        </>
    )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: { providers },
    }
}