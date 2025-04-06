import NextAuth from "next-auth";
import {nextAuthOptions} from "@/lib/nextAuth";

const nextAuthHandlers = NextAuth(nextAuthOptions);

export {nextAuthHandlers as GET, nextAuthHandlers as POST};
