import { format, parseISO } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { CalendarRange } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {Availability} from "@/lib/types/user.types";


export function AvailabilityDisplay({
                                      availabilities,
                                      lang,
                                      dictionary,
                                    }: {
  availabilities: Availability[]
  lang: string
  dictionary: any
}) {
  const t = dictionary.profile.availability

  // Formatear fecha según el idioma
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "PPP", { locale: lang === "es" ? es : enUS })
    } catch (error) {
      return dateString
    }
  }

  if (!availabilities || availabilities.length === 0) {
    return (
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarRange className="h-5 w-5 mr-2 text-cyan-500" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{t.noAvailabilities}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <CalendarRange className="h-5 w-5 mr-2 text-cyan-500" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-3">
            {availabilities.map((availability, index) => (
              <div key={availability.id || index} className="p-3 rounded-md bg-secondary/30 border border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {formatDate(availability.start_date)}
                  </Badge>
                  <span className="hidden sm:inline text-muted-foreground">→</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {formatDate(availability.end_date)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

