"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import ThumbNailCreator from "./thumbNailCreator";
import History from "./History";
import { ShipWheel } from "lucide-react";

type Props = {};

export default function Homepage({}: Props) {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits");
        const data = await res.json();

        if (res.ok) {
          setCredits(data.credits);
        } else {
          console.error("Failed to fetch credits:", data.error);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div className="flex min-h-screen/2 items-start justify-center py-5 z-50 mx-3">
      {credits === null ? (
        <p>
          <ShipWheel className="h-10 w-10 animate-spin" />
        </p> 
      ) : credits <= 1 ? (
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Hello there
              </h1>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Want to create a thumbnail?
              </h1>
              <p className="leading-7 text-muted-foreground">
                Buy more credits to continue generating more thumbnails
              </p>
              <Link href="/pricing">
                <Button>Buy credits</Button>
              </Link>
            </div>
            <div className="max-w-4xl">
            <History />
          </div>
          </div>
      ) : (
          <ThumbNailCreator>
            <History/>
          </ThumbNailCreator> 
      )}
    </div>
  );
}
