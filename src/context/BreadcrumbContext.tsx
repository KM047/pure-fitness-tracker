"use client";
import React, { createContext, useState, useContext } from "react";

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type BreadcrumbContextType = {
    items: BreadcrumbItem[];
    setItems: (items: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
    undefined
);

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [items, setItems] = useState<BreadcrumbItem[]>([]);

    return (
        <BreadcrumbContext.Provider value={{ items, setItems }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error(
            "useBreadcrumb must be used within a BreadcrumbProvider"
        );
    }
    return context;
};
