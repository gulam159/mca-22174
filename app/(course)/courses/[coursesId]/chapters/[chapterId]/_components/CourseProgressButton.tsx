"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useConfettiStore } from "@/hooks/useConfettiStore";
import axios from "axios";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterId: string;
  coursesId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}

const CourseProgressButton: React.FC<CourseProgressButtonProps> = ({
  chapterId,
  coursesId,
  isCompleted,
  nextChapterId,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/api/courses/${coursesId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${coursesId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      type="button"
      variant={isCompleted ? "outline" : "success"}
      onClick={handleClick}
      disabled={loading}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" size={16} />
    </Button>
  );
};
export default CourseProgressButton;
