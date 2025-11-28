"use client";
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
import { X } from "lucide-react";

const CreateCourse = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <div
        onClick={onOpen}
        className="bg-white cursor-pointer flex gap-2 p-2  rounded-md"
      >
        <div className="w-50 h-50 shadow-md flex items-center justify-center border  border-dashed border-gray-300 text-gray-300 text-4xl">
          +
        </div>
      </div>
      <Modal
        shouldBlockScroll={true}
        size="2xl"
        isOpen={isOpen}
        closeButton={
          <Button className="w-0 p-0" onPress={onClose}>
            <X />
          </Button>
        }
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <>
            <ModalHeader>Create a course</ModalHeader>
            <ModalBody>
              <>
                <Input
                  className="cursor-pointer"
                  placeholder="e.g English grammer"
                  labelPlacement="outside"
                  label="Enter course name"
                />
                <Select
                  labelPlacement="outside"
                  placeholder="English"
                  className="cursor-pointer"
                  label="Select course language"
                >
                  {majorLanguages.map((lang) => (
                    <SelectItem key={lang.key}>{lang.label}</SelectItem>
                  ))}
                </Select>
              </>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCourse;
