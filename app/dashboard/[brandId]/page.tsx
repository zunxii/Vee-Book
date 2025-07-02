import { getDoc, doc } from "firebase/firestore";
import VideoList from "@/components/VideoList";
import { db } from "@/lib/firebase";
import UploadVideoForm from "@/components/UploadVideoForm";

export default async function BrandVideosPage({ params }: { params: { brandId: string } }) {
  const brandSnap = await getDoc(doc(db, "brands", params.brandId));
  const brandData = brandSnap.exists() ? brandSnap.data() : null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Videos under Brand: {brandData?.name || "Unknown"}
      </h1>

      <UploadVideoForm brandId={params.brandId} />
      <VideoList brandId={params.brandId} />
    </main>
  );
}
