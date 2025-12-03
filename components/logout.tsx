"use client";
import { stackClientApp } from "@/stack/client";
import { Button } from "@heroui/button";

const LogOut = () => {
  const handleLogout = async () => {
     await stackClientApp.redirectToSignOut();
  };
  return (
    <Button
      onPress={() => handleLogout()}
      className="w-full mt-4"
      size="sm"
      type="button"
      color="danger"
    >
      Logout
    </Button>
  );
};

export default LogOut;
