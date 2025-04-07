import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { ActionError } from "@/lib/auth/actions";
import { SignInResponse } from "next-auth/react";
import { ActionResult, ActionSuccess } from "@/lib/types";
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
export const isActionSuccessful = <T extends z.ZodType>(
  action?: ActionResult<T>,
): action is ActionSuccess<T> => {
  if (!action) {
    return false;
  }

  if (action.serverError) {
    return false;
  }

  if (action.validationErrors) {
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
export const hasServerError = <T extends z.ZodType>(
  action?: ActionResult<T>,
): boolean => {
  if (!action) {
    return true;
  }
  if (action.serverError) {
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
export const hasValidationErrors = <T extends z.ZodType>(
  action?: ActionResult<T>,
): boolean => {
  if (!action) {
    return true;
  }
  if (action.validationErrors) {
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
        resolve(result.data);
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
