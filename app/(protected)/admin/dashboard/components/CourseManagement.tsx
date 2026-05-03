"use client";

import { getAllCourses } from "@/actions/course.action";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import CreateCourseModal from "./CreateCourseModal";
import CourseContentModal from "./CourseContentModal";

interface Course {
  id: string;
  name: string;
  label: string;
  price: number;
  image: string | null;
  createdAt: Date;
  author: { name: string };
  _count: { enrollments: number };
}

interface CourseManagementProps {
  courses: Course[];
}

const CourseManagement = ({
  courses: initialCourses,
}: CourseManagementProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCourseCreated = async () => {
    // Refresh courses after creation
    const updatedCourses = await getAllCourses();
    setCourses(updatedCourses);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Course Management
        </h2>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={() => setIsCreateModalOpen(true)}
        >
          Create Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  ${course.price}
                </span>
              </div>
            </div>
            <CardBody className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.label} • by {course.author.name}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {course._count.enrollments} enrolled
                  </span>
                  <span className="text-gray-500">
                    {course.createdAt.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="flat" color="primary">
                    <Eye size={14} />
                    View
                  </Button>
                  <Button size="sm" variant="flat" color="secondary">
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button size="sm" variant="flat" color="success">
                    <BookOpen size={14} />
                    Content
                  </Button>
                  <Button size="sm" variant="flat" color="danger">
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first course to get started"}
          </p>
        </div>
      )}

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCourseCreated}
      />
    </div>
  );
};

export default CourseManagement;
