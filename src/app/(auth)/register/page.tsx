import RegisterForm from "@/components/Forms/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register - Institute OS",
  description: "Create your account to access Institute OS",
};

const page = () => {
  return (
    <Card className="w-[360px] sm:w-md">
      <CardHeader className="gap-3">
        <CardTitle className="text-center text-3xl font-semibold">
          Join Institute OS
        </CardTitle>

        <CardDescription className="text-center text-lg leading-5">
          Create your account to access courses, manage your profile, and
          connect with the institute community
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />
      </CardContent>

      <CardFooter className="justify-center">
        Already have an account?
        <Link
          href={"/"}
          className="mx-1 text-blue-500 hover:underline">
          Login
        </Link>
        now
      </CardFooter>
    </Card>
  );
};

export default page;
