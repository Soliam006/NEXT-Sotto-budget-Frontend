"use client"
import { useRouter } from "next/navigation"
import type React from "react"

import { Bell, Construction, Home, LogOut, Moon, Search, Settings, Sun, User } from "lucide-react"

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
import {User as User_Type, User as UserType} from "@/contexts/user.types"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useState} from "react";
import Image from "next/image";
import {clearToken} from "@/app/services/auth-service";
import {NotificationButton} from "@/components/notifications/notification-button";

interface TopBarProps {
  user: UserType | null
  theme: "dark" | "light"
  toggleTheme: () => void
  dictionary: any
  lang: string
  onLanguageChange?: (newLang: string) => void
  onNavigate?: (path: string) => void
}
const generateUsers = (count: any) => {
  const roles = [
    "Project Manager",
    "Architect",
    "Civil Engineer",
    "Contractor",
    "Interior Designer",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Construction Worker",
    "Consultant",
  ]

  return Array.from({length: count}, (_, i) => ({
    id: `user${i + 1}`,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    avatar: `/favicon.ico`,
    isFollowing: Math.random() > 0.5,
  }))
}
const USER_PROFILE: User_Type = {
  id: 123,
  name: "Alex Johnson",
  username: "alexj_builder",
  role: "ADMIN",
  language_preference: "en",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  description:
      "Experienced construction project manager with over 10 years in residential and commercial projects. Specializing in sustainable building practices and efficient project delivery.",
  created_at: "2020-01-15T00:00:00Z",
  availabilities: [
    {
      id: "avail-1",
      from: "2025-04-01T08:00:00Z",
      to: "2025-04-15T17:00:00Z",
    },
    {
      id: "avail-2",
      from: "2025-05-10T08:00:00Z",
      to: "2025-05-20T17:00:00Z",
    },
  ],
}
const FOLLOWING = generateUsers((USER_PROFILE.id % 100) - 11)
// Mock data for search results
const SEARCH_RESULTS = [
  ...generateUsers(10),
  {
    id: "user123",
    name: "Alex Johnson",
    username: "alexj_builder",
    role: "Senior Project Manager",
    avatar: "/favicon.ico",
    isFollowing: false,
  },
]
export function TopBar({
  user,
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
  const [searchResults, setSearchResults] = useState(SEARCH_RESULTS)
  const [following, setFollowing] = useState(FOLLOWING)

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang)
    } else if (newLang !== lang) {
      // Default behavior: navigate to the same path with new language
      const path = window.location.pathname.replace(/^\/(en|es)/, "")
      router.push(`/${newLang}${path}`)
    }
  }
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults(SEARCH_RESULTS)
      return
    }

    const filtered = SEARCH_RESULTS.filter(
        (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  // Handle follow/unfollow
  const handleFollowToggle = (userId: string) => {
    setSearchResults((prev) =>
        prev.map((user) => (user.id === userId ? {...user, isFollowing: !user.isFollowing} : user)),
    )

    // Also update in following list if user_data is there
    setFollowing((prev) => {
      const userInFollowing = prev.find((user) => user.id === userId)
      if (userInFollowing) {
        return prev.filter((user) => user.id !== userId)
      } else {
        const userToAdd = SEARCH_RESULTS.find((user) => user.id === userId)
        if (userToAdd) {
          return [...prev, {...userToAdd, isFollowing: true}]
        }
      }
      return prev
    })
  }

  // Handle navigation
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      router.push(`/${lang}${path}`)
    }
  }

  function logout() {
    clearToken()
    router.push(`/${lang}/login`)
  }

  return (
    <header className="flex items-center justify-between border-b border-border mb-6 px-2 md:px-6 py-2 md:py-4 fixed top-0 left-0 right-0 z-50 bg-background">
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push(`/${lang}/dashboard`)}>
      <Image src="/favicon.ico" alt="SottoBudget" width={50} height={50}
             className="rounded-lg"/>
      <span
          className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent md:block hidden">
            SottoBudget
          </span>
    </div>

      <div className="flex items-center space-x-6">
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

        <div className="flex items-center space-x-3">
          <Select value={lang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[70px] md:w-[100px] bg-secondary border-border text-muted-foreground">
              <SelectValue placeholder={dictionary.language[lang]}/>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>


          {/* Replace Bell icon with NotificationButton component */}
          <NotificationButton dictionary={dictionary} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-muted-foreground hover:text-foreground"
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage
                    src={
                      `/placeholder.svg?height=32&width=32&text=${user?.name?.charAt(0) || user?.username.charAt(0)}`
                    }
                    alt={user?.name || user?.username}
                  />
                  <AvatarFallback className="bg-slate-700 text-cyan-500">
                    {user?.name?.charAt(0) || user?.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">@{user?.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>{dictionary.nav?.profile || "Profile"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                <span>{dictionary.nav?.dashboard || "Dashboard"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick= {()=>logout()}>
                <LogOutIcon className="mr-2 h-4 w-4" />
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
            <DialogDescription className="text-muted-foreground">{dictionary.search.description}</DialogDescription>
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
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src="/favicon.ico" alt={user.name}/>
                              <AvatarFallback className="bg-slate-700 text-cyan-500">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                          </div>
                          {user.id !== "user123" && (
                              <Button
                                  variant={user.isFollowing ? "outline" : "default"}
                                  size="sm"
                                  className={
                                    user.isFollowing
                                        ? "bg-secondary/70 border-border hover:bg-secondary"
                                        : "bg-primary hover:bg-primary/90"
                                  }
                                  onClick={() => handleFollowToggle(user.id)}
                              >
                                {user.isFollowing ? dictionary.search.following : dictionary.search.follow}
                              </Button>
                          )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{dictionary.search.noResults}</p>
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

// LogOut icon component
function LogOutIcon(props: React.ComponentProps<typeof LogOut>) {
  return <LogOut {...props} />
}

