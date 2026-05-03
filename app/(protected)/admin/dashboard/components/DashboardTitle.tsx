import { ChevronRight } from "lucide-react";
import React from "react";

interface IDashboardTitle {
  title: string;
  courseCount: number;
  btnText?: string;
  btnIcon?: React.ReactNode;
}

const DashboardTitle = ({
  title,
  courseCount,
  btnText = "See All",
  btnIcon = <ChevronRight />,
}: IDashboardTitle) => {
  return (
    <div className="flex mb-2 justify-between uppercase text-gray-600 border-b border-gray-200 pb-2">
      <h1 className=" ">
        {title} ({courseCount})
      </h1>
      <p className="flex gap-1">
        <span>{btnText}</span>
        {btnIcon}
      </p>
    </div>
  );
};

export default DashboardTitle;
