import { ChevronRight } from "lucide-react";
import DashboardTitle from "./components/DashboardTitle";
import EnrolledCourses from "./components/EnrolledCourses/EnrolledCourses";
import CreateManageCourses from "./components/CreateManageCourses/CreateManageCourses";
import CompletedCourses from "./components/CompletedCourses/CompletedCourses";

const CoursePage = () => {
  return (
    <div className="space-y-4 mt-6">
      <EnrolledCourses />
      <CreateManageCourses />
      <CompletedCourses />
    </div>
  );
};

export default CoursePage;
