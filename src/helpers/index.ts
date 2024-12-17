export function formatDate(isoDate: any) {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
}

export const getStatusClass = (status: any) => {
    switch (status) {
        case "PAID":
            return "green";
        case "HALF":
            return "orange";
        case "UNPAID":
            return "red";
        default:
            return "";
    }
};
