import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { ActionError } from "@/lib/auth/actions";
import { SignInResponse } from "next-auth/react";
import { ActionResult } from "@/lib/types";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines if a server action is successful or not
 * A server action is successful if it has a data property and no serverError property
 *
 * @param action Return value of a server action
 * @returns A boolean indicating if the action is successful
 */
export const isActionSuccessful = (action: unknown) => {
  if (!action) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (action?.serverError) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (action?.validationErrors) {
    return false;
  }

  return true;
};

/**
 * Determines if a server action has server error
 * A server action is successful if it has a data property and no serverError property
 *
 * @param action Return value of a server action
 * @returns A true boolean for error cases.
 */
export const hasServerError = (action: unknown): boolean => {
  if (!action) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (action?.serverError) {
    return true;
  }
  return false;
};

/**
 * Determines if a server action has validation errors
 * A server action is successful if it has a data property and no serverError property
 *
 * @param action Return value of a server action
 * @returns A true for error cases
 */
export const hasValidationErrors = (action: unknown): boolean => {
  if (!action) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (action?.validationErrors) {
    return true;
  }
  return false;
};

/**
 * Converts an action result to a promise that resolves to false
 *
 * @param action Return value of a server action
 * @returns A promise that resolves to false
 */
export const resolveActionResult = async <T extends z.ZodType>(
  action: Promise<ActionResult<T> | undefined>,
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await action;

      if (isActionSuccessful(result)) {
        resolve(result?.data as T);
      } else {
        reject(new ActionError(result?.serverError ?? "Something went wrong"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const isSignInResponseSuccessful = (signInResponse: SignInResponse) => {
  return signInResponse.ok && signInResponse.error === null;
};

export const Axios = axios.create({
  baseURL: process.env.NEXT_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
