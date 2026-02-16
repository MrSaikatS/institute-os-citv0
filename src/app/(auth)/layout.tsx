import type { LayoutChildrenProps } from "@/lib/types";

const AuthLayout = ({ children }: LayoutChildrenProps) => {
  return <main className="grid h-dvh place-items-center">{children}</main>;
};

export default AuthLayout;
