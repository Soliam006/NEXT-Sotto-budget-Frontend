"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {InventoryPDFTemplate} from "@/components/pdf/inventory/inventory-pdf";

import { PDFDownloadLink } from '@react-pdf/renderer';
import {useMemo} from "react";

interface DownloadLinkPdfProps {
    inventory: any
    selectedProject: any
    dict: any
}

export default function DownloadInventoryLink({ inventory, selectedProject, dict }: DownloadLinkPdfProps) {

    const pdfDoc = useMemo(() => (
        <InventoryPDFTemplate
            inventory={inventory}
            projectName={selectedProject?.title}
            dict={dict}
        />
    ), [inventory, selectedProject?.title, dict]);

    return (
        <div>
            <PDFDownloadLink
                key={selectedProject?.id || "default"} // O usa un hash del contenido si no hay ID
                document={pdfDoc}
                fileName={`inventory-${selectedProject?.title || "project"}.pdf`}
                className="w-full sm:w-auto"
            >

            {({ loading }) => (
                    <Button
                        variant="outline"
                        className="bg-muted/50 border-border text-muted-foreground py-4"
                        disabled={!selectedProject || loading}
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
        </div>
    )
}