import DashboardTitle from "../DashboardTitle";
import CreateCourse from "./CreateCourse";
import ManageCourse from "./ManageCourse";

const CreateManageCourses = () => {
  return (
    <div>
      <DashboardTitle courseCount={0} title="Create and Manage courses" />

      <div className="flex gap-4">
      <CreateCourse />
      <ManageCourse />
      </div>
    </div>
  );
};

export default CreateManageCourses;
