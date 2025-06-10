"use client";
import { getDictionary } from "@/lib/dictionary"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";
import {DashboardExportReports} from "@/components/dashboard/export-reports-pdf/dashboard-export-reports";

export default function ExportReportsPage() {
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

    if (!dictionary) return <LoadingView/>;

    return <DashboardExportReports dictionary={dictionary} />
}
