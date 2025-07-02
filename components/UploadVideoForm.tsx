"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { addVideoToBrand } from "@/lib/general.action";

export default function UploadVideoForm({ brandId }: { brandId: string }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !videoName) return;

    try {
      setUploading(true);

      const fileId = uuid();
      const storageRef = ref(storage, `videos/${brandId}/${fileId}`);
      await uploadBytes(storageRef, videoFile);
      const videoUrl = await getDownloadURL(storageRef);

      const roomId = `${brandId}-${fileId}`; // unique room id
      await addVideoToBrand(brandId, {
        name: videoName,
        videoUrl,
        roomId,
      });

      setVideoFile(null);
      setVideoName("");
      router.refresh(); // reload to show new video
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Upload a New Video</h3>
      <input
        type="text"
        value={videoName}
        onChange={(e) => setVideoName(e.target.value)}
        placeholder="Enter video name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        className="w-full"
        required
      />
      <button
        type="submit"
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  );
}
