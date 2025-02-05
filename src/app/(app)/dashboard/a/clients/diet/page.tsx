"use client";
import { clientDietPlan } from '@/components/columns'
import { DataTable } from '@/components/data-table'
import Loader from '@/components/Loader'
import { fetcherForGet } from '@/helpers'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

function ClientsDiets() {

    const [userDietPlan, setUserDietPlan] = useState<any[]>([]);

    const { data, error, isLoading } = useSWR(`a/diet/u`, fetcherForGet, {
        revalidateOnFocus: true,
    });

    useEffect(() => {
        if (data && data.data) {
            setUserDietPlan(data.data || []);
        }
    }, [data]);
    return (
        <div className="container mx-auto py-12">

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
                        <DataTable columns={clientDietPlan} data={userDietPlan} filterColumn='name' />
                    </div>
                )}
            </div>

        </div>
    )
}

export default ClientsDiets