'use client';

import { useThreads, useCreateThread, useDeleteThread } from "@liveblocks/react/suspense";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useEffect, useState } from "react";
import { MessageCircle, Trash2, Clock } from "lucide-react";

interface Props {
  currentTimestamp: number;
  onSeekToTime?: (time: number) => void;
  videoDuration: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function CollaborativeApp({ currentTimestamp, onSeekToTime, videoDuration }: Props) {
  const { threads } = useThreads();
  const createThread = useCreateThread();
  const deleteThread = useDeleteThread();
  const [timestampFormatted, setTimestampFormatted] = useState("");

  useEffect(() => {
    setTimestampFormatted(formatTime(currentTimestamp));
  }, [currentTimestamp]);

  // Sort threads by timestamp
  const sortedThreads = [...threads].sort((a, b) => {
    const timestampA = a.metadata?.timestamp || 0;
    const timestampB = b.metadata?.timestamp || 0;
    return timestampA - timestampB;
  });

  const handleDeleteThread = async (threadId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteThread(threadId);
    }
  };

  const getTimestampBubbles = () => {
    return threads.map((thread) => {
      const timestamp = thread.metadata?.timestamp;
      if (typeof timestamp !== "number") return null;
      
      const position = (timestamp / videoDuration) * 100;
      
      return {
        id: thread.id,
        timestamp,
        position,
        commentCount: thread.comments.length
      };
    }).filter(Boolean);
  };

  return (
    <div className="flex flex-col gap-4 h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {threads.length}
        </span>
      </div>

      {/* Current timestamp indicator */}
      <div className="px-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Current: <strong>{timestampFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Comments Timeline */}
      <div className="flex-1 overflow-y-auto px-4">
        {sortedThreads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add a comment at the current timestamp
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedThreads.map((thread) => {
              const timestamp = thread.metadata?.timestamp;
              const timestampDisplay =
                typeof timestamp === "number" ? formatTime(timestamp) : null;
              const createdAt = thread.createdAt;

              return (
                <div
                  key={thread.id}
                  className="group rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Comment Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      {timestampDisplay && (
                        <button
                          onClick={() => onSeekToTime?.(timestamp)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                          title="Jump to this timestamp"
                        >
                          <Clock className="w-3 h-3" />
                          {timestampDisplay}
                        </button>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteThread(thread.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thread Content */}
                  <div className="p-3">
                    <Thread 
                      thread={thread} 
                      className="liveblocks-thread"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="mb-3">
          <Composer
            metadata={{ 
              timestamp: currentTimestamp,
              createdAt: new Date().toISOString()
            }}
            className="liveblocks-composer rounded-lg border border-gray-300 bg-white"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Comment will be added at <strong>{timestampFormatted}</strong>
          </span>
          <span className="text-gray-400">
            Press Enter to send
          </span>
        </div>
      </div>
    </div>
  );
}