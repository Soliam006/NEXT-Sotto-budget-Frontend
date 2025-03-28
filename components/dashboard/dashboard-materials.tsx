"use client"

import { Package, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Mock data for materials
const MATERIALS = [
  {
    id: 1,
    name: "Kitchen Cabinets",
    category: "Cabinetry",
    total: 3500,
    used: 3500,
    remaining: 0,
    unit: "set",
    unitCost: 3500,
    supplier: "Cabinet Pros",
    status: "Installed",
    project: "Kitchen Renovation",
  },
  {
    id: 2,
    name: "Granite Countertops",
    category: "Countertops",
    total: 2200,
    used: 0,
    remaining: 2200,
    unit: "sq ft",
    unitCost: 75,
    supplier: "Stone Masters",
    status: "Pending",
    project: "Kitchen Renovation",
  },
  {
    id: 3,
    name: "Sink and Fixtures",
    category: "Plumbing",
    total: 850,
    used: 850,
    remaining: 0,
    unit: "set",
    unitCost: 850,
    supplier: "Plumbing Supply Co",
    status: "Installed",
    project: "Kitchen Renovation",
  },
  {
    id: 4,
    name: "Stainless Steel Appliances",
    category: "Appliances",
    total: 4200,
    used: 0,
    remaining: 4200,
    unit: "set",
    unitCost: 4200,
    supplier: "Appliance Warehouse",
    status: "Ordered",
    project: "Kitchen Renovation",
  },
  {
    id: 5,
    name: "Hardwood Flooring",
    category: "Flooring",
    total: 1800,
    used: 1200,
    remaining: 600,
    unit: "sq ft",
    unitCost: 12,
    supplier: "Flooring Depot",
    status: "In Progress",
    project: "Kitchen Renovation",
  },
  {
    id: 6,
    name: "Bathroom Tiles",
    category: "Tiling",
    total: 950,
    used: 500,
    remaining: 450,
    unit: "sq ft",
    unitCost: 8,
    supplier: "Tile World",
    status: "In Progress",
    project: "Bathroom Remodel",
  },
  {
    id: 7,
    name: "Shower Enclosure",
    category: "Bathroom",
    total: 1200,
    used: 0,
    remaining: 1200,
    unit: "unit",
    unitCost: 1200,
    supplier: "Bath Fixtures Inc",
    status: "Pending",
    project: "Bathroom Remodel",
  },
  {
    id: 8,
    name: "Drywall",
    category: "Building Materials",
    total: 750,
    used: 750,
    remaining: 0,
    unit: "sheets",
    unitCost: 15,
    supplier: "Building Supply Co",
    status: "Installed",
    project: "Basement Finishing",
  },
]

interface DashboardMaterialsProps {
  dict: any
  lang: string
}

export function DashboardMaterials({ dict, lang }: DashboardMaterialsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter materials based on search term
  const filteredMaterials = MATERIALS.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{dict.materials?.title || "Materials Inventory"}</h1>

      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center text-base">
              <Package className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.materials?.inventory || "Inventory"}
            </CardTitle>
            <Badge variant="outline" className="bg-card text-cyan-400 border-cyan-500/50">
              {MATERIALS.length} {dict.materials?.items || "Items"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              className="bg-card border-border pl-10"
              placeholder={dict.materials?.searchMaterials || "Search materials..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} dict={dict} />
            ))}

            {filteredMaterials.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {dict.materials?.noResults || "No materials found matching your search."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MaterialCard({ material, dict }: { material: any; dict: any }) {
  const getStatusBadge = () => {
    switch (material.status) {
      case "Installed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            {dict.materials?.installed || "Installed"}
          </Badge>
        )
      case "In Progress":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            {dict.materials?.inProgress || "In Progress"}
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
            {dict.materials?.pending || "Pending"}
          </Badge>
        )
      case "Ordered":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            {dict.materials?.ordered || "Ordered"}
          </Badge>
        )
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">{material.status}</Badge>
    }
  }

  const percentage = material.total > 0 ? Math.round((material.used / material.total) * 100) : 0

  return (
    <div className="bg-card rounded-lg border border-border/50 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-foreground">{material.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-card border-border/80 text-foreground/80">
                  {material.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{material.project}</span>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.supplier || "Supplier"}:</span>
                <span className="text-foreground/80">{material.supplier}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.unitCost || "Unit Cost"}:</span>
                <span className="text-foreground/80">
                  ${material.unitCost}/{material.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.totalCost || "Total Cost"}:</span>
                <span className="text-foreground/80">${material.total}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.used || "Used"}:</span>
                <span className="text-foreground/80">${material.used}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.remaining || "Remaining"}:</span>
                <span className="text-foreground/80">${material.remaining}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{dict.materials?.usage || "Usage"}:</span>
                <span className="text-foreground/80">{percentage}%</span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{dict.materials?.progress || "Progress"}:</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-1.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </Progress>
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" className="border-border bg-card hover:bg-muted text-xs">
              {dict.materials?.viewDetails || "View Details"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

