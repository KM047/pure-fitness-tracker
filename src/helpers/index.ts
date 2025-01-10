import axiosInstance from "./axiosInstance";

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

export const fetcherForGet = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

export const fetcherForPost = (url: string, data: any) =>
    axiosInstance.post(url, data).then((res) => res.data);
