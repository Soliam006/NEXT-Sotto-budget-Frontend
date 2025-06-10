"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProject } from "@/contexts/project-context"
import { FileText, Download, Package, Receipt, Calendar, DollarSign, TrendingUp, BarChart3 } from "lucide-react"

import {Separator} from "@radix-ui/react-menu";
import dynamic from "next/dynamic";
import {useUser} from "@/contexts/UserProvider";

const DownLoadLinkPDF = dynamic(() =>
    import("@/components/pdf/inventory/download-inventory-link"), {
    ssr: false,
})
const DownloadExpensesLink = dynamic (() =>
    import("@/components/pdf/expense/download-expenses-link"), {
    ssr: false,
} )

interface DashboardExportReportsProps {
    dictionary: any
}

export function DashboardExportReports({ dictionary }: DashboardExportReportsProps) {

    const { selectedProject:currentProject } = useProject()
    const { user } = useUser()

    const inventory = currentProject?.inventory || []
    const expenses = currentProject?.expenses || []

    const inventoryStats = {
        totalItems: inventory.length,
        totalValue: inventory.reduce((sum, item) => sum + (item.total || 0) * (item.unit_cost || 0), 0),
        categories: [...new Set(inventory.map((item) => item.category))].length,
    }

    const expenseStats = {
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
        categories: [...new Set(expenses.map((expense) => expense.category))].length,
        budgetUsed: currentProject
            ? (expenses.reduce((sum, expense) => sum + expense.amount, 0) / currentProject.limit_budget) * 100
            : 0,
    }

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {dictionary.dashboard?.exportReports || "Export Reports"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {dictionary.dashboard?.exportReportsDescription ||
                                "Generate and download detailed PDF reports for your project data"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="h-8 w-8 text-cyan-500" />
                    </div>
                </div>

                {/* Project Info */}
                {currentProject && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-cyan-500" />
                                {dictionary.dashboard?.currentProject || "Current Project"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{currentProject.title}</h3>
                                    <p className="text-muted-foreground">{currentProject.description}</p>
                                </div>
                                <Badge variant="outline" className="text-cyan-600 border-cyan-200">
                                    {dictionary.dashboard?.active || "Active"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!currentProject && (
                    <Card>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">{dictionary.dashboard?.noProjectSelected || "No Project Selected"}</h3>
                                <p className="text-muted-foreground">
                                    {dictionary.dashboard?.selectProjectToExport || "Please select a project to export reports"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Inventory Export */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-500" />
                                {dictionary.inventory?.inventoryReport || "Inventory Report"}
                            </CardTitle>
                            <CardDescription>
                                {dictionary.dashboard?.inventoryReportDescription ||
                                    "Export a comprehensive inventory report with all items, categories, and costs"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{inventoryStats.totalItems}</div>
                                    <div className="text-sm text-muted-foreground">{dictionary.inventory?.totalItems || "Total Items"}</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">€{inventoryStats.totalValue.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">{dictionary.inventory?.totalValue || "Total Value"}</div>
                                </div>
                            </div>

                            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <div className="text-xl font-bold text-purple-600">{inventoryStats.categories}</div>
                                <div className="text-sm text-muted-foreground">{dictionary.inventory?.categories || "Categories"}</div>
                            </div>

                            <Separator />

                            {/* Export Features */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">{dictionary.dashboard?.reportIncludes || "Report Includes:"}</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• {dictionary.dashboard?.itemsByCategory || "Items organized by category"}</li>
                                    <li>• {dictionary.dashboard?.costBreakdown || "Detailed cost breakdown"}</li>
                                    <li>• {dictionary.dashboard?.statusTracking || "Status tracking (In Budget, Pending, Installed)"}</li>
                                    <li>• {dictionary.dashboard?.supplierInfo || "Supplier information"}</li>
                                </ul>
                            </div>

                            <DownLoadLinkPDF inventory={inventory} dict={dictionary} selectedProject={currentProject}/>

                        </CardContent>
                    </Card>

                    {/* Expenses Export */}
                    { user && user.role === "admin" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-green-500" />
                                    {dictionary.expenses?.expenseReport || "Expense Report"}
                                </CardTitle>
                                <CardDescription>
                                    {dictionary.dashboard?.expenseReportDescription ||
                                        "Export a detailed expense report with budget analysis and category breakdowns"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{expenseStats.totalExpenses}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {dictionary.expenses?.totalExpenses || "Total Expenses"}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">€{expenseStats.totalAmount.toLocaleString()}</div>
                                        <div className="text-sm text-muted-foreground">{dictionary.expenses?.amount || "Amount"}</div>
                                    </div>
                                </div>

                                <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                                    <div className="text-xl font-bold text-cyan-600">{expenseStats.budgetUsed.toFixed(1)}%</div>
                                    <div className="text-sm text-muted-foreground">{dictionary.expenses?.ofBudget || "of Budget"}</div>
                                </div>

                                <Separator />

                                {/* Export Features */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">{dictionary.dashboard?.reportIncludes || "Report Includes:"}</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• {dictionary.dashboard?.budgetOverview || "Budget overview and analysis"}</li>
                                        <li>• {dictionary.dashboard?.categoryCharts || "Visual charts by category"}</li>
                                        <li>• {dictionary.dashboard?.expensesByCategory || "Expenses grouped by category"}</li>
                                        <li>• {dictionary.dashboard?.recentExpenses || "Recent expenses list"}</li>
                                    </ul>
                                </div>

                                {currentProject && (
                                    <DownloadExpensesLink selectedProject={currentProject} dict={dictionary}/>
                                )}

                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        )
}
