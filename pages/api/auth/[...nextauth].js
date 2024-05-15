// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '../../../lib/auth';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const user = await authenticateUser(credentials.username, credentials.password);

                    if (user) {
                        console.log("Result for user inside nextauth: ", user)
                        return user;
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } catch (error) {
                    throw new Error('Invalid credentials');
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user = {
                    uid: token.id,
                    name: token.name,
                    username: token.username,
                    email: token.email,
                    role_id: token.roles
                };
            }
            
            console.log("Result for session: ", session)
            return session;
            
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.uid;
                token.name = user.name;
                token.username = user.username;
                token.email = user.email;
                token.roles = user.role_id
            }
            console.log("Result for token: ", token.id)
            return token;
        },
    },
});
