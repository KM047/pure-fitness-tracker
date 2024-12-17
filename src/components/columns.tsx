"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <>
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
                <span className="pl-3">Select all</span>
            </>
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

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
                                navigator.clipboard.writeText(payment.id)
                            }
                        >
                            Copy payment ID
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
        accessorKey: "userInfo.name",
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
                        <DropdownMenuItem>View Membership Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];