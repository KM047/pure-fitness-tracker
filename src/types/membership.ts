import { IMembership } from "@/model/membership.model";

export type membershipTypes = {
    _id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    membershipName: string;
    membershipDescription: string;
    email: string;
};

interface UserInfo {
    _id: string;
    name: string;
    email: string;
}

export interface MembershipItem {
    _id: string;
    monthlyPlanId: string;
    membershipStatus: boolean;
    membershipValidity: number;
    membershipStartDate: string;
    membershipEndDate: string;
    actualFee: number;
    feeStatus: "NOT_PAID" | "HALF" | "FULL";
    feePaid: number;
    userInfo: UserInfo;
    isMembershipValid: boolean;
}

export interface MembershipResponse {
    totalMembers: number;
    feeNotPaidCount: number;
    feeHalfPaidCount: number;
    feeFullPaidCount: number;
    paginatedData: MembershipItem[];
    setMembership: (data: MembershipItem[]) => void;
    updateMembers: (data: MembershipItem[]) => void;
    fetchMembership: (userId: string) => void;
}

enum FeeStatus {
    NOT_PAID = "NOT_PAID",
    HALF = "HALF",
    FULL = "FULL",
}

export interface MembershipState {
    membershipData: {
        totalMembers: number;
        feeNotPaidCount: number;
        feeHalfPaidCount: number;
        feeFullPaidCount: number;
        paginatedData: MembershipItem[];
    } | null;
    loading: boolean;
    error: string | null;

    // Actions
    setMembershipData: (data: MembershipResponse) => void;
    updateMembershipStatus: (id: string, newStatus: boolean) => void;
    updateFeeStatus: (
        id: string,
        newFeeStatus: FeeStatus,
        amountPaid: number
    ) => void;
    fetchMemberships: (page?: number, limit?: number) => Promise<void>;
    reset: () => void;
}
