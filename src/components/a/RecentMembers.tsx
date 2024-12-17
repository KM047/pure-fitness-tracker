import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axiosInstance from "@/helpers/axiosInstance";
import { formatDate, getStatusClass } from "@/helpers";



export function RecentMembers() {

    // fetching the recent members form the database

    const [members, setMembers] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await axiosInstance.get("a/membership");

            if (response.data.data.membership[0].paginatedData.length === 0) {
                setMembers([]);
            }

            if (response) {
                setMembers(response.data.data.membership[0].paginatedData);
            }
        }

        fetchMembers();

    }, [])




    useEffect(() => {
        const totalFee = members.reduce((sum: number, mem: any) => sum + Number(mem.feePaid), 0);
        setTotal(totalFee);
    }, [members])







    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Fees Paid</TableHead>
                    <TableHead className="text-right">Fees Remain</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {members.map((member: any) => (
                    <TableRow key={member._id}>
                        <TableCell className="font-medium">
                            {member.userInfo.name}
                        </TableCell>
                        <TableCell>{member.userInfo.email}</TableCell>
                        <TableCell className={` font-medium ${member.feeStatus == "PAID" ? "text-green-400" : member.feeStatus == "HALF" ? "text-orange-500" : "text-red-400"}`}>{member.feeStatus}</TableCell>
                        <TableCell>{formatDate(member.membershipStartDate)}</TableCell>
                        <TableCell>{member.feePaid}</TableCell>
                        <TableCell className="text-right">
                            {Number(member.actualFee - member.feePaid)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">${total}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
