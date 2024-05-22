// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '../../../lib/auth';
import  axios  from 'axios'

export const authOptions: AuthOptions = {
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
          // const res = await axios.post("/auth/login", {})
          const user = await authenticateUser(credentials.username, credentials.password);

          if (user) {
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

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.uid = user.uid;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.role_id = user.role_id;
      }
      token.exp = Math.floor(Date.now() / 1000) + (60 * 60)
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60
  },
  debug: process.env.NODE_ENV === "development"
};
export default NextAuth(authOptions)

