// responseUtils.ts
import { stat } from "fs";
import { NextResponse } from "next/server";

type ResponseType = {
    success?: boolean;
    message: string;
    status?: number;
    data?: any;
};

export const jsonResponse = ({
    success = true,
    message,
    status = 200,
    data = null,
}: ResponseType) => {
    return NextResponse.json(
        {
            success,
            message,
            data,
        },
        {
            status: status,
        }
    );
};

export const errorResponse = ({
    error,
    message = "An error occurred",
    status = 200,
}: {
    error?: unknown;
    message?: string;
    status?: number;
}) => {
    console.error("Error:", error);
    return jsonResponse({
        success: false,
        message,
        status: status,
    });
};
