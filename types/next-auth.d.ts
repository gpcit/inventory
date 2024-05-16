// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: number;
      name: string;
      username: string;
      email: string;
      role_id: number;
    } & DefaultSession["user"];
  }

  interface User {
    uid: number;
    name: string;
    username: string;
    email: string;
    role_id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: number;
    name: string;
    username: string;
    email: string;
    role_id: number;
  }
}
