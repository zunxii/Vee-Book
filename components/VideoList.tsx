"use client";

import { getVideosByBrand } from "@/lib/general.action";
import Link from "next/link";
import { useEffect, useState } from "react";


type Props = {
  brandId: string;
};

type Video = {
  id: string;
  name: string;
  videoUrl: string;
  roomId: string;
};

export default function VideoList({ brandId }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideosByBrand(brandId);
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [brandId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Videos for this Brand</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-sm text-gray-500">No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/dashboard/${brandId}/${video.id}`}
              className="block p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <h4 className="text-md font-medium mb-1">{video.name}</h4>
              <p className="text-sm text-gray-500 break-all">
                Room ID: {video.roomId}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
