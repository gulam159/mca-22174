"use client";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast, { Toast } from "react-hot-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import { useConfettiStore } from "@/hooks/useConfettiStore";

interface VideoPlayerProps {
  chapterId: string;
  coursesId: string;
  playbackId: string;
  nextChapterId?: string;
  title: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  chapterId,
  completeOnEnd,
  coursesId,
  isLocked,
  playbackId,
  title,
  nextChapterId,
}) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        axios.put(`/api/courses/${coursesId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
        router.refresh();
      }

      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated");
      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${coursesId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="animate-spin h-8 w-8 text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8 text-secondary" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
export default VideoPlayer;
