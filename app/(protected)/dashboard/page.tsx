import { ArrowBigRight, ChevronRight, MoveRight } from "lucide-react";
import React from "react";
import DashboardTitle from "./components/DashboardTitle";

const CoursePage = () => {
  return (
    <div className="space-y-4 mt-6">
      <div>
        <DashboardTitle courseCount={0} title="Enrolled Courses" />

        <div className="bg-white grid grid-cols-6 p-2  rounded-md">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-50 h-50 shadow-md">
              HTML
            </div>
          ))}
        </div>
      </div>
      <div>
        <DashboardTitle courseCount={0} title="Create and Manage courses" />

        <div className="bg-white flex gap-2 p-2 border border-gray-200 rounded-md">
          <div className="w-50 h-50 shadow-md flex items-center justify-center border  border-dashed border-gray-300 text-gray-300 text-4xl">
            +
          </div>
        </div>
      </div>
      <div>
        <DashboardTitle
          btnIcon={<ChevronRight />}
          courseCount={0}
          title="Completed"
        />
        <div className="bg-white flex gap-2 p-2 border border-gray-200 rounded-md">
          <div className="w-50 h-50 shadow-md flex items-center justify-center border  border-dashed border-gray-300 text-gray-300 text-4xl">
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
