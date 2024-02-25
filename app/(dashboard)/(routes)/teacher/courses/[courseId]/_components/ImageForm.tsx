"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import type { Courses } from "@prisma/client";
import axios from "axios";
import { ImageIcon, PencilIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

interface ImageFormProps {
  intialData: Courses;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

const ImageForm: React.FC<ImageFormProps> = ({ intialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, value);
      toast.success("Course updated");
      setIsEditing(!isEditing);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 bg-slate-100 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
          {isEditing && <>Cancel</>}
          {!isEditing && !intialData.imageUrl && (
            <>
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && intialData.imageUrl && (
            <>
              <PencilIcon className="h-4 w-4 mr-2" /> Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!intialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              src={intialData.imageUrl}
              alt="upload"
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endPoint="courseImage"
            onChange={(url) => {
              if (url) {
                handleSubmit({ imageUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
