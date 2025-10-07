// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { Axios } from "@/lib/utils";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const response = await Axios.post(`/seller/login`, {
            username: credentials.username,
            password: credentials.password,
          });

          const data = response.data;

          if (data) {
            data.role = "admin";
            data.accessToken = data.access_token;
            data.userData = data.user;
            return data; // this resolves into user object in callbacks.jwt
          }
          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      /**
       * Enhancement can be done here
       *      if (user) {
       *         const {data: dbUser} = await Axios.get(`/users/${user.id}`);
       *         if (dbUser) {
       *           token.role = dbUser.role;
       *           // Fetch permissions (e.g., from a related table or field)
       *           token.permissions = dbUser.permissions || ["canViewReports"]; // Example
       *         } else {
       *           token.role = "USER";
       *           token.permissions = [];
       *         }
       *       }
       *      return token;
       */
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (account?.provider === "credentials") {
        return {
          ...token,
          id: user.user.id,
          role: user.role,
          accessToken: user.accessToken,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
