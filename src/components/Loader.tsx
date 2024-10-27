import React from "react";

export default function Loader() {
    return (
        <div>
            <svg
                viewBox="0 0 16 16"
                height="48"
                width="48"
                className="windows-loading-spinner"
            >
                <circle
                    r="7px"
                    cy="8px"
                    cx="8px"
                    className="stroke-blue-400 fill-none stroke-[2px] stroke-linecap-round origin-center transition-all duration-200 ease-in-out animate-loading-spinner"
                ></circle>
            </svg>
        </div>
    );
}
