import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {BarChart3, LineChart} from "lucide-react";

// Component for metric cards
export function MetricCard({
                        title,
                        value,
                        icon: Icon,
                        trend,
                        color,
                        detail,
                        dict
                    }: {
    title: string
    value: number
    icon: any
    trend: "up" | "down" | "stable"
    color: string
    detail: string
    dict: any
}) {
    const getColor = () => {
        switch (color) {
            case "primary":
                return "from-primary to-primary/70 border-primary/30"
            case "secondary":
                return "from-secondary to-secondary/70 border-secondary/30"
            case "accent":
                return "from-accent to-accent/70 border-accent/30"
            default:
                return "from-primary to-primary/70 border-primary/30"
        }
    }

    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return {
                    icon: <BarChart3 className="h-4 w-4 text-warning" />,
                    tooltip: dict?.tooltips?.aboveRange || "Above expected range"
                }
            case "down":
                return {
                    icon: <BarChart3 className="h-4 w-4 rotate-180 text-success" />,
                    tooltip: dict?.tooltips?.belowRange || "Below expected range"
                }
            case "stable":
                return {
                    icon: <LineChart className="h-4 w-4 text-info" />,
                    tooltip: dict?.tooltips?.withinRange || "Within expected range"
                }
            default:
                return {
                    icon: null,
                    tooltip: ""
                }
        }
    }

    const trendData = getTrendIcon()

    return (
        <div className={`bg-muted/50 rounded-lg border shadow-lg ${getColor()} p-4 relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">{title}</div>
                <Icon className={`h-5 w-5 text-${color}`} />
            </div>
            <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-foreground to-foreground/80">
                {value}%
            </div>
            <div className="text-xs text-muted-foreground">{detail}</div>
            <div className="absolute bottom-2 right-2 flex items-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-pointer">
                                {trendData.icon}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{trendData.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-primary to-primary/70"></div>
        </div>
    )
}