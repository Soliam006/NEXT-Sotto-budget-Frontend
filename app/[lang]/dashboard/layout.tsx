"use client";
import type React from "react";
import { getDictionary } from "@/lib/dictionary";
import { DashboardShellWrapper } from "@/components/dashboard/dashboard-shell-wrapper";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";
import {ProjectProvider} from "@/contexts/project-context";
import {NotificationProvider} from "@/contexts/notification-context";

export default function DashboardLayout({
                                                  children,
    params
                                              }: {
    children: React.ReactNode,
    params: Promise<{ lang: string }>
}) {
    const paramers = useParams();
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        async function fetchDictionary() {
            if (paramers?.lang) {
                const dict = await getDictionary(paramers.lang as string);
                setDictionary(dict);
            }
        }
        fetchDictionary();
    }, [paramers?.lang]);

    if (!dictionary) return <LoadingView/>;

    return (
        <NotificationProvider dictionary={dictionary}>
            <ProjectProvider>
                <DashboardShellWrapper dictionary={dictionary} lang={paramers.lang as string}>
                    {children}
                </DashboardShellWrapper>
            </ProjectProvider>
        </NotificationProvider>
    );
}
