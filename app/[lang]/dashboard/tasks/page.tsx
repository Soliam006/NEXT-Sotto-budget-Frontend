"use client";
import { getDictionary } from "@/lib/dictionary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingView from "@/components/loading-view";
import {TaskBoard} from "@/components/dashboard/tasks/task-board";
import {ProjectsSelector} from "@/components/projects/projects-selector";

export default function TaskPage() {
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

    return (
        <div className="container mx-auto p-4 md:p-6 flex flex-col space-y-6">
            <ProjectsSelector dict= {dictionary} />
            <TaskBoard dict= {dictionary} lang={params.lang as string} />
        </div>
    )
}
