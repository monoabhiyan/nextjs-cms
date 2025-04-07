'use server';
import {z} from "zod";
import {actionClient, authActionClient} from "@/lib/auth/actions";

const zLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof zLoginSchema>

export const $loginInAction = actionClient.schema(zLoginSchema).action(async ({parsedInput}) => {
  return parsedInput;
});

export const $requireLoginAction = authActionClient.action(async () => {
  console.log('pugyo ta?');
})
