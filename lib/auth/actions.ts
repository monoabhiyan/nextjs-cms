// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createSafeActionClient} from 'next-safe-action';
import {ZodError} from "zod";
import {authenticationMiddleware} from "@/lib/auth/middleware";
import {DEFAULT_SERVER_ERROR_MESSAGE, VALIDATION_ERROR_MESSAGE} from "@/lib/constants";

export class ActionError extends Error {
}
// middleware to handle errors
export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof ZodError) {
      console.error(e.message);
      return VALIDATION_ERROR_MESSAGE;
    } else if (error instanceof ActionError) {
      return error.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(authenticationMiddleware);
