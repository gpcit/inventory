// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '../../../lib/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error('Missing credentials');
          }
          const user = await authenticateUser(credentials.username, credentials.password);

          if (user) {
            console.log("Result for user inside nextauth: ", user);
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
    strategy: 'jwt',
    maxAge: 60 * 60
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          uid: token.uid as number,
          name: token.name as string,
          username: token.username as string,
          email: token.email as string,
          role_id: token.role_id as number
        };
      }

      console.log("Result for session: ", session);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.uid;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.role_id = user.role_id;
      }
      console.log("Result for token: ", token.uid);
      token.exp = Math.floor(Date.now() / 1000) + (60 * 60)
      return token;
    },
  },
};

export default NextAuth(authOptions);
