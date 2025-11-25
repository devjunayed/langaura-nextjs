import React from "react";
import { Logo } from "./icons";
import { BarChart, Book, Home } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const sideBarItems = {
    navigations: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: BarChart,
      },
      {
        name: "Home",
        path: "/",
        icon: Home,
      },
    ],
    course: [
      {
        name: "Course",
        path: "/course",
        icon: Book,
      },
    ],
  };
  return (
    <div className="min-h-screen w-64 p-4  border border-gray-200">
      <div className="flex items-center  ">
        <Logo />
      </div>
      <div className="text-sm mt-4 mb-2 uppercase text-gray-400">
        navigation
      </div>
      <div className="space-y-2 text-gray-600 text-sm">
        {sideBarItems.navigations.map((item, key) => {
          return (
            <Link className="flex space-x-2 items-center" key={key} href={item.path}>
              <item.icon className="w-4 h-4"/>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="text-sm mt-6 mb-2 uppercase text-gray-400">
        Course
      </div>
      <div className="space-y-2 text-gray-600 text-sm">
        {sideBarItems.course.map((item, key) => {
          return (
            <Link className="flex items-center space-x-2" key={key} href={item.path}>
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
