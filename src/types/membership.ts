export type membershipTypes = {
    _id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    membershipName: string;
    membershipDescription: string;
    email: string;
};
