import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

interface UserInfo {
    _id: string;
    name: string;
    email: string;
}

interface MembershipData {
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

interface MembershipStore {
    membersData: {
        totalMembers: number;
        feeNotPaidCount: number;
        feeHalfPaidCount: number;
        feeFullPaidCount: number;
        paginatedData: MembershipData[];
    };
    loading: boolean;
    error: string | null;
    fetchMemberships: (page: number) => Promise<void>;
    setPaginatedData: (data: MembershipData[]) => void;
    updatePaginatedData: (updatedData: MembershipData[]) => void;
    resetPaginatedData: () => void;
}

export const useMembershipStore = create<MembershipStore>()(
    persist(
        immer((set) => ({
            membersData: {
                totalMembers: 0,
                feeNotPaidCount: 0,
                feeHalfPaidCount: 0,
                feeFullPaidCount: 0,
                paginatedData: [],
            },
            loading: false,
            error: null,
            async fetchMemberships(page: number) {
                set({ loading: true, error: null });
                try {
                    const response = await fetch(`/a/membership/p/${page}`);
                    if (!response.ok) throw new Error("Failed to fetch data");

                    const data = await response.json();
                    set({
                        membersData: data.data,
                        loading: false,
                    });
                } catch (error: any) {
                    set({ loading: false, error: error.message });
                }
            },

            setPaginatedData(data) {
                set((state) => {
                    state.membersData.paginatedData = data;
                });
            },

            updatePaginatedData(updatedData) {
                set((state) => {
                    state.membersData.paginatedData = updatedData;
                });
            },

            resetPaginatedData() {
                set((state) => {
                    state.membersData.paginatedData = [];
                });
            },
        })),
        {
            name: "membership-data",
        }
    )
);
