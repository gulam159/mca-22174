import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";

interface ChapterIdProps {
  params: {
    coursesId: string;
    chapterId: string;
  };
}

const ChapterIdPage: React.FC<ChapterIdProps> = async ({ params }) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const { chapterId, coursesId } = params;

  const {
    chapter,
    attachment,
    course,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({ userId, chapterId, coursesId });

  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="w-full">
      {userProgress?.isCompleted && (
        <Banner
          Variant="success"
          label="You've already completed this chapter"
        />
      )}
      {isLocked && (
        <Banner
          Variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            coursesId={coursesId}
            title={chapter.title}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                coursesId={coursesId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton coursesId={coursesId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachment.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachment.map(({ id, url, name }) => (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline mb-2"
                  >
                    <p className="line-clamp-1 flex items-center gap-3">
                      <File /> {name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
