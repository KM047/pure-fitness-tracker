"use client";

import { NewDietsEdits } from "@/components/a/NewDietsEdits";
import { dietPlanColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Loader from "@/components/Loader"
import { fetcherForGet } from "@/helpers"
import { useEffect, useState } from "react";
import useSWR from "swr"


export default function Diet() {


    const [currentPage, setCurrentPage] = useState(1)


    const { data, error, isLoading } = useSWR(
        "a/diet",
        fetcherForGet,
        { revalidateOnFocus: false }
    )


    return <>
        <div className="container mx-auto py-12">

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
                        <h2 className="text-xl font-bold mb-4">Diet Template </h2>
                        <NewDietsEdits />
                        <DataTable columns={dietPlanColumns} data={data.data} filterColumn={"Template Name"} props={
                            {
                                currentPage,
                                setCurrentPage
                            }
                        }
                        />
                    </div>
                )}
            </div>
        </div>
    </>

}