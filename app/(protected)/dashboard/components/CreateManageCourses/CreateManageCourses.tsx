import DashboardTitle from "../DashboardTitle";
import CreateCourse from "./CreateCourse";

const CreateManageCourses = () => {
  return (
    <div>
      <DashboardTitle courseCount={0} title="Create and Manage courses" />
      <CreateCourse />
    </div>
  );
};

export default CreateManageCourses;
