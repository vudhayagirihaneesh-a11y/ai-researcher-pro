"use client";

import { motion } from "framer-motion";
import {
  Download,
  Eye,
  FolderArchive,
  Globe,
  ImageOff,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { EssayImageDTO, ResearchMode } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAiCredit, type ImageProgress } from "@/components/research/utils";
import { toast } from "sonner";

export function PhotoGallery({
  images,
  placeholder,
  mode,
  sessionId,
}: {
  images: EssayImageDTO[];
  placeholder: ImageProgress | null;
  mode: ResearchMode;
  sessionId: string | null;
}) {
  const generatingLabel =
    mode === "photo-essay" ? "Generating image" : "Finding real photos";

  return (
    <div className="space-y-4">
      {(images.length > 0 || placeholder) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {images.length > 0 && (
              <>
                <span className="font-medium text-stone-700 dark:text-stone-200">
                  {images.length}
                </span>{" "}
                {images.length === 1 ? "photo" : "photos"} · click{" "}
                <span className="font-medium">Save</span> on any card for the
                full-resolution file
              </>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {images.map((image, i) => {
          const ai = isAiCredit(image.credit);
          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i, 3) * 0.04 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption}
                  loading="lazy"
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-48"
                />
                <Badge
                  className={
                    ai
                      ? "absolute top-2 left-2 gap-1 border-transparent bg-stone-950/70 text-blue-200 backdrop-blur"
                      : "absolute top-2 left-2 gap-1 border-transparent bg-stone-950/70 text-stone-200 backdrop-blur"
                  }
                >
                  {ai ? (
                    <Sparkles className="size-2.5" />
                  ) : (
                    <Globe className="size-2.5" />
                  )}
                  {ai ? "AI-generated" : "Web"}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-3">
                <p className="line-clamp-2 flex-1 text-xs leading-snug text-stone-600 dark:text-stone-300">
                  {image.caption}
                </p>
                <p className="truncate text-[10px] tracking-wide text-stone-400 uppercase">
                  {image.credit}
                </p>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1 border-stone-200 dark:border-stone-700"
                  >
                    <a href={image.url} target="_blank" rel="noreferrer">
                      <Eye className="size-3.5" />
                      View
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="h-9 flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <a
                      href={image.downloadUrl}
                      download
                      onClick={() => toast.success("Image download started")}
                    >
                      <Download className="size-3.5" />
                      Save
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {placeholder && (
          <motion.div
            key={`placeholder-${placeholder.index}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-blue-300/70 bg-blue-50/50 p-4 text-center dark:border-blue-800/50 dark:bg-blue-950/20"
          >
            <Loader2 className="size-6 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
              {generatingLabel} {placeholder.index}/{placeholder.total}…
            </p>
            {placeholder.prompt && (
              <p className="line-clamp-3 text-[11px] leading-snug text-blue-700/70 dark:text-blue-400/60">
                {placeholder.prompt}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {images.length === 0 && !placeholder && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-300 py-16 text-center dark:border-stone-700">
          <ImageOff className="size-8 text-stone-300 dark:text-stone-600" />
          <p className="max-w-xs text-sm text-stone-500 dark:text-stone-400">
            No photos yet — they appear here one by one during the images stage
            of the run.
          </p>
        </div>
      )}
    </div>
  );
}
