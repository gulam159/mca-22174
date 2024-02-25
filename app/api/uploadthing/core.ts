import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();
// Check for an authorised user
const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized user");
  return { userId };
};
// FileRouter for the app, containing multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
