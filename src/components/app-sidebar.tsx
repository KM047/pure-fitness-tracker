import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { adminData, userData } from "@/helpers/constants";

// This is sample data.
// const data = {
//     versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
//     navMain: [
//         {
//             title: "Dashboard",
//             url: "#",
//             items: [
//                 {
//                     title: "Overview",
//                     url: "#",
//                 },
//                 {
//                     title: "Analytics",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Clients",
//             url: "#",
//             items: [
//                 {
//                     title: "Client List",
//                     url: "#",
//                 },
//                 {
//                     title: "Progress Tracking",
//                     url: "#",
//                     isActive: true,
//                 },
//                 {
//                     title: "Diet Plans",
//                     url: "#",
//                 },
//                 {
//                     title: "Workout Plans",
//                     url: "#",
//                 },
//                 {
//                     title: "Communication",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Schedules",
//             url: "#",
//             items: [
//                 {
//                     title: "Class Schedules",
//                     url: "#",
//                 },
//                 {
//                     title: "Personal Training",
//                     url: "#",
//                 },
//                 {
//                     title: "Attendance",
//                     url: "#",
//                 },
//             ],
//         },
//         {
//             title: "Settings",
//             url: "#",
//             items: [
//                 {
//                     title: "Account Settings",
//                     url: "#",
//                 },
//                 {
//                     title: "Billing",
//                     url: "#",
//                 },
//                 {
//                     title: "Notifications",
//                     url: "#",
//                 },
//                 {
//                     title: "Permissions",
//                     url: "#",
//                 },
//                 {
//                     title: "API Access",
//                     url: "#",
//                 },
//             ],
//         },
//     ],
// };

let data: any = userData;

export function AppSidebar({
    user,
    ...props
}: { user: string } & React.ComponentProps<typeof Sidebar>) {
    if (user === "admin") {
        data = user === "admin" ? adminData : data;
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <VersionSwitcher
                    versions={data?.versions}
                    defaultVersion={data?.versions[0]}
                />
                {user}
                <SearchForm />
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                {data?.navMain.map((item: any) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.items.map((item: any) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.isActive}
                                        >
                                            <a href={item.url}>{item.title}</a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
