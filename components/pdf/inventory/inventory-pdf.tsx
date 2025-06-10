"use client";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { InventoryItem } from "@/lib/types/inventory-item"

Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
})

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 30,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 15,
        paddingBottom: 5,
    },
    title: {
        fontSize: 18, // Reducido de 24
        fontWeight: "bold",
        color: "#0ea5e9",
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 12, // Reducido de 14
        color: "#64748b",
        marginBottom: 8,
    },
    projectInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        backgroundColor: "#f8fafc",
        padding: 10,
        borderRadius: 4,
    },
    infoItem: {
        flexDirection: "column",
    },
    infoLabel: {
        fontSize: 9,
        color: "#64748b",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#1e293b",
    },
    categorySection: {
        marginBottom: 15,
    },
    categoryHeader: {
        backgroundColor: "#0ea5e9",
        color: "white",
        padding: 8,
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 8,
    },
    table: {
        display: "flex",
        width: "100%",
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginTop: 8,
        marginBottom: 4,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: "#ffffff", // por defecto
    },
    tableRowEven: {
        backgroundColor: "#f9fafb", // gris muy claro
    },

    // Columnas
    colName: {
        width: "30%",
        fontSize: 10,
        color: "#0f172a",
    },
    provider: {
        width: "20%",
        fontSize: 10,
        color: "#475569",
    },
    colQuantity: {
        width: "15%",
        fontSize: 10,
        textAlign: "right",
        color: "#334155",
    },
    colUnitCost: {
        width: "15%",
        fontSize: 10,
        textAlign: "right",
        color: "#334155",
    },
    colTotalCost: {
        width: "20%",
        fontSize: 10,
        textAlign: "right",
        fontWeight: "bold",
        color: "#0f172a",
    },
    colStatus: {
        width: "20%",
        fontSize: 10,
        textAlign: "center",
    },

    statusBadge: {
        padding: "3 12",
        borderRadius: 10,
        fontSize: 8,
        fontWeight: "bold",
    },
    statusInBudget: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
    },
    statusPending: {
        backgroundColor: "#fef3c7",
        color: "#d97706",
    },
    statusInstalled: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: "center",
        color: "#64748b",
        fontSize: 8,
        paddingTop: 5,
    },
})

interface InventoryPDFTemplateProps {
    projectName: string | undefined
    inventory: InventoryItem[]
    dict: any
}

export function InventoryPDFTemplate({ projectName, inventory, dict }: InventoryPDFTemplateProps) {
    const groupedInventory = inventory.reduce(
        (acc, item) => {
            const category = item.category || "Services"
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(item)
            return acc
        },
        {} as Record<string, InventoryItem[]>,
    )

    const calculateTotalCost = (items: InventoryItem[]) => {
        return items.reduce((total, item) => total + (item.total || 0) * (item.unit_cost || 0), 0)
    }

    const totalItems = inventory.length
    const totalCost = calculateTotalCost(inventory)

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "In_Budget":
                return [styles.statusBadge, styles.statusInBudget]
            case "Pending":
                return [styles.statusBadge, styles.statusPending]
            case "Installed":
                return [styles.statusBadge, styles.statusInstalled]
            default:
                return [styles.statusBadge, styles.statusInBudget]
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "In_Budget":
                return dict.inventory?.inBudget || "In Budget"
            case "Pending":
                return dict.inventory?.pending || "Pending"
            case "Installed":
                return dict.inventory?.installed || "Installed"
            default:
                return status
        }
    }

    const getCategoryName = (category: string) => {
        switch (category) {
            case "Materials":
                return dict.inventory?.materials || "Materials"
            case "Services":
                return dict.inventory?.services || "Services"
            case "Products":
                return dict.inventory?.products || "Products"
            case "Labour":
                return dict.inventory?.labor || "Labor"
            default:
                return category
        }
    }

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title} wrap={false}>
                        {dict.inventory?.inventoryReport || "Inventory Report"}
                    </Text>
                    <Text style={styles.subtitle} wrap={false}>
                        {projectName || dict.inventory?.projectName || "Project Name"}
                    </Text>
                    <Text style={styles.subtitle} wrap={false}>
                        {dict.common?.generatedOn || "Generated on"}: {new Date().toLocaleDateString()}
                    </Text>
                </View>

                {/* Project Summary */}
                <View style={styles.projectInfo} wrap={false}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{dict.inventory?.totalItems || "Total Items"}</Text>
                        <Text style={styles.infoValue}>{totalItems}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>{dict.inventory?.totalCost || "Total Value"}</Text>
                        <Text style={styles.infoValue}>€{totalCost.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Encabezados de tabla */}
                <View style={styles.tableHeader}>
                    <Text style={styles.colName}>{dict.inventory?.item || "Item"}</Text>
                    <Text style={styles.provider}>{dict.inventory?.supplier || "Provider"}</Text>
                    <Text style={styles.colQuantity}>{dict.inventory?.quantity || "Quantity"}</Text>
                    <Text style={styles.colUnitCost}>{dict.inventory?.unit_cost || "Unit Cost"}</Text>
                    <Text style={styles.colTotalCost}>{dict.inventory?.totalCost || "Total Cost"}</Text>
                    <Text style={styles.colStatus}>{dict.inventory?.status || "Status"}</Text>
                </View>


                {/* Categories */}
                {Object.entries(groupedInventory).map(([category, items]) => (
                    <View key={category} style={styles.categorySection} wrap={false}>
                        <Text style={styles.categoryHeader} wrap={false}>
                            {getCategoryName(category)} ({items.length})
                        </Text>

                        {/* Tabla */}
                        <View style={styles.table}>
                            {/* Filas de tabla */}
                            {items.map((item, index) => (
                                <View
                                    key={item.id}
                                    style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}
                                    wrap={false}
                                >
                                    <Text style={styles.colName}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.provider}>
                                        {item.supplier || dict.inventory?.unknownSupplier || "Unknown Supplier"}
                                    </Text>
                                    <Text style={styles.colQuantity}>
                                        {item.total} {item.unit}
                                    </Text>
                                    <Text style={styles.colUnitCost}>
                                        €{(item.unit_cost || 0).toLocaleString()}
                                    </Text>
                                    <Text style={styles.colTotalCost}>
                                        €{((item.total || 0) * (item.unit_cost || 0)).toLocaleString()}
                                    </Text>
                                    <View style={styles.colStatus}>
                                        <Text style={getStatusStyle(item.status)}>
                                            {getStatusText(item.status)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Footer */}
                <Text style={styles.footer} wrap={false}>
                    {dict.common?.reportFooter || "This report was generated automatically"} - {projectName}
                </Text>
            </Page>
        </Document>
    )
}