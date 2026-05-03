"use client";

import { Button } from "@heroui/button";
import { BookOpen, UserCheck } from "lucide-react";
import { useState } from "react";
import CourseManagement from "./CourseManagement";
import EnrollmentOverview from "./EnrollmentOverview";

interface AdminDashboardTabsProps {
  courses: any[];
  enrollments: any[];
}

const AdminDashboardTabs = ({
  courses,
  enrollments,
}: AdminDashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState<"courses" | "enrollments">(
    "courses",
  );

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <Button
          variant={activeTab === "courses" ? "solid" : "light"}
          onPress={() => setActiveTab("courses")}
          className={`flex items-center space-x-2 px-6 py-3 rounded-none border-b-2 ${
            activeTab === "courses"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          <BookOpen size={18} />
          <span>Course Management</span>
        </Button>
        <Button
          variant={activeTab === "enrollments" ? "solid" : "light"}
          onPress={() => setActiveTab("enrollments")}
          className={`flex items-center space-x-2 px-6 py-3 rounded-none border-b-2 ${
            activeTab === "enrollments"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 dark:text-gray-400"
          }`}
        >
          <UserCheck size={18} />
          <span>Enrollments</span>
        </Button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "courses" ? (
          <CourseManagement courses={courses} />
        ) : (
          <EnrollmentOverview enrollments={enrollments} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardTabs;
