// components/ClientLayout.tsx
"use client";

import { UserProvider } from "@/contexts/UserProvider";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import LoadingView from "@/components/loading-view";
import {ProjectProvider} from "@/contexts/project-context";
import {NotificationProvider} from "@/contexts/notification-context";

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const [dictionary, setDictionary] = useState<any>(null);

    useEffect(() => {
        async function fetchDictionary() {
            if (params?.lang) {
                const dict = await getDictionary(params.lang as string);
                setDictionary(dict);
            }
        }
        fetchDictionary();
    }, [params?.lang]);

    if (!dictionary) return <LoadingView />;

    return (
        <UserProvider>
            <ProjectProvider dictionary= {dictionary}>
                <NotificationProvider dictionary={dictionary}>
                    {children}
                </NotificationProvider>
            </ProjectProvider>
        </UserProvider>
    );
}