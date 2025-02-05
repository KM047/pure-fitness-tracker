"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

import { Checkbox } from "@/components/ui/checkbox";

import { deleteDiet } from "@/helpers/ApiCallHelper";
import { DietView } from "./a/DietView";
import EditDietPlanDialog from "./a/EditDietPlanDialog";
import UserDetailsCard from "./a/UserDetailsCard";
import AssignDietPlan from './a/AssigningDietToUser';

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export interface MembershipData {
    _id: string;
    membershipStatus: boolean;
    membershipValidity: number;
    membershipStartDate: string;
    membershipEndDate: string;
    actualFee: number;
    feeStatus: string;
    feePaid: number;
    userInfo: {
        _id: string;
        name: string;
        email: string;
    };
    isMembershipValid: boolean;
}

export const membersColumn: ColumnDef<MembershipData>[] = [
    {
        id: "Sr No",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "User name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.userInfo.name;
            return <div>{name}</div>;
        },
    },
    {
        accessorKey: "userInfo.email",
        id: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "membershipStatus",
        header: "Membership Status",
        cell: ({ row }) => {
            const status = row.getValue("membershipStatus");
            return (
                <div
                    className={`${status ? "text-green-500" : "text-red-500"
                        } font-semibold`}
                >
                    {status ? "Active" : "Inactive"}
                </div>
            );
        },
    },
    {
        accessorKey: "membershipStartDate",
        header: "Start Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("membershipStartDate")).toLocaleDateString();
            return <div>{date}</div>;
        },
    },
    {
        accessorKey: "membershipEndDate",
        header: "End Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("membershipEndDate")).toLocaleDateString();
            return <div>{date}</div>;
        },
    },
    {
        accessorKey: "actualFee",
        header: "Total Fee",
        cell: ({ row }) => {
            const fee = row.getValue("actualFee") as any;
            return <div>₹ {fee.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "feePaid",
        header: "Fee Paid",
        cell: ({ row }) => {
            const feePaid = row.getValue("feePaid") as any;
            return <div>₹ {feePaid.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "feeStatus",
        header: "Fee Status",
        cell: ({ row }) => {
            const status = row.getValue("feeStatus") as any;
            return <div className="font-semibold">{status}</div>;
        },
    },
    {
        id: "actions",
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
                            onClick={() => navigator.clipboard.writeText(membership._id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <UserDetailsCard userDets={membership.userInfo} />
                        <DropdownMenuSeparator />

                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    {
        accessorKey: "userDiet",
        header: "User Diet",
        cell: ({ row }) => {
            const userId = row.original.userInfo._id;
            return <div><AssignDietPlan userId={userId} /></div>;
        },

    }
];


export interface DietPlanData {
    _id: string;
    templateName: string;
    type: string;
    notes: string;
    meals: any;
}

export const dietPlanColumns: ColumnDef<DietPlanData>[] = [
    {
        id: "Sr No",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "templateName",
        id: "Template Name",
        header: "Diet Plan Name",
        cell: ({ row }) => {
            const name = row.original.templateName;
            return <div>{name}</div>;
        },
    },

    {
        accessorKey: "templateType",
        header: "Diet Plan Type",
        cell: ({ row }) => {

            const type = row.original.type;
            return <div>{type}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const dietPlan = row.original;

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

                        <DietView dietPlan={dietPlan} />
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },

    {
        id: "edit",
        header: "Edit Diet",
        cell: ({ row }) => {
            const dietPlan = row.original;

            return (
                <>
                    <EditDietPlanDialog diet={dietPlan} />
                </>
            );
        },
    },

    {
        id: "delete",
        cell: ({ row }) => {
            const dietId = row.original._id;

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
                            <AlertDialogAction onClick={() => deleteDiet(dietId)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
];


export const assignDietPlanToUserColumns: ColumnDef<any>[] = [
    {
        id: "Sr No",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "clientName",
        id: "Client Name",
        header: "Client Name",
        cell: ({ row }) => {
            const templateName = row.original.templateName;
            return <div>{templateName}</div>;
        },
    },
    {
        accessorKey: "clientDietPlan",
        id: "Diet plan",
        header: "Diet plan",
        cell: ({ row }) => {
            const name = row.original.templateName;
            return <div>{name}</div>;
        },
    },
    {
        id: "edit",
        header: "Edit Diet",
        cell: ({ row }) => {
            const dietPlan = row.original;

            return (
                <>
                    <EditDietPlanDialog diet={dietPlan} />
                </>
            );
        },
    },

    {
        id: "delete",
        cell: ({ row }) => {
            const dietId = row.original._id;

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
                            <AlertDialogAction onClick={() => deleteDiet(dietId)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
    },
]


export const clientDietPlan: ColumnDef<any>[] = [
    {
        id: "Sr No",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "User name",
        header: "Name",
        id: "name",
        cell: ({ row }) => {
            const name = row.original.name as string;
            return <div>{name}</div>;
        },
    },
    {
        accessorKey: "userDiet",
        header: "User Diet",
        cell: ({ row }) => {
            const status = row.getValue("membershipStatus");

            console.log("Row values :: ", row.original);

            const dietPlan = {
                meals: row.original.meals,
                type: row.original.type,
                templateName: row.original.planName,
                notes: row.original.notes
            };

            return (
                <DietView dietPlan={dietPlan} />
            );
        },
    },
]
