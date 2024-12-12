// components/History.tsx
'use client';

import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { useThumbnails } from "@/hooks/useThumbnails";
import { Loader2 } from "lucide-react";

export default function History() {
  const { thumbnails, loading, error } = useThumbnails();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p>Loading thumbnails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Failed to load thumbnails: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Recent Thumbnails
      </h3>
      <p className="text-sm text-muted-foreground">
        Download your recent thumbnails here
      </p>
      <Separator className="my-2 w-full" />

      {thumbnails.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No thumbnails found
        </p>
      ) : (
        <div className="flex p-2 h-fit max-w-full gap-2 overflow-x-auto">
          {thumbnails.map((thumbnail, index) => (
            <div 
              key={index} 
              className="flex min-w-fit flex-col gap-1 p-2 border rounded-lg"
            >
              <Image
                src={thumbnail.url}
                alt={`Thumbnail ${index + 1}`}
                width={300}
                height={200}
                className="h-56 w-auto rounded-lg object-contain"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = '/placeholder-image.png'; // Fallback image
                }}
              />
              <p className="text-sm">
                Created on {thumbnail.createdAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <a href={thumbnail.url} download>
                <Button variant="outline" className="w-full">
                  Download
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}