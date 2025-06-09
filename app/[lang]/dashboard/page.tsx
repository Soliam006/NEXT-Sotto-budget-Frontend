"use client";
import { getDictionary } from "@/lib/dictionary"
import { DashboardOverview } from "@/components/dashboard/panel/dashboard-overview"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";
import useAuthMiddleware from "@/lib/token-verification";

export default function DashboardPage() {
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

  return <DashboardOverview dict={dictionary} lang={params.lang as string} />

}