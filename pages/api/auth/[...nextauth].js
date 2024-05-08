import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'

const client_id="656207302130-oaaoi2fu2c1s7huvu733sd3lmoo9mgre.apps.googleusercontent.com"
const client_secret="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"

export default NextAuth({
    providers: [
        // Google Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "Username"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req){
                const res = await fetch(`/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password
                    }),
                });
                const user = await res.json();
                console.log({ user })
                if(user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ]
})