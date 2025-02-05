const adminData = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard/a/",
            items: [
                {
                    title: "Overview",
                    url: "/dashboard/a/",
                },
                {
                    title: "Analytics",
                    url: "#",
                },
            ],
        },
        {
            title: "Clients",
            url: "#",
            items: [
                {
                    title: "Client List",
                    url: "/dashboard/a/clients",
                },
                {
                    title: "Progress Tracking",
                    url: "#",
                    isActive: true,
                },
                {
                    title: "Diet Plans Templates",
                    url: "/dashboard/a/diet",
                },
                {
                    title: "Workout Plans",
                    url: "#",
                },
                {
                    title: "Memberships",
                    url: "/dashboard/a/memberships",
                },
                {
                    title: "User Diet",
                    url: "/dashboard/a/clients/diet",
                },
            ],
        },
        {
            title: "Schedules",
            url: "#",
            items: [
                {
                    title: "Class Schedules",
                    url: "#",
                },
                {
                    title: "Personal Training",
                    url: "#",
                },
                {
                    title: "Attendance",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            items: [
                {
                    title: "Account Settings",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Notifications",
                    url: "#",
                },
                {
                    title: "Permissions",
                    url: "#",
                },
                {
                    title: "API Access",
                    url: "#",
                },
            ],
        },
    ],
};

const userData = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            items: [
                {
                    title: "Overview",
                    url: "#",
                },
                {
                    title: "My Goals",
                    url: "#",
                },
            ],
        },
        {
            title: "Workouts",
            url: "#",
            items: [
                {
                    title: "My Workout Plan",
                    url: "#",
                    isActive: true,
                },
                {
                    title: "Exercise Library",
                    url: "#",
                },
                {
                    title: "Progress Tracking",
                    url: "#",
                },
            ],
        },
        {
            title: "Nutrition",
            url: "#",
            items: [
                {
                    title: "My Diet Plan",
                    url: "#",
                },
                {
                    title: "Calorie Tracking",
                    url: "#",
                },
                {
                    title: "Nutrition Tips",
                    url: "#",
                },
            ],
        },
        {
            title: "Schedule",
            url: "#",
            items: [
                {
                    title: "Class Schedule",
                    url: "#",
                },
                {
                    title: "Personal Training",
                    url: "#",
                },
                {
                    title: "Book a Session",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            items: [
                {
                    title: "Account Settings",
                    url: "#",
                },
                {
                    title: "Notifications",
                    url: "#",
                },
                {
                    title: "Billing & Payments",
                    url: "#",
                },
            ],
        },
    ],
};

export { adminData, userData };
