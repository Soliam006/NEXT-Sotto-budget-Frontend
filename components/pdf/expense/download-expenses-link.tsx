"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

import {PDFDownloadLink} from '@react-pdf/renderer';
import {ExpensesPDFTemplate} from "@/components/pdf/expense/expense-pdf";
import {Project} from "@/lib/types/project.types";


interface DownloadExpenseLinkProps{
    selectedProject: Project
    dict: any
}

export default function DownloadExpensesLink({
    selectedProject,
    dict
}: DownloadExpenseLinkProps) {


    return (
        <PDFDownloadLink
            document={
                <ExpensesPDFTemplate
                    selectedProject={selectedProject}
                    dict={dict}
                />
            }
            fileName= {`expenses-${selectedProject ? selectedProject.title : 'project'}.pdf`}
            className="w-full sm:w-auto"
        >
            {({ loading }) => (
                <Button
                    variant="outline"
                    className="bg-muted/50 border-border text-muted-foreground py-4"
                    disabled= {loading}
                >
                    <FileDown className="h-4 w-4" />
                    <span>
                          {loading
                              ? dict.common?.generatingPDF || "Generando PDF..."
                              : dict.common?.exportPDF || "Exportar PDF"}
                    </span>
                </Button>
            )}
        </PDFDownloadLink>
    )
}