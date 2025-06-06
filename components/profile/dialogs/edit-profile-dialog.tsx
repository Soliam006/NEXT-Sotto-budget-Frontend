"use client"

import {useState, useRef, type FormEvent} from "react"
import {z} from "zod"
import {CalendarIcon, PlusCircle, Trash2} from "lucide-react"
import {format, parseISO} from "date-fns"
import {es, enUS} from "date-fns/locale"

import {Button} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {Badge} from "@/components/ui/badge"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Label} from "@/components/ui/label"

// Tipos
export type Language = "en" | "es"

// Esquema de validación
const createProfileSchema = (translates: any) => {
  return z.object({
    name: z.string().optional(),
    username: z.string().min(3, {
      message: translates.usernameMin || "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: translates.emailInvalid || "Please enter a valid email address.",
    }),
    phone: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    language_preference: z.enum(["en", "es"]),
  })
}
import {User, Availability} from "@/lib/types/user.types"

import isEqual from 'lodash.isequal';
import {useUser} from "@/contexts/UserProvider";

export function EditProfileDialog({
                                    open,
                                    onOpenChange,
                                    onSave,
                                    dictionary,
                                    lang,
                                  }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: User) => Promise<void>
  dictionary: any
  lang: string
}) {
  const {user} = useUser()

  if (!user) return null
  const t = dictionary.profile.edit
  const t_validation = dictionary.signup.validation
  const formRef = useRef<HTMLFormElement>(null)
  const [availabilities, setAvailabilities] = useState<Availability[]>(user.client?.availabilities || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noChangeDetected, setNoChangeDetected] = useState(true)
  const [newAvailability, setNewAvailability] = useState<{
    start_date: Date | undefined
    end_date: Date | undefined
  }>({
    start_date: undefined,
    end_date: undefined,
  })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Obtener datos del formulario
      const formData = new FormData(e.currentTarget)

      // Validar disponibilidades
      const validAvailabilities = validateAvailabilities(availabilities)
      if (!validAvailabilities.valid) {
        setErrors({availabilities: validAvailabilities.message})
        setIsSubmitting(false)
        return
      }

      // Validar datos del formulario con Zod
      const profileSchema = createProfileSchema(t_validation || {})
      const validationResult = profileSchema.safeParse({
        name: formData.get("name")?.toString() || "",
        username: formData.get("username")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        location: formData.get("location")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        language_preference: (formData.get("language_preference")?.toString() as Language) || "en",
      })

      if (!validationResult.success) {
        // Convertir errores de Zod a un formato más simple
        const formattedErrors: Record<string, string> = {}
        validationResult.error.errors.forEach((err) => {
          formattedErrors[err.path[0].toString()] = err.message
        })
        setErrors(formattedErrors)
        setIsSubmitting(false)
        return
      }

      // Actualizar usuario
      const updatedUser: User = {
        ...user,
        ...validationResult.data,
        client: {
          ...user.client,
          availabilities,
        },
      }

      try {
        await onSave(updatedUser)
      } catch (error: any) {
        const parsed = JSON.parse(error.message);
        const formattedErrors: Record<string, string> = {}
        if (parsed.email) {
          formattedErrors["email"] = parsed.email
        }
        if (parsed.username) {
          formattedErrors["username"] = parsed.username
        }
        setErrors({
          ...formattedErrors,
        });
        return;
      }

      onOpenChange(false) // Si el update sale bien, cerrar el diálogo
    } catch (error) {
      console.error("Error saving profile:", error)
      setErrors({form: t.errorGeneral || "An error occurred while saving your profile."})
      return;
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validar disponibilidades
  const validateAvailabilities = (availabilities: Availability[]) => {
    for (const availability of availabilities) {
      const fromDate = new Date(availability.start_date)
      const toDate = new Date(availability.end_date)

      if (fromDate >= toDate) {
        return {
          valid: false,
          message: t.availabilityError || "Start date must be before end date",
        }
      }
    }
    return {valid: true, message: ""}
  }

  // Agregar nueva disponibilidad
  const addAvailability = () => {
    if (!newAvailability.start_date || !newAvailability.end_date) return

    const fromDate = newAvailability.start_date
    const toDate = newAvailability.end_date

    if (fromDate >= toDate) {
      setErrors({
        newAvailability: t.availabilityError || "Start date must be before end date",
      })
      return
    }

    const newItem: Availability = {
      id: `avail-${Date.now()}`,
      start_date: fromDate.toISOString(),
      end_date: toDate.toISOString(),
    }

    const updated = [...availabilities, newItem]
    setAvailabilities(updated)
    setNewAvailability({start_date: undefined, end_date: undefined})
    setErrors({...errors, newAvailability: undefined})
    handleChanges(updated) // <-- pasamos el array actualizado
  }

  // Eliminar disponibilidad
  const removeAvailability = (id: string) => {
    const newAvailabilities = availabilities.filter((a) => a.id !== id);
    setAvailabilities(newAvailabilities);
    handleChanges(newAvailabilities); // pásalo como argumento
  }

  // Formatear fecha según el idioma
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "PPP", {locale: lang === "es" ? es : enUS})
    } catch (error) {
      return dateString
    }
  }
  function handleChanges(currentAvailabilities = availabilities) {
    const formData = new FormData(formRef.current!)
    const name = formData.get("name")?.toString() || ""
    const username = formData.get("username")?.toString() || ""
    const email = formData.get("email")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const location = formData.get("location")?.toString() || ""
    const description = formData.get("description")?.toString() || ""
    const language_preference = (formData.get("language_preference")?.toString() as Language) || "en"

    if (
      name !== user?.name ||
      username !== user.username ||
      email !== user.email ||
      phone !== user.phone ||
      location !== user.location ||
      description !== user.description ||
      language_preference !== user.language_preference ||
      (!isEqual(currentAvailabilities, user?.client?.availabilities))
    ) {
      setNoChangeDetected(false)
    } else {
      setNoChangeDetected(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{t.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                {t.name}
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name || ""}
                placeholder={t.namePlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                {t.username}
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username}
                placeholder={t.usernamePlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground ${errors.username ? "border-destructive" : ""}`}
                required
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                {t.email}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder={t.emailPlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground ${errors.email ? "border-destructive" : ""}`}
                required
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                {t.phone}
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone || ""}
                placeholder={t.phonePlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground ${errors.phone ? "border-destructive" : ""}`}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                {t.location}
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={user.location || ""}
                placeholder={t.locationPlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground ${errors.location ? "border-destructive" : ""}`}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                {t.description}
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={user.description || ""}
                placeholder={t.descriptionPlaceholder}
                onChange={() => handleChanges(availabilities)}
                className={`bg-background border-input text-foreground resize-none ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">{t.language}</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="language_preference"
                    value="en"
                    onChange={() => handleChanges(availabilities)}
                    defaultChecked={user.language_preference === "en"}
                    className="h-4 w-4"
                  />
                  <span>English</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="language_preference"
                    value="es"
                    onChange={() => handleChanges(availabilities)}
                    defaultChecked={user.language_preference === "es"}
                    className="h-4 w-4"
                  />
                  <span>Español</span>
                </label>
              </div>
              {errors.language_preference && <p className="text-sm text-destructive">{errors.language_preference}</p>}
            </div>

            {/* Sección de disponibilidades */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">{t.availabilities}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.availabilitiesDescription}</p>
              </div>

              {/* Lista de disponibilidades existentes */}
              {availabilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">{t.currentAvailabilities}</h4>
                  <div className="space-y-2">
                    {availabilities.map((availability:Availability) => (
                      <div
                        key={availability.id}
                        className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {formatDate(availability.start_date)}
                          </Badge>
                          <span className="hidden sm:inline text-muted-foreground">→</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {formatDate(availability.end_date)}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAvailability(availability.id!)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.availabilities && <p className="text-sm text-destructive">{errors.availabilities}</p>}

              {/* Agregar nueva disponibilidad */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">{t.addAvailability}</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-background border-input text-foreground"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4"/>
                          {newAvailability.start_date ? (
                            format(newAvailability.start_date, "PPP", {locale: lang === "es" ? es : enUS})
                          ) : (
                            <span className="text-muted-foreground">{t.selectStartDate}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                      <Calendar
                        selected={newAvailability.start_date}
                        onSelect={(date: any) => setNewAvailability({...newAvailability, start_date: date})}
                        disabled={(date: Date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return (newAvailability.end_date ? date > newAvailability.end_date : false) || date < today;
                        }}
                        /*locale=lang*/
                      />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-background border-input text-foreground"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4"/>
                          {newAvailability.end_date ? (
                            format(newAvailability.end_date, "PPP", {locale: lang === "es" ? es : enUS})
                          ) : (
                            <span className="text-muted-foreground">{t.selectEndDate}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                        <Calendar
                          selected={newAvailability.end_date}
                          disabled={(date: Date) => newAvailability.start_date ? date < newAvailability.start_date : false}
                          onSelect={(date: any) => setNewAvailability({...newAvailability, end_date: date})}
                          /*locale={lang === "es" ? es : enUS*/
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    type="button"
                    onClick={addAvailability}
                    disabled={!newAvailability.start_date || !newAvailability.end_date}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    {t.add}
                  </Button>
                </div>
                {errors.newAvailability && <p className="text-sm text-destructive">{errors.newAvailability}</p>}
              </div>
            </div>

            {errors.form && (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/30">
                <p className="text-sm text-destructive">{errors.form}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-background border-input text-foreground"
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || noChangeDetected}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? t.saving : t.save}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

