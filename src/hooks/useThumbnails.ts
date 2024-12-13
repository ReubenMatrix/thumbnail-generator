// hooks/useThumbnails.ts
'use client';

import { useState, useEffect } from 'react';

export type Thumbnail = {
  url: string;
  createdAt: Date;
};

export function useThumbnails() {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch('/api/thumbnails');
        if (!response.ok) {
          throw new Error('Failed to fetch thumbnails');
        }
        const data = await response.json();
        
   
        const processedThumbnails = data.map((item: Thumbnail) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));

        setThumbnails(processedThumbnails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnails();
  }, []);

  return { thumbnails, loading, error };
}