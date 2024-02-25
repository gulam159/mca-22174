"use client";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import type { Chapter, MuxData } from "@prisma/client";
import { PencilIcon, PlusCircleIcon, VideoIcon } from "lucide-react";

interface ChapterVideoFormProps {
  intialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm: React.FC<ChapterVideoFormProps> = ({
  intialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        value
      );
      toast.success("Chapter updated");
      setIsEditing(!isEditing);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 bg-slate-100 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
          {isEditing && <>Cancel</>}
          {!isEditing && !intialData.videoUrl && (
            <>
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add an video
            </>
          )}
          {!isEditing && intialData.videoUrl && (
            <>
              <PencilIcon className="h-4 w-4 mr-2" /> Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!intialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={intialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endPoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                handleSubmit({ videoUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </p>
        </div>
      )}
      {intialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          doesn&apos;t appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
