// import NextAuth from 'next-auth';
// import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from 'next-auth/providers/credentials'

// export default NextAuth({
//     providers: [
//         // Google Provider
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 username: {label: "Username", type: "text", placeholder: "Username"},
//                 password: {label: "Password", type: "password"},
//             },
//             async authorize(credentials, req){
//                 const res = await fetch(`/api/auth/login`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         username: credentials.username,
//                         password: credentials.password
//                     }),
//                 });
//                 const user = await res.json();
//                 console.log({ user })
//                 if(user) {
//                     return user
//                 } else {
//                     return null
//                 }
//             }
//         })
//     ]
// })