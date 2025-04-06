import {createMiddleware} from "next-safe-action";
import {AuthOptions, getServerSession} from "next-auth";
import {ActionError} from "@/lib/auth/actions";
import {nextAuthOptions} from "@/lib/nextAuth";

export const authenticationMiddleware = createMiddleware().define(async ({next}) => {
  const session = await getServerSession(nextAuthOptions as AuthOptions);
  if (!session) {
    throw new ActionError('Unauthorized');
  }
  return next({
    ctx: {
      user: session.user,
    },
  })
})
