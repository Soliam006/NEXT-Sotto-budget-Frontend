"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import {InventoryPDFTemplate} from "@/components/pdf/inventory/inventory-pdf";

import { PDFDownloadLink } from '@react-pdf/renderer';

interface DownloadLinkPdfProps {
    inventory: any
    selectedProject: any
    dict: any
}

export default function DownloadLinkPDF({ inventory, selectedProject, dict }: DownloadLinkPdfProps) {
    return (
        <div>
            <PDFDownloadLink
                document={
                    <InventoryPDFTemplate
                        inventory={inventory}
                        projectName={selectedProject?.title}
                        dict={dict}
                    />
                }
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
                              ? dict.inventory?.generatingPDF || "Generando PDF..."
                              : dict.inventory?.exportPDF || "Exportar PDF"}
                        </span>
                    </Button>
                )}
            </PDFDownloadLink>
        </div>
    )
}