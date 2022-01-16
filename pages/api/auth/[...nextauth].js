import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),

        // ...add more providers here
    ],
    callbacks: {
        async session({ session, token, user }) {
            session.user.username = session.user.name.split(" ").join("_").toLocaleLowerCase();
            session.user.uid = token.sub;
            return session;

        }
    },
    secret: process.env.SECRET,

})

