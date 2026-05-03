import { getUserEnrollments } from "@/actions/enrollment.action";
import DashboardTitle from "../DashboardTitle";

const EnrolledCourses = async () => {
  const enrollments = await getUserEnrollments();

  return (
    <div>
      <DashboardTitle
        courseCount={enrollments.length}
        title="Enrolled Courses"
      />
      {enrollments.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <p className="text-lg font-medium mb-2">No enrolled courses yet</p>
          <p className="text-sm">
            Browse and enroll in courses to start learning!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 grid gap-4 p-4 rounded-md">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {enrollment.course.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {enrollment.course.label} • by{" "}
                    {enrollment.course.author?.name ?? "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Progress
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {enrollment.progress.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>
                  Enrolled {enrollment.enrolledAt.toLocaleDateString()}
                </span>
                <span className="text-primary font-medium cursor-pointer hover:underline">
                  Continue Learning
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
