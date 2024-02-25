"use client";
import type { Chapter } from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Grip, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChapterProps {
  onReorder: (updatedData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  items: Chapter[] | [];
}

const ChapterList: React.FC<ChapterProps> = ({ items, onReorder, onEdit }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapter] = useState(items);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    router.refresh();
  }, []);

  useEffect(() => {
    setChapter(items);
  }, [items]);

  const onDrangEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapter = items.slice(startIndex, endIndex + 1);
    setChapter(items);

    const bulkUpadateData = updatedChapter.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpadateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDrangEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => {
              return (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm",
                        chapter.isPublished &&
                          "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          chapter.isPublished &&
                            "border-r-sky-200 hover:bg-sky-200"
                        )}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            chapter.isPublished && "bg-sky-700"
                          )}
                        >
                          {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(chapter.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default ChapterList;
