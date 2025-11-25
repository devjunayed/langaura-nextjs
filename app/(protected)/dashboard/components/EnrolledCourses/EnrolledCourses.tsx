import DashboardTitle from "../DashboardTitle";

const EnrolledCourses = () => {
  return (
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
  );
};

export default EnrolledCourses;
