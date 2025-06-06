"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, LogOut, Moon, Search, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User_Search} from "@/lib/types/user.types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { NotificationButton } from "@/components/notifications/notification-button"
import { useUser } from "@/contexts/UserProvider"
import { fetchFollowers } from "@/app/actions/follows"

interface TopBarProps {
  theme: "dark" | "light"
  toggleTheme: () => void
  dictionary: any
  lang: string
  onLanguageChange?: (newLang: string) => void
  onNavigate?: (path: string) => void
}

export function TopBar({
                         theme,
                         toggleTheme,
                         dictionary,
                         lang,
                         onLanguageChange,
                         onNavigate,
                       }: TopBarProps) {
  const router = useRouter()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User_Search[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { token, followUser, unfollowUser, user:currentUser, setToken} = useUser()

  // Cargar todos los usuarios al abrir el diálogo de búsqueda
  useEffect(() => {
    if (isSearchDialogOpen && token) {
      loadAllUsers()
    }
  }, [isSearchDialogOpen])

  const loadAllUsers = async () => {
    try {
      setIsSearching(true)
      const users = await fetchFollowers(token, dictionary)
      if (users) {
        console.log("Fetched users IN TOP BAR", users)
        setSearchResults(users)
      }
    } catch (error) {
      alert(error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      loadAllUsers()
      return
    }

    const filtered = searchResults.filter(
        (user) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  const handleFollowToggle = async (userId: number, currentStatus: string) => {
    try {
      if (currentStatus === 'NONE' || currentStatus === 'REJECTED') {
        // Seguir al usuario
        followUser(userId)
        setSearchResults(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: 'PENDING' }
                    : user
            )
        )
      } else if (currentStatus === 'ACCEPTED') {
        // Dejar de seguir
        unfollowUser(userId)
        setSearchResults(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: 'NONE' }
                    : user
            )
        )
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
    }
  }

  const handleLanguageChange = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang)
    } else if (newLang !== lang) {
      const path = window.location.pathname.replace(/^\/(en|es)/, "")
      router.push(`/${newLang}${path}`)
    }
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      router.push(`/${lang}${path}`)
    }
  }

  function logout() {
    setToken(null, false, lang)
    router.push(`/${lang}/login`)
  }

  return (
      <header className="flex items-center justify-between border-b border-border mb-6 px-2 md:px-6 py-2 md:py-4 fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push(`/${lang}/dashboard`)}>
          <Image src="/favicon.ico" alt="SottoBudget" width={50} height={50} className="rounded-lg"/>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent md:block hidden">
          SottoBudget
        </span>
        </div>

        <div className="flex items-center space-x-6">
          { currentUser?.role !== 'admin' && (
            <>
              <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSearchDialogOpen(true)}
              >
                <Search className="h-5 w-5"/>
              </Button>
              <Button
                  variant="outline"
                  className="hidden md:flex items-center space-x-2 bg-secondary border-border hover:bg-secondary"
                  onClick={() => setIsSearchDialogOpen(true)}
              >
                <Search className="h-4 w-4 text-muted-foreground"/>
                <span className="text-muted-foreground">{dictionary.profile.searchUsers}</span>
              </Button>
            </>
          )}

          <div className="flex items-center space-x-3">
            <Select value={lang} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[70px] md:w-[100px] bg-secondary border-border text-muted-foreground cursor-pointer">
                <SelectValue placeholder={dictionary.language[lang]}/>
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>

            <NotificationButton dictionary={dictionary} />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dictionary.nav?.toggleTheme || "Toggle theme"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                  <Avatar>
                    <AvatarImage
                        src={
                          `/placeholder.svg?height=32&width=32&text=${currentUser?.name?.charAt(0) || currentUser?.username.charAt(0)}`
                        }
                        alt={currentUser?.name || currentUser?.username}
                    />
                    <AvatarFallback className="bg-slate-700 text-cyan-500">
                      {currentUser?.name?.charAt(0) || currentUser?.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser?.name || currentUser?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">@{currentUser?.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{dictionary.nav?.profile || "Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate( currentUser?.role === "admin" ? "/dashboard" : "/dashboard/tasks")}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>{dictionary.nav?.dashboard || "Dashboard"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{dictionary.nav?.logout || "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Dialog */}
        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="bg-background border-border text-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <Search className="mr-2 h-5 w-5 text-cyan-500"/>
                {dictionary.search.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {dictionary.search.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <Input
                  placeholder={dictionary.search.placeholder}
                  className="bg-background border-input mb-4"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
              />

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {isSearching ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>{dictionary.common.loading}</p>
                      </div>
                  ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                          <div
                              key={user.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={user.avatar || `/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`} alt={user.name}/>
                                <AvatarFallback className="bg-slate-700 text-cyan-500">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                              </div>
                            </div>
                            {user.id !== currentUser?.id && (
                                <Button
                                    variant={
                                      user.status === 'ACCEPTED' ? "outline" :
                                          user.status === 'PENDING' ? "secondary" : "default"
                                    }
                                    size="sm"
                                    className={
                                      user.status === 'ACCEPTED'
                                          ? "bg-secondary/70 border-border hover:bg-secondary"
                                          : user.status === 'PENDING'
                                              ? "bg-muted text-muted-foreground hover:bg-muted/80"
                                              : "bg-primary hover:bg-primary/90 cursor-pointer"
                                    }
                                    onClick={() => handleFollowToggle(user.id, user.status || 'NONE')}
                                    disabled={user.status === 'PENDING'}
                                >
                                  {user.status === 'ACCEPTED'
                                      ? dictionary.search.following
                                      : user.status === 'PENDING'
                                          ? dictionary.search.pending
                                          : dictionary.search.follow}
                                </Button>
                            )}
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>{searchQuery ? dictionary.search.noResults : dictionary.search.emptyQuery}</p>
                      </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </header>
  )
}