"use client"

import { ArrowUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from '@/components/data-table';
import axiosInstance from '@/helpers/axiosInstance';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
                                <strong>{plan.name}</strong> - {plan.duration} months
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function MembershipPage() {

    const [data, setData] = useState([]);



    useEffect(() => {

        const getData = async () => {
            const response = await axiosInstance.get("membership");
            setData(response.data.data);
            console.log(response.data.data);
        }
        getData();

    }, [])


    return (
        <div className="container mx-auto py-12">
            <div className="p-4">
                <DataTable columns={columns} data={data} filterColumn={"Membership Name"} />
            </div>
        </div>
    )
}
