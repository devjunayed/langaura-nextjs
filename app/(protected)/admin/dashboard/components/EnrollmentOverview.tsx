"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { Search, Calendar, User, BookOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Enrollment {
  id: string;
  progress: number;
  enrolledAt: Date;
  course: {
    id: string;
    name: string;
    label: string;
    price: number;
    image: string | null;
    author: { name: string };
  };
  user: {
    name: string;
    email: string;
  };
}

interface EnrollmentOverviewProps {
  enrollments: Enrollment[];
}

const EnrollmentOverview = ({ enrollments }: EnrollmentOverviewProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalRevenue = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.course.price,
    0,
  );
  const averageProgress =
    enrollments.length > 0
      ? enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) /
        enrollments.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold">{enrollments.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Progress
                </p>
                <p className="text-2xl font-bold">
                  {averageProgress.toFixed(1)}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search enrollments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Enrollments List */}
      <div className="space-y-4">
        {filteredEnrollments.map((enrollment) => (
          <Card
            key={enrollment.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                {/* Course Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {enrollment.course.image ? (
                    <Image
                      src={enrollment.course.image}
                      alt={enrollment.course.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Enrollment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {enrollment.course.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {enrollment.course.label} • by{" "}
                        {enrollment.course.author.name}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      ${enrollment.course.price}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {enrollment.user.name}
                    </span>
                    <span>{enrollment.user.email}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-medium">
                        {enrollment.progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={enrollment.progress}
                      className="h-2"
                      color="primary"
                    />
                  </div>

                  {/* Enrollment Date */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Calendar size={12} />
                    Enrolled {enrollment.enrolledAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No enrollments found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No students have enrolled in courses yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentOverview;
