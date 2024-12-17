"use client";
import { ChartComponent } from "@/components/a/ChartComponent";
import { RecentMembers } from "@/components/a/RecentMembers";

export default function AdminPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 ">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="tracking-tight text-sm font-medium">
                            Subscriptions
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="tracking-tight text-sm font-medium">
                            Sales
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect
                                width="20"
                                height="14"
                                x="2"
                                y="5"
                                rx="2"
                            ></rect>
                            <path d="M2 10h20"></path>
                        </svg>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </div>
                </div>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-8">
                    <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
                        <ChartComponent />
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground shadow col-span-4">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <div className="font-semibold leading-none tracking-tight">
                                Recent Members
                            </div>
                            <div className="text-sm text-muted-foreground">
                                You made 265 sales this month.
                            </div>

                            <RecentMembers />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
