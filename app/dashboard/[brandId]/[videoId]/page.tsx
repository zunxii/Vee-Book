'use client';

import VideoPlayer from '@/components/VideoPlayer';
import { useRef, useState } from 'react';
import { CollaborativeApp } from '@/components/CollaborativeApp';
import { useThreads } from "@liveblocks/react/suspense";
import { Room } from '@/app/Room';

function VideoCommentsContent() {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const videoRef = useRef<{ seekTo: (time: number) => void }>(null);
  const { threads } = useThreads();

  const handleSeekToTime = (time: number) => {
    videoRef.current?.seekTo(time);
  };

  const getCommentBubbles = () => {
    return threads.map((thread) => {
      const timestamp = thread.metadata?.timestamp;
      if (typeof timestamp !== "number") return null;
      
      const position = videoDuration > 0 ? (timestamp / videoDuration) * 100 : 0;
      
      return {
        id: thread.id,
        timestamp,
        position,
        commentCount: thread.comments.length
      };
    }).filter(Boolean);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-50">
      {/* Video Section */}
      <div className="flex-1 p-6 flex items-center justify-center bg-gray-100">
        <VideoPlayer
          ref={videoRef}
          src="/video.mp4"
          onTimeUpdate={(time) => {
            setCurrentTimestamp(time);
            // Get duration from video element if not set
            const video = document.querySelector('video');
            if (video && video.duration && videoDuration === 0) {
              setVideoDuration(video.duration);
            }
          }}
          commentBubbles={getCommentBubbles()}
          onSeekToTime={handleSeekToTime}
        />
      </div>

      {/* Comments Sidebar */}
      <div className="w-full lg:w-96 border-l border-gray-200 h-full bg-white shadow-lg">
        <CollaborativeApp
          currentTimestamp={currentTimestamp}
          onSeekToTime={handleSeekToTime}
          videoDuration={videoDuration}
        />
      </div>
    </div>
  );
}

export default function ReviewRoomPage() {
  return (
    <Room>
      <VideoCommentsContent />
    </Room>
  );
}