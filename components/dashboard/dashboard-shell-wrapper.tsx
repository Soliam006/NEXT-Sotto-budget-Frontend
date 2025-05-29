"use client";
import React from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useUser } from "@/contexts/UserProvider";
import LoadingView from "@/components/loading-view";

export function DashboardShellWrapper({
                                          children,
                                          dictionary,
                                          lang,
                                      }: {
    children: React.ReactNode;
    dictionary: any;
    lang: string;
}) {
    return (
        <DashboardShell dictionary={dictionary} lang={lang}>
            {children}
        </DashboardShell>
    );
}
