import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export function MonthlyMembershipDataView({ data }: any) {

  // console.log("DietView plan", dietPlan);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Diet & Membership Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-2rem)] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* User Info Section */}
            <div>
              <h3 className="text-lg font-semibold">User Information</h3>
              <p className="text-gray-600">Name: {data.userInfo.name}</p>
              <p className="text-gray-600">Email: {data.userInfo.email}</p>
            </div>

            {/* Membership Section */}
            <div>
              <h3 className="text-lg font-semibold">Membership Details</h3>
              <p className="text-gray-600">Status: {data.membershipStatus ? "Active" : "Inactive"}</p>
              <p className="text-gray-600">Validity: {data.membershipValidity} months</p>
              <p className="text-gray-600">
                Start Date: {new Date(data.membershipStartDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                End Date: {new Date(data.membershipEndDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Fee Status: {data.feeStatus}</p>
              <p className="text-gray-600">Fee Paid: ₹{data.feePaid}</p>
              <p className="text-gray-600">Actual Fee: ₹{data.actualFee}</p>
            </div>


          </div>

          {/* Close Button */}
          <DialogClose>
            <Button variant="outline" className="mt-4 w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>;

    </>
  )
}

