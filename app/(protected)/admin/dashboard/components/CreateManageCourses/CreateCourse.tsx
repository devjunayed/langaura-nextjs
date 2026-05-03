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
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const CreateCourse = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<any>();
  const [courseLang, setCourseLang] = useState<
    | {
        key: string;
        label: string;
      }
    | undefined
  >({
    key: "",
    label: "",
  });

  console.log(imageFile);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsLoading(true);
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      // const baseImage = toBase64(image);
      const formData = new FormData();
      formData.append("image", image);
      const data = await UploadImage(formData);
      if (data) {
        toast.success("Image uploaded!", {
          position: "top-center",
        });
      }
      setImageFile(data);
    }
    setIsLoading(false);
  };

  const removeImage = async () => {
    const imageData = {
      public_id: imageFile.data.public_id,
      signature: imageFile.data.signature,
    };

    const response = await DeleteImage(imageData);
    if (response.result === "ok") {
      toast.success("Image removed", {
        position: "top-center",
      });
      setImageFile(null);
    }
  };

  const onSubmit = async () => {
    if (courseName && courseLang) {
      const res = await createCourse({
        name: courseName,
        key: courseLang?.key,
        label: courseLang?.label,
        price: coursePrice,
        image: imageFile?.data?.secure_url,
      });

      console.log({ res });
    }
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="dark:bg-black bg-white cursor-pointer w-50 h-50 flex gap-2 p-2   rounded-4xl"
      >
        <div className=" w-full h-full shadow-md flex items-center justify-center border  border-dashed border-gray-300 text-gray-300 text-4xl">
          +
        </div>
      </div>
      <Modal
        shouldBlockScroll={true}
        size="2xl"
        isOpen={isOpen}
        closeButton={
          <Button
            isIconOnly
            size="sm"
            color="primary"
            className="group "
            onPress={onClose}
          >
            <X className="size-4 text-white group-hover:text-gray-900  " />
          </Button>
        }
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <>
            <ModalHeader>Create a course</ModalHeader>
            <ModalBody>
              <>
                <div className="my-8 flex items-center gap-4 mx-auto">
                  {imageFile ? (
                    <div className="relative  group  w-[120px] h-[120px]">
                      <div className="absolute bg-red-900/45 inset-0  hidden cursor-pointer group-hover:flex z-20 items-center justify-center">
                        <Trash2
                          onClick={() => removeImage()}
                          className="text-white"
                          size={24}
                        />
                      </div>
                      <Image
                        className="  border-gray-300 border-1 w-[120px] h-[120px] "
                        alt=""
                        src={imageFile.data.url}
                        width={500}
                        height={500}
                      />
                    </div>
                  ) : (
                    <div className="">
                      <label
                        htmlFor="image"
                        className=" h-[120px] w-[120px] flex justify-center items-center border  border-dashed text-gray-400  rounded cursor-pointer  "
                      >
                        {isLoading ? (
                          <p className="text-md">Uploading...</p>
                        ) : (
                          <p className="text-3xl">+</p>
                        )}
                      </label>
                      <input
                        accept="image/*"
                        onChange={handleFileChange}
                        id="image"
                        type="file"
                        className="hidden h-[120px] w-[120px]"
                      />
                    </div>
                  )}
                </div>
                <Input
                  className="cursor-pointer"
                  placeholder="e.g English grammer"
                  labelPlacement="outside"
                  label="Enter course name"
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <Select
                  onChange={(event) => {
                    setCourseLang(
                      majorLanguages?.find(
                        (lang) => lang.key === event.target.value,
                      ),
                    );
                  }}
                  labelPlacement="outside"
                  placeholder="English"
                  className="cursor-pointer"
                  label="Select course language"
                >
                  {majorLanguages.map((lang) => (
                    <SelectItem key={lang.key}>{lang.label}</SelectItem>
                  ))}
                </Select>{" "}
                <Input
                  type="number"
                  className="cursor-pointer"
                  placeholder="0"
                  labelPlacement="outside"
                  label="Course price (USD)"
                  value={coursePrice.toString()}
                  onChange={(e) => setCoursePrice(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />{" "}
              </>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onSubmit}>
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
