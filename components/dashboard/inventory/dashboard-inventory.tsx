"use client"

import {useState, useMemo} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Plus, FileDown, Edit, Trash2, CheckCircle, Clock, FileText } from "lucide-react"
import { useProject } from "@/contexts/project-context"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {InventoryItem} from "@/lib/types/inventory-item";
import {ProjectsSelector} from "@/components/projects/projects-selector";
import {AddInventoryItemDialog} from "@/components/dashboard/inventory/add-inventory-item-dialog";
import {EditInventoryItemDialog} from "@/components/dashboard/inventory/edit-inventory-item-dialog";
import {SaveChangesBar} from "@/components/bars/save-changes-bar";
import {useUser} from "@/contexts/UserProvider";

interface DashboardInventoryProps {
  dict: any
}

export function DashboardInventory({ dict }: DashboardInventoryProps) {
  const { selectedProject, updateInventoryItemStatus, deleteInventoryItem } = useProject()
  const {user:currentUser} = useUser()

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)

  // Inicializar el inventario si no existe
  const inventory = selectedProject?.inventory || []

  // Filtrar elementos según los criterios de búsqueda y filtros
  // Reemplaza el useEffect con un useMemo para calcular filteredItems
  const filteredItems:InventoryItem[] = useMemo(() => {
    let filtered = [...inventory]

    if (searchQuery) {
      // Filtrar por nombre o proveedor
      filtered = filtered.filter(
          (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    // Filtrar por categoría
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }
    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    return filtered
  }, [inventory, searchQuery, categoryFilter, statusFilter])

  // Calcular totales por estado
  const inBudgetItems = inventory.filter((item) => item.status === "In_Budget")
  const pendingItems = inventory.filter((item) => item.status === "Pending")
  const installedItems = inventory.filter((item) => item.status === "Installed")

  // Calcular costos totales
  const calculateTotalCost = (items: InventoryItem[]) => {
    return items.reduce((total, item) => total + item.total * item.unit_cost, 0)
  }

  const inBudgetCost = calculateTotalCost(inBudgetItems)
  const pendingCost = calculateTotalCost(pendingItems)
  const installedCost = calculateTotalCost(installedItems)
  const totalCost = calculateTotalCost(inventory)

  // Manejar cambio de estado
  const handleStatusChange = (item: InventoryItem, newStatus: InventoryItem["status"]) => {
    updateInventoryItemStatus(item.id, newStatus)
    /*toast({
      title: dict.inventory?.statusUpdated || "Status Updated",
      description: `${item.name} ${dict.inventory?.movedTo || "moved to"} ${newStatus}`,
    })*/
  }

  // Manejar eliminación
  const handleDelete = () => {
    if (currentItem) {
      deleteInventoryItem(currentItem.id)
      setShowDeleteDialog(false)
      setCurrentItem(null)
      /*toast({
        title: dict.inventory?.itemDeleted || "Item Deleted",
        description: `${currentItem.name} ${dict.inventory?.hasBeenDeleted || "has been deleted"}`,
      })*/
    }
  }

  function get_status_translate(status: string) {
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

  function getCategoryTraduction(category: string) {
    switch (category) {
      case "materials":
        return dict.inventory?.categories.materials || "Materials"
      case "labour":
        return dict.inventory?.categories.labour || "Labour"
      case "services":
        return dict.inventory?.categories.products || "Services"
      case "others":
        return dict.inventory?.categories.others || "Others"
      default:
        return category
    }
  }

  return (
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Tarjeta de resumen */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {dict.inventory?.title || "Inventory"}
              </CardTitle>
              <CardDescription>{dict.inventory?.summary || "Summary of all inventory items"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{dict.inventory?.inBudget || "In Budget"}</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                      {inBudgetItems.length}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">€{inBudgetCost.toLocaleString()}</div>
                  <Progress value={(inBudgetCost / totalCost) * 100} className="h-2 mt-2"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"/>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{dict.inventory?.pending || "Pending"}</h3>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                      {pendingItems.length}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">€{pendingCost.toLocaleString()}</div>
                  <Progress value={(pendingCost / totalCost) * 100} className="h-2 mt-2"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{dict.inventory?.installed || "Installed"}</h3>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      {installedItems.length}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">€{installedCost.toLocaleString()}</div>
                  <Progress value={(installedCost / totalCost) * 100} className="h-2 mt-2"
                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex-1">
          {/* Project selector */}
          <ProjectsSelector
              dict={dict}
          />
          </div>
        </div>

        {/* Barra de acciones - Versión corregida */}
        <div className="flex flex-col xl:flex-row gap-4 w-full items-stretch xl:items-center">
          {/* Contenedor del buscador - Ocupa espacio disponible */}
          <div className="relative w-full xl:flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder={dict.inventory?.searchItems || "Search items..."}
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Contenedor principal de controles - Se reorganiza en responsive */}
          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            {/* Contenedor de selects - Se alinea correctamente */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={dict.inventory?.category || "Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{dict.inventory?.allCategories || "All Categories"}</SelectItem>
                  <SelectItem value="Services">{dict.inventory?.services || "Services"}</SelectItem>
                  <SelectItem value="Materials">{dict.inventory?.materials || "Materials"}</SelectItem>
                  <SelectItem value="Products">{dict.inventory?.products || "Products"}</SelectItem>
                  <SelectItem value="Labour">{dict.inventory?.labor || "Labor"}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={dict.inventory?.status || "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{dict.inventory?.allStatuses || "All Statuses"}</SelectItem>
                  <SelectItem value="In_Budget">{dict.inventory?.inBudget || "In Budget"}</SelectItem>
                  <SelectItem value="Pending">{dict.inventory?.pending || "Pending"}</SelectItem>
                  <SelectItem value="Installed">{dict.inventory?.installed || "Installed"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contenedor de botones - Se mantiene a la derecha */}
            {(currentUser?.role === "admin") && (
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

                <Button
                    variant="default"
                    className="text-white gap-1 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500
                    hover:from-cyan-600 hover:to-blue-600 cursor-pointer"
                    onClick={() => setShowAddDialog(true)}
                    disabled={!selectedProject}
                >
                  <Plus className="h-4 w-4" />
                  <span>{dict.inventory?.addItem || "Add Item"}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de elementos de inventario */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{dict.inventory?.items || "Inventory Items"}</CardTitle>
            <CardDescription>
              {filteredItems.length} {dict.inventory?.itemsFound || "items found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[530px]">
              <div className="space-y-4 p-0 md:p-2">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="p-3 md:p-4 border rounded-lg bg-card md:shadow-md">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-lg">{item.name}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                      variant="outline"
                                      className={
                                        item.category === "Services"
                                            ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
                                            : item.category === "Materials"
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                                : item.category === "Products"
                                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                                    : "bg-orange-500/10 text-orange-500 border-orange-500/30"
                                      }
                                  >
                                    {getCategoryTraduction(item.category)}
                                  </Badge>
                                  <Badge
                                      variant="outline"
                                      className={
                                        item.status === "In_Budget"
                                            ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                            : item.status === "Pending"
                                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                                : "bg-green-500/10 text-green-500 border-green-500/30"
                                      }
                                  >
                                    {get_status_translate(item.status)}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">{dict.inventory?.quantity || "Quantity"}</p>
                                  <p className="font-medium">
                                    {item.total} {item.unit} ({item.used} {dict.inventory?.used || "used"})
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{dict.inventory?.unit_cost || "Unit Cost"}</p>
                                  <p className="font-medium">€{item.unit_cost.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{dict.inventory?.totalCost || "Total Cost"}</p>
                                  <p className="font-medium">€{(item.total * item.unit_cost).toLocaleString()}</p>
                                </div>
                              </div>

                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">{dict.inventory?.supplier || "Supplier"}</p>
                                <p className="font-medium">{item.supplier}</p>
                              </div>

                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-1">{dict.inventory?.progress || "Progress"}</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={(item.used / item.total) * 100} className="h-2 flex-1"
                                            indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"/>
                                  <span className="text-sm font-medium">{Math.round((item.used / item.total) * 100)}%</span>
                                </div>
                              </div>
                            </div>

                            {(currentUser?.role === "admin") && (
                              <div className="flex flex-col justify-end gap-2">
                                <div className="flex flex-row md:flex-col gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-4"
                                    onClick={() => {
                                      setCurrentItem(item)
                                      setShowEditDialog(true)
                                    }}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>{dict.common?.edit || "Edit"}</span>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                    onClick={() => {
                                      setCurrentItem(item)
                                      setShowDeleteDialog(true)
                                    }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>{dict.common?.delete || "Delete"}</span>
                                </Button>

                                </div>

                                <div className="flex flex-col gap-2">

                                {item.status !== "In_Budget" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
                                        onClick={() => handleStatusChange(item, "In_Budget")}
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span>{dict.inventory?.moveToInBudget || "Move to Budget"}</span>
                                    </Button>
                                )}

                                {item.status !== "Pending" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
                                        onClick={() => handleStatusChange(item, "Pending")}
                                    >
                                      <Clock className="h-4 w-4" />
                                      <span>{dict.inventory?.moveToPending || "Move to Pending"}</span>
                                    </Button>
                                )}

                                {item.status !== "Installed" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
                                        onClick={() => handleStatusChange(item, "Installed")}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>{dict.inventory?.moveToInstalled || "Move to Installed"}</span>
                                    </Button>
                                )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Package className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">
                        {dict.inventory?.noItemsFound || "No inventory items found"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {dict.inventory?.tryAdjustingFilters || "Try adjusting your filters or add a new item"}
                      </p>
                      {(currentUser?.role === "admin") && (
                        <Button
                            onClick={() => setShowAddDialog(true)}
                            disabled={!selectedProject}
                            className="gap-1 bg-gradient-to-r from-cyan-500 to-blue-500
                            hover:from-cyan-600 hover:to-blue-600 cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          <span>{dict.inventory?.addFirstItem || "Add your first item"}</span>
                        </Button>
                      )}
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Diálogos*/}
        <AddInventoryItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} dict={dict} />

        {currentItem && (
            <EditInventoryItemDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                item={currentItem}
                dict={dict}
            />
        )}
        {/* Save changes bar - only visible when there are changes */}
        <SaveChangesBar dict={dict}/>

        <ConfirmationDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onCancel={() => setShowDeleteDialog(false)}
            title={dict.inventory?.deleteItem || "Delete Item"}
            description={
                dict.inventory?.deleteItemConfirmation ||
                "Are you sure you want to delete this item? This action cannot be undone."
            }
            onConfirm={handleDelete}
            confirmText={dict.common?.delete || "Delete"}
            cancelText={dict.common?.cancel || "Cancel"}
        />
      </div>
  )
}
