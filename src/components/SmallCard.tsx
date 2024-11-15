export function SmallCard(params: any) {
    return (
        <>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="tracking-tight text-sm font-medium">
                        params.title
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
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <path d="M2 10h20"></path>
                    </svg>
                    Logo
                </div>
                <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">params.value</div>
                    <p className="text-xs text-muted-foreground">
                        params.description
                    </p>
                </div>
            </div>
        </>
    );
}
