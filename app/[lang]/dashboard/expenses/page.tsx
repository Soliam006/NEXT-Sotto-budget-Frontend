"use client";
import { getDictionary } from "@/lib/dictionary"
import { DashboardExpenses } from "@/components/dashboard/expenses/dashboard-expenses"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading-view";

export default function ExpensesPage() {
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

  return <DashboardExpenses dict={dictionary} lang={params?.lang as string} />
}

