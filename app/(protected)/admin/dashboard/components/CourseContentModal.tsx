"use client";

import {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
} from "@/actions/course.action";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Plus, Edit, Trash2, BookOpen, GripVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface CourseContentModalProps {
  courseId: string;
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CourseContentModal = ({
  courseId,
  courseName,
  isOpen,
  onClose,
}: CourseContentModalProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });

  useEffect(() => {
    if (isOpen && courseId) {
      loadLessons();
    }
  }, [isOpen, courseId]);

  const loadLessons = async () => {
    try {
      const data = await getLessonsByCourse(courseId);
      setLessons(data);
    } catch (error) {
      toast.error("Failed to load lessons");
    }
  };

  const handleCreateLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsLoading(true);
    try {
      await createLesson({
        courseId,
        title: newLesson.title.trim(),
        content: newLesson.content.trim(),
        order: lessons.length + 1,
      });

      toast.success("Lesson created successfully");
      setNewLesson({ title: "", content: "" });
      await loadLessons();
    } catch (error) {
      toast.error("Failed to create lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;

    setIsLoading(true);
    try {
      await updateLesson(editingLesson.id, {
        title: editingLesson.title,
        content: editingLesson.content,
      });

      toast.success("Lesson updated successfully");
      setEditingLesson(null);
      await loadLessons();
    } catch (error) {
      toast.error("Failed to update lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await deleteLesson(lessonId);
      toast.success("Lesson deleted successfully");
      await loadLessons();
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Course Content: {courseName}
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Add New Lesson */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Add New Lesson</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Lesson Title"
                placeholder="Enter lesson title"
                value={newLesson.title}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, title: e.target.value })
                }
              />
              <Textarea
                label="Lesson Content"
                placeholder="Enter lesson content (supports markdown)"
                value={newLesson.content}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, content: e.target.value })
                }
                minRows={4}
              />
              <Button
                color="primary"
                startContent={<Plus size={16} />}
                onPress={handleCreateLesson}
                isLoading={isLoading}
                className="w-full"
              >
                Add Lesson
              </Button>
            </CardBody>
          </Card>

          {/* Existing Lessons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Lessons ({lessons.length})
            </h3>
            {lessons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No lessons added yet</p>
              </div>
            ) : (
              lessons.map((lesson, index) => (
                <Card key={lesson.id} className="border">
                  <CardBody className="p-4">
                    {editingLesson?.id === lesson.id ? (
                      <div className="space-y-4">
                        <Input
                          label="Lesson Title"
                          value={editingLesson.title}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          label="Lesson Content"
                          value={editingLesson.content}
                          onChange={(e) =>
                            setEditingLesson({
                              ...editingLesson,
                              content: e.target.value,
                            })
                          }
                          minRows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="primary"
                            onPress={handleUpdateLesson}
                            isLoading={isLoading}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => setEditingLesson(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Lesson {index + 1}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {lesson.content}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="flat"
                            color="secondary"
                            onPress={() => setEditingLesson(lesson)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CourseContentModal;
