"use client";

import {
  createLesson,
  createSubLesson,
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
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Edit,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  PlaySquare,
  Plus,
  SquareMousePointer,
  Table,
  Trash2,
  BookOpen,
  GripVertical,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  subLessons: SubLesson[];
}

interface SubLesson {
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

interface RichLessonEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const highlightColors = [
  "#fef08a",
  "#bbf7d0",
  "#bfdbfe",
  "#fecdd3",
  "#ddd6fe",
  "#fed7aa",
  "#e2e8f0",
];

const textColors = [
  "#111827",
  "#dc2626",
  "#16a34a",
  "#2563eb",
  "#9333ea",
  "#ea580c",
  "#0891b2",
];

const emptyLessonContent = "<p><br></p>";

const getPlainText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const getVideoEmbed = (url: string) => {
  try {
    const videoUrl = new URL(url);

    if (videoUrl.hostname.includes("youtube.com")) {
      const videoId = videoUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (videoUrl.hostname.includes("youtu.be")) {
      const videoId = videoUrl.pathname.replace("/", "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (videoUrl.hostname.includes("vimeo.com")) {
      const videoId = videoUrl.pathname.replace("/", "");
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
};

const RichLessonEditor = ({ value, onChange }: RichLessonEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || emptyLessonContent;
    }
  }, [value]);

  const syncEditor = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncEditor();
  };

  const insertHtml = (html: string) => {
    runCommand("insertHTML", html);
  };

  const addLink = () => {
    const url = prompt("Enter link URL");
    if (!url) return;
    runCommand("createLink", url);
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;
    insertHtml(
      `<figure><img src="${escapeAttribute(url)}" alt="Lesson image" /><figcaption>Image caption</figcaption></figure>`,
    );
  };

  const addVideo = () => {
    const url = prompt("Enter YouTube, Vimeo, or video URL");
    if (!url) return;
    insertHtml(
      `<div class="lesson-video"><iframe src="${escapeAttribute(getVideoEmbed(url))}" title="Lesson video" allowfullscreen></iframe></div>`,
    );
  };

  const addTable = () => {
    insertHtml(
      "<table><thead><tr><th>Topic</th><th>Details</th></tr></thead><tbody><tr><td>Example</td><td>Write here</td></tr><tr><td>Practice</td><td>Write here</td></tr></tbody></table>",
    );
  };

  const addButton = () => {
    const label = prompt("Button label", "Open resource") || "Open resource";
    const url = prompt("Button URL", "https://") || "#";
    insertHtml(
      `<a class="lesson-button" href="${escapeAttribute(url)}">${escapeAttribute(label)}</a>`,
    );
  };

  const addSnippet = () => {
    insertHtml(
      "<pre><code>// Add your code, grammar pattern, or example snippet here</code></pre>",
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 p-3 dark:border-gray-700">
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("formatBlock", "h2")}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("formatBlock", "h3")}
        >
          <Heading3 size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("formatBlock", "p")}
        >
          <Pilcrow size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("bold")}
        >
          <Bold size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("italic")}
        >
          <Italic size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("insertUnorderedList")}
        >
          <List size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("insertOrderedList")}
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("justifyLeft")}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("justifyCenter")}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => runCommand("justifyRight")}
        >
          <AlignRight size={16} />
        </Button>

        <select
          aria-label="Text size"
          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(event) => runCommand("fontSize", event.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Size
          </option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 dark:border-gray-700">
          <Palette size={15} />
          {textColors.map((color) => (
            <button
              key={color}
              aria-label={`Text color ${color}`}
              type="button"
              className="h-5 w-5 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              onClick={() => runCommand("foreColor", color)}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 dark:border-gray-700">
          <Highlighter size={15} />
          {highlightColors.map((color) => (
            <button
              key={color}
              aria-label={`Highlight ${color}`}
              type="button"
              className="h-5 w-5 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
              onClick={() => runCommand("hiliteColor", color)}
            />
          ))}
        </div>

        <Button isIconOnly size="sm" variant="flat" onPress={addLink}>
          <Link size={16} />
        </Button>
        <Button isIconOnly size="sm" variant="flat" onPress={addImage}>
          <ImageIcon size={16} />
        </Button>
        <Button isIconOnly size="sm" variant="flat" onPress={addVideo}>
          <PlaySquare size={16} />
        </Button>
        <Button isIconOnly size="sm" variant="flat" onPress={addTable}>
          <Table size={16} />
        </Button>
        <Button isIconOnly size="sm" variant="flat" onPress={addButton}>
          <SquareMousePointer size={16} />
        </Button>
        <Button isIconOnly size="sm" variant="flat" onPress={addSnippet}>
          <Code2 size={16} />
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="lesson-content min-h-56 max-h-[420px] overflow-y-auto p-4 text-sm text-gray-900 outline-none dark:text-gray-100"
        onInput={syncEditor}
        onBlur={syncEditor}
      />
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<"add" | "lessons">("add");
  const [addingSubLessonFor, setAddingSubLessonFor] = useState<string | null>(
    null,
  );
  const [subLessonDraft, setSubLessonDraft] = useState({
    title: "",
    content: "",
  });
  const [subLessonLoadingId, setSubLessonLoadingId] = useState<string | null>(
    null,
  );

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
    if (!newLesson.title.trim() || !getPlainText(newLesson.content)) {
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
      setActiveTab("lessons");
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

  const openSubLessonForm = (lessonId: string) => {
    setAddingSubLessonFor(lessonId);
    setSubLessonDraft({ title: "", content: "" });
  };

  const handleCreateSubLesson = async (lesson: Lesson) => {
    if (!subLessonDraft.title.trim() || !getPlainText(subLessonDraft.content)) {
      toast.error("Sub-lesson title and content are required");
      return;
    }

    setSubLessonLoadingId(lesson.id);
    try {
      await createSubLesson({
        lessonId: lesson.id,
        title: subLessonDraft.title.trim(),
        content: subLessonDraft.content.trim(),
        order: lesson.subLessons.length + 1,
      });

      toast.success("Sub-lesson created successfully");
      setAddingSubLessonFor(null);
      setSubLessonDraft({ title: "", content: "" });
      await loadLessons();
    } catch (error) {
      toast.error("Failed to create sub-lesson");
    } finally {
      setSubLessonLoadingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Course Content: {courseName}
        </ModalHeader>
        <ModalBody>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as "add" | "lessons")}
            aria-label="Course content sections"
            classNames={{
              base: "w-full",
              tabList: "w-full",
              panel: "pt-5",
            }}
          >
            <Tab key="add" title="Add Lesson">
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
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Lesson Content
                    </p>
                    <RichLessonEditor
                      value={newLesson.content}
                      onChange={(content) =>
                        setNewLesson({ ...newLesson, content })
                      }
                    />
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="lessons" title={`Lessons (${lessons.length})`}>
              <div className="space-y-4">
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
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Lesson Content
                              </p>
                              <RichLessonEditor
                                value={editingLesson.content}
                                onChange={(content) =>
                                  setEditingLesson({
                                    ...editingLesson,
                                    content,
                                  })
                                }
                              />
                            </div>
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
                              <div
                                className="lesson-content line-clamp-3 text-sm text-gray-600 dark:text-gray-400"
                                dangerouslySetInnerHTML={{
                                  __html: lesson.content,
                                }}
                              />
                              <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
                                <div className="flex items-center justify-between gap-3">
                                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Sub-lessons ({lesson.subLessons.length})
                                  </h5>
                                  <Button
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    onPress={() => openSubLessonForm(lesson.id)}
                                  >
                                    <Plus size={14} />
                                    Add Sub-lesson
                                  </Button>
                                </div>

                                {lesson.subLessons.length > 0 && (
                                  <div className="space-y-2">
                                    {lesson.subLessons.map((subLesson) => (
                                      <div
                                        key={subLesson.id}
                                        className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-950"
                                      >
                                        <p className="text-xs text-gray-500">
                                          Sub-lesson {subLesson.order}
                                        </p>
                                        <h6 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                          {subLesson.title}
                                        </h6>
                                        <div
                                          className="lesson-content line-clamp-2 text-xs text-gray-600 dark:text-gray-400"
                                          dangerouslySetInnerHTML={{
                                            __html: subLesson.content,
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {addingSubLessonFor === lesson.id && (
                                  <div className="space-y-3 rounded-xl border border-primary/30 bg-white p-3 dark:bg-gray-950">
                                    <Input
                                      label="Sub-lesson Title"
                                      placeholder="Enter sub-lesson title"
                                      value={subLessonDraft.title}
                                      onChange={(event) =>
                                        setSubLessonDraft((current) => ({
                                          ...current,
                                          title: event.target.value,
                                        }))
                                      }
                                    />
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        Sub-lesson Content
                                      </p>
                                      <RichLessonEditor
                                        value={subLessonDraft.content}
                                        onChange={(content) =>
                                          setSubLessonDraft((current) => ({
                                            ...current,
                                            content,
                                          }))
                                        }
                                      />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        size="sm"
                                        color="primary"
                                        onPress={() =>
                                          handleCreateSubLesson(lesson)
                                        }
                                        isLoading={
                                          subLessonLoadingId === lesson.id
                                        }
                                      >
                                        Submit Sub-lesson
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="flat"
                                        onPress={() =>
                                          setAddingSubLessonFor(null)
                                        }
                                        disabled={
                                          subLessonLoadingId === lesson.id
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
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
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          {activeTab === "add" && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onPress={handleCreateLesson}
              isLoading={isLoading}
              className="font-semibold"
            >
              Submit Lesson
            </Button>
          )}
          <Button variant="flat" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CourseContentModal;
