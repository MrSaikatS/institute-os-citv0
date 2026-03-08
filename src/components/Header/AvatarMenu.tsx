import { auth } from "@/lib/auth";
import { SquareUserRoundIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import LogoutButton from "../Buttons/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcnui/avatar";
import { Button } from "../shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcnui/dropdown-menu";

const AvatarMenu = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <></>;
  }

  const { name, image } = session.user;

  const avatarName = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full">
            <Avatar>
              <AvatarImage
                src={image ?? undefined}
                alt={`${name}'s avatar`}
              />
              <AvatarFallback>{avatarName}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <DropdownMenuContent
        align="center"
        className="mt-4">
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                href="/account"
                className="flex cursor-pointer items-center justify-center">
                <SquareUserRoundIcon /> Account
              </Link>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<LogoutButton />} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarMenu;
