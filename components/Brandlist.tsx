"use client";

import { getAllBrands } from "@/lib/general.action";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Brand = {
    id: string;
    name: string;
    createdAt?: any;
};

export default function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getAllBrands();
                setBrands(data);
            } catch (error) {
                console.error("Failed to fetch brands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Available Brands</h2>

            {loading ? (
                <div className="text-gray-500">Loading brands...</div>
            ) : brands.length === 0 ? (
                <div className="text-gray-500">No brands found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((brand) => (
                        <Link
                            href={`/dashboard/${brand.id}`}
                            key={brand.id}
                            className="p-4 rounded-lg bg-white shadow hover:shadow-md transition border cursor-pointer"
                        >
                            <h3 className="text-lg font-medium">{brand.name}</h3>
                            <p className="text-sm text-gray-500">ID: {brand.id}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
