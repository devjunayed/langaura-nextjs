"use server"
import { stackClientApp } from "@/stack/client";
import { Button } from "@heroui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { UserAvatar } from "@stackframe/stack";
import Link from "next/link";
import LogOut from "./logout";

const UserButton = async () => {
  const user = await stackClientApp.getUser();
  return (
    <div className="cursor-pointer">
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <UserAvatar user={user} />
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <div className="px-1 py-2 w-48">
            {user ? (
              <>
                <div className="text-small font-bold">{user.displayName}</div>
                <div className="text-tiny">{user.primaryEmail}</div>
               <LogOut />
              </>
            ) : (
              <div className="space-y-4 flex flex-col">
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserButton;
