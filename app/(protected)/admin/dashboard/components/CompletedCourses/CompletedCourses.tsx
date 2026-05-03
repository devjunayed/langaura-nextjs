import React from "react";
import DashboardTitle from "../DashboardTitle";

const CompletedCourses = () => {
  return (
    <div>
      <DashboardTitle
        courseCount={0}
        title="Completed"
      />
      <div className="bg-white flex gap-2 p-2 border border-gray-200 rounded-md">
        <div className="w-50 h-50 shadow-md flex items-center justify-center border  border-dashed border-gray-300 text-gray-300 text-4xl">
          +
        </div>
      </div>
    </div>
  );
};

export default CompletedCourses;
