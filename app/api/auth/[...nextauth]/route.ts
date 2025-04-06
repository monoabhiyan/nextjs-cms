import NextAuth, {AuthOptions} from "next-auth";
import {nextAuthOptions} from "@/lib/nextAuth";

export const nextAuthHandlers = NextAuth(nextAuthOptions as AuthOptions);

export {nextAuthHandlers as GET, nextAuthHandlers as POST};
