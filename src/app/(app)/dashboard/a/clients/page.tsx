"use client";

import { membersColumn } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Loader from "@/components/Loader";
import axiosInstance from "@/helpers/axiosInstance";
import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function DemoPage() {
    const [userDataNew, setUserDataNew] = useState<any[]>([]);

    const [totalMembers, setTotalMembers] = useState(0);

    const stats = [
        { label: "Total Subscribers", value: totalMembers },
        // { label: "Active Members", value: "980" },
        // { label: "Inactive Members", value: "270" },
    ];

    // Fetch data using SWR
    const { data, error, isLoading } = useSWR("a/membership", fetcher, {
        revalidateOnFocus: false,
    });

    // Update state when data changes
    useEffect(() => {
        if (data && data.data && data.data.membership) {
            setUserDataNew(data.data.membership[0].paginatedData || []);

            setTotalMembers(data.data.membership[0].totalMembers);
        }
    }, [data]);

    // Log for debugging
    if (error) {
     // console.log(`Error fetching data: ${error.message}`);
    }

 // console.log("Fetched userDataNew:", userDataNew);

    return (
        <div className="container mx-auto py-12">
            {/* Subscription Stats */}
            <div className="flex justify-center items-center bg-gray-100 p-4">
                <div className="w-full bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Subscription Stats
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-blue-100 p-2 rounded-lg shadow-md flex flex-col items-center"
                            >
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {stat.label}
                                </h3>
                                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="p-4 w-80 sm:w-full overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="max-w-screen-sm text-center h-80 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-red-500 font-medium text-center">
                        Error loading data!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <h2 className="text-xl font-bold mb-4">User Membership Data</h2>
                        <DataTable columns={membersColumn} data={userDataNew} />
                    </div>
                )}
            </div>
        </div>

    );
}
