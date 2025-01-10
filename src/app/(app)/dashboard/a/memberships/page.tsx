"use client"

import { ArrowUpDown, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2 } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { DataTable } from '@/components/data-table';
import axiosInstance from '@/helpers/axiosInstance';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import useSWR from 'swr';
import Loader from '@/components/Loader';
import { Popover } from '@/components/ui/popover';
import { MonthlyMembershipEdits } from '@/components/a/MonthlyMembershipEdits';
import { toast } from '@/hooks/use-toast';
import { MembershipEdits } from '@/components/a/MembershipEdits';
import { NewMembershipEdits } from '@/components/a/NewMembership';
import { fetcherForGet } from '@/helpers';

async function deleteMembership(membershipId: string) {

    try {

        const response = await axiosInstance.delete(`a/membership/${membershipId}`);

        // console.log("response :", response);

        if (response?.data.success) {
            toast({
                title: "Membership Deleted",
                description: response?.data.message
            });
        }
    } catch (error: any) {

        // console.log("error :", error);

        toast({
            title: "Failed to delete membership",
            description: error.message,
        });
    }

}

export const columns: ColumnDef<any>[] = [
    {
        id: "Sr No",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "Membership Name",
        accessorKey: "membershipName",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Membership
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {

        accessorKey: "membershipDescription",
        id: "Membership Description",
        header: "Description",

    },
    {
        accessorKey: "membershipPerks",
        id: "Perks",
        header: "Perks",
        cell: ({ row }) => {
            const perks = row.original.membershipPerks;
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <span className='cursor-pointer underline' >
                            {perks[0]}
                            {perks.length > 1 && ` (+${perks.length - 1} more)`}
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className='max-w-sm max-h-sm overflow-auto p-2 bg-white bottom-1 shadow-sm shadow-accent'>
                        {perks.map((perk: any, index: number) => (
                            <div key={index} className='py-2 border-b-2 border-gray-400'>
                                {perk}
                            </div>
                        ))}
                    </HoverCardContent>
                </HoverCard>
            );
        },
    },
    {
        accessorKey: "plans",
        id: "plans",
        header: "Plans",

        cell: ({ row }) => {
            const plans = row.original.plans;
            return (
                <HoverCard>
                    <HoverCardTrigger>
                        <span className='cursor-pointer underline' >
                            {plans[0].name} ({plans[0].duration} months)
                            {plans.length > 1 && ` (+${plans.length - 1} more)`}
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className='max-w-sm max-h-sm overflow-auto p-2 bg-white bottom-1 shadow-sm shadow-black'>
                        {plans.map((plan: any) => (
                            <div key={plan._id} className='mb-2 leading-normal '>
                                <div className='flex justify-between items-center gap-1'>
                                    <div>

                                        <strong>{plan.name}</strong> - {plan.duration} months
                                    </div>
                                    <div>
                                        <MonthlyMembershipEdits plan={plan} />
                                    </div>
                                </div>
                                <div>
                                    Price: ₹{plan.price.toLocaleString()}
                                </div>
                                <div style={{ color: "green", fontWeight: "bold" }}>
                                    Offer: ₹{plan.currentOffer.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </HoverCardContent>
                </HoverCard>
            );
        },

    },
    {
        id: "Active",
        header: "Active",
        cell: ({ row }) => {
            const isActive = row.original.membershipIsAvailable; // Assuming 'isActive' is the property name
            return (
                <span
                    style={{
                        color: isActive ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {isActive ? "Active" : "Not Active"}
                </span>
            );
        },
        enableSorting: true, // Enable sorting by status if needed
        enableHiding: false, // Prevent hiding the status column
    },
    {
        id: "actions",
        // header: "Actions",
        cell: ({ row }) => {
            const membership = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(membership._id)
                            }
                        >
                            Copy membership ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },

    {
        id: "edit",
        cell: ({ row }) => {
            const membership = row.original;

            return (
                <>
                    <MembershipEdits plan={membership} />
                </>
            );
        },
    },

    {
        id: "delete",
        cell: ({ row }) => {
            const membership = row.original;

            return (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className='text-red-500 hover:text-red-700'>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Do you really want to delete this membership?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMembership(membership._id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },

];



export default function MembershipPage() {

    const [currentPage, setCurrentPage] = useState(1);

    const { data, error, isLoading } = useSWR("membership", fetcherForGet, {
        revalidateOnFocus: false,
    });


    return (
        <div className="container mx-auto py-12">

            <div className="p-1 w-80 sm:w-full overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="max-w-screen-sm text-center h-80 flex justify-center items-center">
                        <Loader />
                    </div>
                ) : error! ? (
                    <div className="text-red-500 font-medium text-center">
                        Error loading data!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <h2 className="text-xl font-bold mb-4">User Membership Data</h2>
                        <NewMembershipEdits />
                        <DataTable columns={columns} data={data.data} filterColumn={"Membership Name"} props={
                            {
                                currentPage,
                                setCurrentPage
                            }
                        } />
                    </div>
                )}
            </div>
        </div>
    )
}
