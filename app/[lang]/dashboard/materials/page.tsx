"use client";
import { getDictionary } from "@/lib/dictionary"
import { DashboardMaterials } from "@/components/dashboard/dashboard-materials"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";

export default function MaterialsPage() {
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

  return <DashboardMaterials dict={dictionary} lang={params.lang as string} />
}

