import { getAdminStats, getAllCourses } from "@/actions/course.action";
import { getAllEnrollments } from "@/actions/enrollment.action";
import { Card, CardBody } from "@heroui/card";
import { BookOpen, DollarSign, Users, UserCheck } from "lucide-react";
import StatsCards from "./components/StatsCards";
import AdminDashboardTabs from "./components/AdminDashboardTabs";

const AdminDashboardPage = async () => {
  const [stats, courses, enrollments] = await Promise.all([
    getAdminStats(),
    getAllCourses(),
    getAllEnrollments(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your courses and monitor platform activity
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content */}
      <Card className="w-full">
        <CardBody className="p-0">
          <AdminDashboardTabs courses={courses} enrollments={enrollments} />
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
