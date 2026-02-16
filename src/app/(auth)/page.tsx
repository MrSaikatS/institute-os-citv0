import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - Institute OS",
  description: "Sign in to access your Institute OS dashboard",
};

const page = () => {
  return (
    <Card className="w-[360px] sm:w-md">
      <CardHeader className="gap-3">
        <CardTitle className="text-center text-3xl font-semibold">
          Welcome to Institute OS
        </CardTitle>

        <CardDescription className="text-center text-lg leading-5">
          Sign in to access your Institute OS dashboard, courses, and
          administrative tools
        </CardDescription>
      </CardHeader>

      <CardContent>{/* <LoginForm /> */}</CardContent>

      <CardFooter className="justify-center">
        Don&apos;t have an account?
        <Link
          href="/register"
          className="mx-1 text-blue-600 hover:underline">
          Create
        </Link>
        now
      </CardFooter>
    </Card>
  );
};

export default page;
