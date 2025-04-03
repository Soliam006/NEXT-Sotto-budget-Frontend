"use client"

import {useState} from "react"
import {DollarSign, Search, BarChart3, PieChartIcon, Download} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "@/components/ui/chat"
import {ProjectsSelector} from "@/components/dashboard/projects-selector"
import {useProject} from "@/contexts/project-context";

interface DashboardExpensesProps {
  dict: any
  lang: string
}

export function DashboardExpenses({dict, lang}: DashboardExpensesProps) {
  const {selectedProject} = useProject()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [hasChanges, setHasChanges] = useState(false)

  // Filter expenses based on search term and filters
  const filteredExpenses = selectedProject.expenses?.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.date.includes(searchTerm)

    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/20 text-success border-success/50"
      case "Pending":
        return "bg-warning/20 text-warning border-warning/50"
      case "Rejected":
        return "bg-destructive/20 text-destructive border-destructive/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Materials":
        return "#3b82f6" // blue
      case "Labor":
        return "#10b981" // green
      case "Equipment":
        return "#f59e0b" // amber
      case "Other":
        return "#6b7280" // gray
      default:
        return "#6b7280" // gray
    }
  }

  // Calculate total expenses
  const totalExpenses = selectedProject.expenses?.reduce((sum, expense) => sum + expense.amount, 0)

  // Prepare data for pie chart
  const pieChartData = Object.entries(selectedProject.expenseCategories || {}).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: getCategoryColor(category),
  }))

  // Prepare data for bar chart - monthly expenses
  const getMonthlyExpenses = () => {
    const monthlyData: { [key: string]: number } = {}; // se declara el tipo
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    selectedProject.expenses?.forEach((expense) => {
      const date = new Date(expense.date)
      const monthIndex = date.getMonth()
      const monthName = months[monthIndex]

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0
      }

      monthlyData[monthName] += expense.amount
    })

    return months.map((month) => ({
      name: month,
      amount: monthlyData[month] || 0,
    }))
  }

  const monthlyExpenses = getMonthlyExpenses()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{dict.expenses?.title || "Expense Management"}</h1>

      {/* Project selector */}
      <ProjectsSelector
        dict={dict}
      />

      {/* Expense Overview */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50 pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <DollarSign className="mr-2 h-5 w-5 text-primary"/>
              {dict.expenses?.expenseOverview || "Expense Overview"}
            </CardTitle>

            <div className="self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="bg-muted/50 border-border text-muted-foreground"
              >
                <Download className="h-4 w-4 mr-2"/>
                {dict.expenses?.exportReport || "Export Report"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {dict.expenses?.overview || "Overview"}
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {dict.expenses?.expenseList || "Expense List"}
              </TabsTrigger>
              <TabsTrigger
                value="charts"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {dict.expenses?.charts || "Charts"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-2">
                      <span className="text-muted-foreground text-sm">
                        {dict.expenses?.totalBudget || "Total Budget"}
                      </span>
                      <span className="text-2xl font-bold">${selectedProject.limitBudget.toLocaleString()}</span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{dict.expenses?.projectBudget || "Project Budget"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-muted/30 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-2">
                      <span className="text-muted-foreground text-sm">
                        {dict.expenses?.totalSpent || "Total Spent"}
                      </span>
                        <span className="text-2xl font-bold">${totalExpenses?.toLocaleString()}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>
                          {totalExpenses && (Math.round((totalExpenses / selectedProject.limitBudget) * 100))}%{" "}
                          {dict.expenses?.ofBudget || "of budget"}
                        </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30 border-border/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-2">
                        <span className="text-muted-foreground text-sm">{dict.expenses?.remaining || "Remaining"}</span>
                        <span className="text-2xl font-bold">
                        ${totalExpenses && ((selectedProject.limitBudget - totalExpenses).toLocaleString())}
                      </span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>
                          {totalExpenses && (Math.round(
                            ((selectedProject.limitBudget - totalExpenses) / selectedProject.limitBudget) * 100,
                          ))}
                          % {dict.expenses?.remaining || "remaining"}
                        </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <PieChartIcon className="h-4 w-4 mr-2 text-primary"/>
                      {dict.expenses?.expensesByCategory || "Expenses by Category"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-74 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            dataKey="value"
                            label={({name, percent}: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color}/>
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: string) => `$${value}`}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {pieChartData.map((entry: any, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{backgroundColor: entry.color}}></div>
                          <span className="text-sm">
                            {entry.name}: ${entry.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary"/>
                      {dict.expenses?.recentExpenses || "Recent Expenses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground">{dict.expenses?.date || "Date"}</TableHead>
                          <TableHead className="text-muted-foreground">
                            {dict.expenses?.category || "Category"}
                          </TableHead>
                          <TableHead className="text-muted-foreground">{dict.expenses?.amount || "Amount"}</TableHead>
                          <TableHead className="text-muted-foreground">{dict.expenses?.status || "Status"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedProject.expenses?.slice(0, 5).map((expense) => (
                          <TableRow key={expense.id} className="border-border">
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>${expense.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="list" className="p-6">
              <div className="space-y-4">
                {/* Sección de filtros y búsqueda */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="bg-muted/50 border-border pl-10"
                        placeholder={dict.expenses?.searchExpenses || "Search expenses..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[120px] bg-muted/50 border-border">
                        <SelectValue placeholder={dict.expenses?.category || "Category"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{dict.expenses?.allCategories || "All Categories"}</SelectItem>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[120px] bg-muted/50 border-border">
                        <SelectValue placeholder={dict.expenses?.status || "Status"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{dict.expenses?.allStatuses || "All Statuses"}</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {dict.expenses?.addExpense || "Add Expense"}
                    </Button>
                  </div>
                </div>

                {/* Contenedor de la tabla con scroll */}
                <div className="gap-2 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">{dict.expenses?.date || "Date"}</TableHead>
                        <TableHead className="text-muted-foreground">{dict.expenses?.category || "Category"}</TableHead>
                        <TableHead className="text-muted-foreground">
                          {dict.expenses?.description || "Description"}
                        </TableHead>
                        <TableHead className="text-muted-foreground">{dict.expenses?.amount || "Amount"}</TableHead>
                        <TableHead className="text-muted-foreground">{dict.expenses?.status || "Status"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses?.map((expense) => (
                        <TableRow key={expense.id} className="border-border">
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>${expense.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredExpenses?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            {dict.expenses?.noExpensesFound || "No expenses found matching your filters."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>


            <TabsContent value="charts" className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary"/>
                      {dict.expenses?.monthlyExpenses || "Monthly Expenses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyExpenses}>
                          <XAxis dataKey="name"/>
                          <YAxis/>
                          <Tooltip formatter={(value: string) => `$${value}`}/>
                          <Legend/>
                          <Bar dataKey="amount" name={dict.expenses?.amount || "Amount"} fill="#3b82f6"/>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <PieChartIcon className="h-4 w-4 mr-2 text-primary"/>
                      {dict.expenses?.expensesByCategory || "Expenses by Category"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            dataKey="value"
                            label={({
                                      name,
                                      value,
                                      percent
                                    }: any) => `${name}: $${value} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color}/>
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: string) => `$${value}`}/>
                          <Legend/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

