// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios';

export const nextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_BASE_URL}/auth/login`, {
            username: credentials.username,
            password: credentials.password
          });

          const data = response.data

          if (data) {
            data.role = "admin"
            return data;
          }
          return null;
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user, account}) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      if (account?.provider === 'credentials') {
        return {
          ...token,
          role: user.role,
          accessToken: user.accessToken
        }
      }
      return token
    },
    async session({session, token}) {
      session.user.id = token.id
      session.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET as string,
}
