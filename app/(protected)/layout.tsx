import { Navbar } from "@/components/navbar";
import { stackServerApp } from "@/stack/server";
import { Link } from "@heroui/link";
import React, { ReactNode } from "react";

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  await stackServerApp.getUser({ or: "redirect" });
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl  px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com?utm_source=next-app-template"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </Link>
      </footer>
    </div>
  );
};

export default ProtectedLayout;
