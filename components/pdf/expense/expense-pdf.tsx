"use client";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import {Project} from "@/lib/types/project.types";
import {formatDate} from "@/lib/helpers/projects";

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
        fontSize: 18,
        fontWeight: "bold",
        color: "#0ea5e9",
        marginBottom: 3,
    },
    subtitle: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 4,
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
    budgetSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        padding: 10,
        borderRadius: 4,
    },
    budgetTotal: {
        backgroundColor: "#f0f9ff",
        padding: 10,
        borderRadius: 4,
        width: "30%",
    },
    budgetSpent: {
        backgroundColor: "#fef2f2",
        padding: 10,
        borderRadius: 4,
        width: "30%",
    },
    budgetRemaining: {
        backgroundColor: "#f0fdf4",
        padding: 10,
        borderRadius: 4,
        width: "30%",
    },
    budgetLabel: {
        fontSize: 9,
        color: "#64748b",
        marginBottom: 2,
    },
    budgetValue: {
        fontSize: 12,
        fontWeight: "bold",
    },
    budgetTotalValue: {
        color: "#0369a1",
    },
    budgetSpentValue: {
        color: "#dc2626",
    },
    budgetRemainingValue: {
        color: "#16a34a",
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
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    colDate: {
        width: "15%",
        fontSize: 10,
    },
    colDescription: {
        width: "35%",
        fontSize: 10,
    },
    colCategory: {
        width: "20%",
        fontSize: 10,
    },
    colAmount: {
        width: "15%",
        fontSize: 10,
        textAlign: "right",
    },
    colStatus: {
        width: "15%",
        fontSize: 10,
        textAlign: "center",
    },
    statusBadge: {
        padding: "3 6",
        borderRadius: 10,
        fontSize: 8,
        fontWeight: "bold",
    },
    statusApproved: {
        backgroundColor: "#dcfce7",
        color: "#16a34a",
    },
    statusPending: {
        backgroundColor: "#fef3c7",
        color: "#d97706",
    },
    statusRejected: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
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
    chartSection: {
        marginBottom: 15,
    },
    chartTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#0f172a",
    },
    chartContainer: {
        height: 80,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingHorizontal: 4,
    },
    chartBar: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginHorizontal: 2,
    },
    chartBarInner: {
        width: 8,
    },
    chartBarValue: {
        fontSize: 7,
        marginBottom: 2,
        color: "#64748b",
        textAlign: "center",
    },
    chartLegend: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
        marginBottom: 5,
    },
    legendColor: {
        width: 8,
        height: 8,
        marginRight: 4,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 8,
        color: "#64748b",
    },
    summarySection: {
        marginBottom: 15,
    },
    summaryTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#0f172a",
    },
    summaryTable: {
        width: "100%",
    },
    summaryRow: {
        flexDirection: "row",
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    summaryCategory: {
        width: "70%",
        fontSize: 10,
    },
    summaryAmount: {
        width: "30%",
        fontSize: 10,
        textAlign: "right",
        fontWeight: "bold",
    },
    summaryTotal: {
        flexDirection: "row",
        paddingVertical: 6,
        borderTopWidth: 2,
        borderTopColor: "#0ea5e9",
        marginTop: 2,
    },
    summaryTotalLabel: {
        width: "70%",
        fontSize: 10,
        fontWeight: "bold",
    },
    summaryTotalAmount: {
        width: "30%",
        fontSize: 10,
        textAlign: "right",
        fontWeight: "bold",
        color: "#0ea5e9",
    },
})

interface ExpensesPDFTemplateProps {
    selectedProject: Project
    dict: any
}

export function ExpensesPDFTemplate({ selectedProject, dict }: ExpensesPDFTemplateProps) {

    // Calcular el presupuesto restante
    const remainingBudget = selectedProject?.limit_budget - selectedProject?.currentSpent

    // Obtener el porcentaje de presupuesto utilizado
    const budgetPercentage = Math.round((selectedProject?.currentSpent / selectedProject?.limit_budget ) * 100)

    // Ordenar gastos por fecha (más recientes primero)
    const sortedExpenses = [...selectedProject?.expenses ].sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime())

    // Colores para las categorías
    const categoryColors: Record<string, string> = {
        Products: "#3b82f6",
        Materials: "#10b981",
        Labour: "#f59e0b",
        Transport: "#ef4444",
        Services: "#06b6d4",
        Others: "#6b7280",
    }

    // Obtener el color para una categoría
    const getCategoryColor = (category: string) => {
        return categoryColors[category] || "#6b7280"
    }
    // Obtener el texto para una categoría
    const getCategoryText = (category: string) => {
        switch (category) {
            case "Products":
                return dict.expenses?.categories?.products || "Products"
            case "Materials":
                return dict.expenses?.categories?.materials || "Materials"
            case "Labour":
                return dict.expenses?.categories?.labour || "Labour"
            case "Transport":
                return dict.expenses?.categories?.transport || "Transport"
            case "Services":
                return dict.expenses?.categories?.services || "Services"
            case "Others":
                return dict.expenses?.categories?.others || "Others"
            default:
                return category
        }
    }

    // Obtener el estilo para un estado
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Approved":
                return [styles.statusBadge, styles.statusApproved]
            case "Pending":
                return [styles.statusBadge, styles.statusPending]
            case "Rejected":
                return [styles.statusBadge, styles.statusRejected]
            default:
                return [styles.statusBadge, styles.statusPending]
        }
    }

    // Obtener el texto para un estado
    const getStatusText = (status: string) => {
        switch (status) {
            case "Approved":
                return dict.expenses?.approved || "Approved"
            case "Pending":
                return dict.expenses?.pending || "Pending"
            case "Rejected":
                return dict.expenses?.rejected || "Rejected"
            default:
                return status
        }
    }

    // Preparar datos para el gráfico de barras
    const chartData = Object.entries(selectedProject?.expenseCategories || {})
        .map(([category, amount]) => ({
            category,
            amount,
            color: getCategoryColor(category),
        }))
        .sort((a, b) => b.amount - a.amount)

    // Encontrar el valor máximo para escalar el gráfico
    const maxAmount = Math.max(...chartData.map((item) => item.amount))

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title} wrap={false}>
                        {dict.expenses?.expenseReport || "Expense Report"}
                    </Text>
                    <Text style={styles.subtitle} wrap={false}>
                        {selectedProject?.title || "Project Title"}
                    </Text>
                    <Text style={styles.subtitle} wrap={false}>
                        {dict.common?.generatedOn || "Generated on"}: {new Date().toLocaleDateString()}
                    </Text>
                </View>

                {/* Budget Summary */}
                <View style={styles.budgetSection} wrap={false}>
                    <View style={styles.budgetTotal}>
                        <Text style={styles.budgetLabel}>{dict.expenses?.totalBudget || "Total Budget"}</Text>
                        <Text style={[styles.budgetValue, styles.budgetTotalValue]}>€{selectedProject?.limit_budget.toLocaleString()}</Text>
                    </View>
                    <View style={styles.budgetSpent}>
                        <Text style={styles.budgetLabel}>{dict.expenses?.totalSpent || "Total Spent"}</Text>
                        <Text style={[styles.budgetValue, styles.budgetSpentValue]}>
                            €{selectedProject?.currentSpent.toLocaleString()} ({budgetPercentage}%)
                        </Text>
                    </View>
                    <View style={styles.budgetRemaining}>
                        <Text style={styles.budgetLabel}>{dict.expenses?.remaining || "Remaining"}</Text>
                        <Text style={[styles.budgetValue, styles.budgetRemainingValue]}>€{remainingBudget.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Expense Categories Summary */}
                <View style={styles.summarySection} wrap={false}>
                    <Text style={styles.summaryTitle}>{dict.expenses?.expensesByCategory || "Expenses by Category"}</Text>
                    <View style={styles.summaryTable}>
                    {Object.entries(selectedProject?.expenseCategories ?? {}).map(([category, amount]) => (
                            <View key={category} style={styles.summaryRow}>
                                <Text style={styles.summaryCategory}>{getCategoryText(category)}</Text>
                                <Text style={styles.summaryAmount}>€{amount.toLocaleString()}</Text>
                            </View>
                        ))}
                        <View style={styles.summaryTotal}>
                            <Text style={styles.summaryTotalLabel}>{dict.expenses?.totalExpenses || "Total Expenses"}</Text>
                            <Text style={styles.summaryTotalAmount}>€{selectedProject?.currentSpent.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Bar Chart */}
                <View style={styles.chartSection} wrap={false}>
                    <Text style={styles.chartTitle}>{dict.expenses?.expenseBreakdown || "Expense Breakdown"}</Text>
                    <View style={styles.chartContainer}>
                        {chartData.map((item, index) => {
                            const barHeight = (item.amount / maxAmount) * 60 // ajustar altura
                            return (
                                <View key={index} style={styles.chartBar}>
                                    <Text style={styles.chartBarValue}>€{item.amount.toLocaleString()}</Text>
                                    <View style={[styles.chartBarInner, { height: barHeight, backgroundColor: item.color }]} />
                                    <Text style={{ fontSize: 6, marginTop: 2 }}>{item.category.substring(0, 8)}</Text>
                                </View>
                            )
                        })}
                    </View>
                    <View style={styles.chartLegend}>
                        {chartData.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                <Text style={styles.legendText}>{getCategoryText(item.category)}: €{item.amount.toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Expenses Table */}
                <View style={styles.categorySection} wrap={false}>
                    <Text style={styles.categoryHeader}>{dict.expenses?.recentExpenses || "Recent Expenses"}</Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDate}>{dict.expenses?.date || "Date"}</Text>
                        <Text style={styles.colDescription}>{dict.expenses?.description || "Description"}</Text>
                        <Text style={styles.colCategory}>{dict.expenses?.category || "Category"}</Text>
                        <Text style={styles.colAmount}>{dict.expenses?.amount || "Amount"}</Text>
                        <Text style={styles.colStatus}>{dict.expenses?.status || "Status"}</Text>
                    </View>

                    {/* Table Rows */}
                    {sortedExpenses.map((expense) => (
                        <View key={expense.id} style={styles.tableRow} wrap={false}>
                            <Text style={styles.colDate}>{formatDate(expense.expense_date)}</Text>
                            <Text style={styles.colDescription}>{expense.description}</Text>
                            <Text style={styles.colCategory}>{getCategoryText(expense.category)}</Text>
                            <Text style={styles.colAmount}>€{expense.amount.toLocaleString()}</Text>
                            <View style={styles.colStatus}>
                                <Text style={getStatusStyle(expense.status)}>{getStatusText(expense.status)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <Text style={styles.footer} wrap={false}>
                    {dict.common?.reportFooter || "This report was generated automatically"} - {selectedProject?.title}
                </Text>
            </Page>
        </Document>
    )
}
