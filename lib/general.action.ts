import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  Timestamp,
  CollectionReference,
} from "firebase/firestore";


export const createBrand = async (name: string) => {
  const docRef = await addDoc(collection(db, "brands"), {
    name,
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id };
};

export const getAllBrands = async () => {
  const snapshot = await getDocs(collection(db, "brands"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ---------- Video Actions ----------

export type VideoInput = {
  name: string;
  videoUrl: string;
  roomId: string;
};

export const addVideoToBrand = async (
  brandId: string,
  video: VideoInput
) => {
  const videoRef = collection(
    db,
    `brands/${brandId}/videos`
  ) as CollectionReference;

  const docRef = await addDoc(videoRef, {
    ...video,
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id };
};

export const getVideosByBrand = async (brandId: string) => {
  const snapshot = await getDocs(
    collection(db, `brands/${brandId}/videos`)
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getVideoByRoomId = async (roomId: string) => {
  const brandsSnap = await getDocs(collection(db, "brands"));

  for (const brand of brandsSnap.docs) {
    const videosSnap = await getDocs(
      collection(db, `brands/${brand.id}/videos`)
    );

    for (const videoDoc of videosSnap.docs) {
      if (videoDoc.data().roomId === roomId) {
        return {
          brandId: brand.id,
          videoId: videoDoc.id,
          ...videoDoc.data(),
        };
      }
    }
  }

  return null;
};

