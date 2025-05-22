import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProject } from "@/contexts/project-context"
import { Progress } from "@/components/ui/progress"

interface MaterialsTabProps {
  dict: any
}

export function InventoryTab({ dict }: MaterialsTabProps) {
  const { selectedProject } = useProject()

  // Usar el inventario en lugar de los materiales
  const inventoryItems = selectedProject?.inventory || []

  // Obtener color del estado del inventario
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Installed":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      case "Pending":
        return "bg-amber-500/20 text-amber-500 border-amber-500/50"
      case "in_budget":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  // Obtener etiqueta para el estado
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Installed":
        return dict.inventory?.installed || "Installed"
      case "Pending":
        return dict.inventory?.pending || "Pending"
      case "in_budget":
        return dict.inventory?.inBudget || "In Budget"
      default:
        return status
    }
  }

  // Obtener color de la categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Servicios":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50"
      case "Materiales":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
      case "Productos":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50"
      case "Mano de Obra":
        return "bg-orange-500/20 text-orange-500 border-orange-500/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  return (
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>{dict.inventory?.title || "Inventory"}</CardTitle>
            <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
              {inventoryItems.length} {dict.inventory?.items || "Items"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {inventoryItems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">{dict.inventory?.itemName || "Item"}</TableHead>
                      <TableHead>{dict.inventory?.category || "Category"}</TableHead>
                      <TableHead>{dict.inventory?.quantity || "Quantity"}</TableHead>
                      <TableHead>{dict.inventory?.unitCost || "Unit Cost"}</TableHead>
                      <TableHead>{dict.inventory?.totalCost || "Total Cost"}</TableHead>
                      <TableHead>{dict.inventory?.progress || "Progress"}</TableHead>
                      <TableHead>{dict.inventory?.status || "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item: any) => {
                      const progressPercentage = item.total > 0 ? Math.round((item.used / item.total) * 100) : 0

                      return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getCategoryColor(item.category)}>
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.total} {item.unit}
                            </TableCell>
                            <TableCell>${item.unitCost}</TableCell>
                            <TableCell>${item.total * item.unitCost}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={progressPercentage} className="h-2 w-24" />
                                <span className="text-xs">{progressPercentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {getStatusLabel(item.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
          ) : (
              <div className="text-center py-6 text-muted-foreground">
                {dict.inventory?.noResults || "No inventory items found for this project."}
              </div>
          )}
        </CardContent>
      </Card>
  )
}
