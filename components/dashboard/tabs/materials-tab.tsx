import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/components/dashboard/projects-selector"

interface MaterialsTabProps {
  dict: any
  selectedProject: Project
}

export function MaterialsTab({ dict, selectedProject }: MaterialsTabProps) {
  // Get material status color
  const getMaterialStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-success/20 text-success border-success/50"
      case "Partially Delivered":
        return "bg-info/20 text-info border-info/50"
      case "Ordered":
        return "bg-primary/20 text-primary border-primary/50"
      case "Pending":
        return "bg-warning/20 text-warning border-warning/50"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/50"
    }
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mt-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{dict.dashboard?.projectMaterials || "Project Materials"}</CardTitle>
          <Badge variant="outline" className="bg-muted/50 text-primary border-primary/50">
            {selectedProject.materials.length} {dict.dashboard?.items || "Items"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{dict.dashboard?.materialName || "Material"}</TableHead>
                <TableHead>{dict.dashboard?.quantity || "Quantity"}</TableHead>
                <TableHead>{dict.dashboard?.cost || "Cost"}</TableHead>
                <TableHead>{dict.dashboard?.status || "Status"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProject.materials.map((material: any) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    {material.quantity} {material.unit}
                  </TableCell>
                  <TableCell>${material.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getMaterialStatusColor(material.status)}>
                      {material.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

