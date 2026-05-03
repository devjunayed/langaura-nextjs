"use client";

import { createCourse } from "@/actions/course.action";
import { DeleteImage, UploadImage } from "@/actions/image.action";
import { majorLanguages } from "@/constants/majorLanguages";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCourseModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateCourseModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<any>();
  const [courseLang, setCourseLang] = useState<
    | {
        key: string;
        label: string;
      }
    | undefined
  >();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || !event.target.files[0]) return;

    setUploadingImage(true);
    try {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      const data = await UploadImage(formData);

      if (data) {
        toast.success("Image uploaded successfully!");
        setImageFile(data);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = async () => {
    if (!imageFile) return;

    try {
      const imageData = {
        public_id: imageFile.data.public_id,
        signature: imageFile.data.signature,
      };

      const response = await DeleteImage(imageData);
      if (response.result === "ok") {
        toast.success("Image removed");
        setImageFile(null);
      }
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!courseLang) {
      toast.error("Please select a language");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCourse({
        name: courseName.trim(),
        key: courseLang.key,
        label: courseLang.label,
        price: coursePrice,
        image: imageFile?.data?.secure_url,
      });

      if (result) {
        toast.success("Course created successfully!");
        // Reset form
        setCourseName("");
        setCoursePrice(0);
        setImageFile(null);
        setCourseLang(undefined);
        onSuccess();
      } else {
        toast.error("Failed to create course");
      }
    } catch (error) {
      toast.error("An error occurred while creating the course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCourseName("");
      setCoursePrice(0);
      setImageFile(null);
      setCourseLang(undefined);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Create New Course
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {imageFile ? (
                <div className="relative group">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      onPress={removeImage}
                      className="rounded-full"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <Image
                    src={imageFile.data.url}
                    alt="Course preview"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover border"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  {uploadingImage ? (
                    <div className="text-sm text-gray-500">Uploading...</div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Upload course image
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <Input
              label="Course Name"
              placeholder="e.g., English Grammar Fundamentals"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              isRequired
            />

            <Select
              label="Language"
              placeholder="Select course language"
              selectedKeys={courseLang ? [courseLang.key] : []}
              onChange={(event) => {
                const selectedLang = majorLanguages.find(
                  (lang) => lang.key === event.target.value,
                );
                setCourseLang(selectedLang);
              }}
              isRequired
            >
              {majorLanguages.map((lang) => (
                <SelectItem key={lang.key}>{lang.label}</SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Price (USD)"
              placeholder="0.00"
              value={coursePrice.toString()}
              onChange={(e) => setCoursePrice(Number(e.target.value) || 0)}
              min="0"
              step="0.01"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCourseModal;
