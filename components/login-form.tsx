"use client";

import {cn, isActionSuccessful, isSignInResponseSuccessful} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useRouter, useSearchParams} from "next/navigation";
import {signIn, SignInResponse} from "next-auth/react";
import {ActionError} from "@/lib/auth/actions";
import {$loginInAction} from "@/app/login/action";
import {useTransition} from "react";

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

  const [isPending, startTransition] = useTransition()

  async function $handleLogin(formData: FormData) {
    startTransition(async () => {
      try {
        const formInput = {
          username: formData.get('username') as string,
          password: formData.get('password') as string,
        }

        const actionResponse = await $loginInAction(formInput);

        if (!isActionSuccessful(actionResponse as never)) {
          if (actionResponse?.validationErrors) {
            console.log('validation error:', actionResponse?.validationErrors);
            throw new ActionError(actionResponse?.validationErrors.toString());
          }
          if (actionResponse?.serverError) {
            console.log('server error:', actionResponse?.serverError);
            throw new ActionError(actionResponse?.serverError ?? 'Something went wrong');
          }
          return;
        }

        const signInResponse = await signIn('credentials', {
          ...actionResponse?.data,
          redirect: false,
          callbackUrl,
        });

        if (isSignInResponseSuccessful(signInResponse as SignInResponse)) {
          router.push(callbackUrl);
        }
      } catch (error) {
        console.error("Unexpected error: ", error);
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={$handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="user123"
                  defaultValue="emilys"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto hidden text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input name="password" defaultValue="emilyspass" id="password" type="password" required/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {isPending ? 'Logging...' : 'Login'}
                </Button>
                <Button variant="outline" className="hidden w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="hidden mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
