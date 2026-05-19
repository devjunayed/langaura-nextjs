"use client";

import {
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "@/actions/course.action";
import { majorLanguages } from "@/constants/majorLanguages";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CreateCourseModal from "./CreateCourseModal";
import CourseContentModal from "./CourseContentModal";

interface Course {
  id: string;
  name: string;
  key: string;
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
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [contentCourse, setContentCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    key: "",
    label: "",
    price: 0,
  });

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

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

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setEditForm({
      name: course.name,
      key: course.key,
      label: course.label,
      price: course.price,
    });
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    if (!editForm.name.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!editForm.key || !editForm.label) {
      toast.error("Please select a language");
      return;
    }

    setIsSavingEdit(true);
    try {
      await updateCourse(editingCourse.id, {
        name: editForm.name.trim(),
        key: editForm.key,
        label: editForm.label,
        price: editForm.price,
      });
      const updatedCourses = await getAllCourses();
      setCourses(updatedCourses);
      setEditingCourse(null);
      toast.success("Course updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update course");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    const shouldDelete = confirm(
      `Delete "${course.name}"? This will also delete its lessons, enrollments, and progress.`,
    );

    if (!shouldDelete) return;

    setDeletingCourseId(course.id);
    try {
      await deleteCourse(course.id);
      setCourses((currentCourses) =>
        currentCourses.filter((item) => item.id !== course.id),
      );
      toast.success("Course deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete course");
    } finally {
      setDeletingCourseId(null);
    }
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

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() => router.push(`/user/courses/${course.id}`)}
                  >
                    <Eye size={14} />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="secondary"
                    onPress={() => openEditModal(course)}
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    onPress={() => setContentCourse(course)}
                  >
                    <BookOpen size={14} />
                    Content
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => handleDeleteCourse(course)}
                    isLoading={deletingCourseId === course.id}
                    disabled={deletingCourseId === course.id}
                  >
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

      {contentCourse && (
        <CourseContentModal
          courseId={contentCourse.id}
          courseName={contentCourse.name}
          isOpen={Boolean(contentCourse)}
          onClose={() => setContentCourse(null)}
        />
      )}

      <Modal
        isOpen={Boolean(editingCourse)}
        onClose={() => {
          if (!isSavingEdit) setEditingCourse(null);
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Course
          </ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Course Name"
              value={editForm.name}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              isRequired
            />

            <Select
              label="Language"
              selectedKeys={editForm.key ? [editForm.key] : []}
              onChange={(event) => {
                const selectedLanguage = majorLanguages.find(
                  (language) => language.key === event.target.value,
                );

                if (!selectedLanguage) return;

                setEditForm((current) => ({
                  ...current,
                  key: selectedLanguage.key,
                  label: selectedLanguage.label,
                }));
              }}
              isRequired
            >
              {majorLanguages.map((language) => (
                <SelectItem key={language.key}>{language.label}</SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Price (USD)"
              value={editForm.price.toString()}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  price: Number(event.target.value) || 0,
                }))
              }
              min="0"
              step="0.01"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setEditingCourse(null)}
              disabled={isSavingEdit}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateCourse}
              isLoading={isSavingEdit}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CourseManagement;
