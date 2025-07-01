"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function CreateBrandForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "brands"), {
        name: name.trim(),
        createdAt: Timestamp.now(),
      });

      alert("✅ Brand created!");
      setName("");
    } catch (error) {
      console.error("Error creating brand:", error);
      alert("❌ Failed to create brand");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Create a Brand</h2>
      <input
        type="text"
        placeholder="Brand name"
        className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Brand"}
      </button>
    </div>
  );
}
