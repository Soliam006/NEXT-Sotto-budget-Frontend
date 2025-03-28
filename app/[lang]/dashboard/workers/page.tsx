"use client";
import { getDictionary } from "@/lib/dictionary"
import { DashboardWorkers } from "@/components/dashboard/dashboard-workers"
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import LoadingView from "@/components/loading-view";

export default function WorkersPage() {
  const params = useParams();
  console.log("PARAMS__________________________________________________________", params)
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


  return <DashboardWorkers dict={dictionary} lang={params.lang as string} />
}

