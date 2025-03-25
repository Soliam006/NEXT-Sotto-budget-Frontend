"use client"

import { useState } from "react"
import {
  Activity,
  AlertCircle,
  Bell,
  Building,
  Calendar,
  Check,
  Construction,
  Edit,
  FileText,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  Search,
  Settings,
  Share2,
  Sun,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for user profile
const USER_PROFILE = {
  id: "user123",
  name: "Alex Johnson",
  username: "alexj_builder",
  role: "Senior Project Manager",
  avatar: "/placeholder.svg?height=200&width=200",
  coverImage: "",
  bio: "Experienced construction project manager with over 10 years in residential and commercial projects. Specializing in sustainable building practices and efficient project delivery.",
  location: "San Francisco, CA",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  website: "www.alexjohnson.build",
  joinedDate: "January 2020",
  stats: {
    projects: 24,
    followers: 156,
    following: 89,
    requests: 7,
  },
}

// Mock data for projects
const PROJECTS = [
  {
    id: 1,
    title: "Modern Residential Complex",
    description: "A 12-unit modern residential complex with sustainable features",
    status: "In Progress",
    completion: 65,
    role: "Project Manager",
    image: "/placeholder.svg?height=150&width=300",
    location: "Oakland, CA",
  },
  {
    id: 2,
    title: "Commercial Office Renovation",
    description: "Complete renovation of a 5-story commercial office building",
    status: "Completed",
    completion: 100,
    role: "Lead Manager",
    image: "/placeholder.svg?height=150&width=300",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    title: "Eco-Friendly School Building",
    description: "Construction of a new eco-friendly elementary school",
    status: "In Progress",
    completion: 42,
    role: "Consultant",
    image: "/placeholder.svg?height=150&width=300",
    location: "Berkeley, CA",
  },
  {
    id: 4,
    title: "Hospital Wing Addition",
    description: "Adding a new specialized care wing to existing hospital",
    status: "Planning",
    completion: 15,
    role: "Project Manager",
    image: "/placeholder.svg?height=150&width=300",
    location: "San Jose, CA",
  },
  {
    id: 5,
    title: "Historic Building Restoration",
    description: "Careful restoration of a 19th century historic building",
    status: "Completed",
    completion: 100,
    role: "Restoration Specialist",
    image: "/placeholder.svg?height=150&width=300",
    location: "San Francisco, CA",
  },
]

// Mock data for followers, following, and requests
const generateUsers = (count:any) => {
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

  return Array.from({ length: count }, (_, i) => ({
    id: `user${i + 1}`,
    name: `User ${i + 1}`,
    username: `user${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    avatar: `/placeholder.svg?height=100&width=100&text=U${i + 1}`,
    isFollowing: Math.random() > 0.5,
  }))
}

const FOLLOWERS = generateUsers(USER_PROFILE.stats.followers)
const FOLLOWING = generateUsers(USER_PROFILE.stats.following)
const REQUESTS = generateUsers(USER_PROFILE.stats.requests)

// Mock data for search results
const SEARCH_RESULTS = [
  ...generateUsers(10),
  {
    id: "user123",
    name: "Alex Johnson",
    username: "alexj_builder",
    role: "Senior Project Manager",
    avatar: "/placeholder.svg?height=100&width=100&text=AJ",
    isFollowing: false,
  },
]

export default function ProfilePage({ dict, lang }: { dict: any; lang: string }) {
  const router = useRouter()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false)
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false)
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(SEARCH_RESULTS)
  const [followers, setFollowers] = useState(FOLLOWERS)
  const [following, setFollowing] = useState(FOLLOWING)
  const [requests, setRequests] = useState(REQUESTS)

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.body.classList.toggle("dark", theme === "light");
    document.body.classList.toggle("light", theme === "dark");
  };

  // Handle language change
  const handleLanguageChange = (newLang: string) => {
    if (newLang !== lang) {
      router.push(`/${newLang}/profile`)
    }
  }

  // Handle search
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
      prev.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
    )

    // Also update in following list if user is there
    setFollowing((prev) => {
      const userInFollowing = prev.find((user) => user.id === userId)
      if (userInFollowing) {
        return prev.filter((user) => user.id !== userId)
      } else {
        const userToAdd = SEARCH_RESULTS.find((user) => user.id === userId)
        if (userToAdd) {
          return [...prev, { ...userToAdd, isFollowing: true }]
        }
      }
      return prev
    })
  }

  // Handle accept request
  const handleAcceptRequest = (userId: string) => {
    // Remove from requests
    setRequests((prev) => prev.filter((user) => user.id !== userId))

    // Add to followers
    const userToAdd = REQUESTS.find((user) => user.id === userId)
    if (userToAdd) {
      setFollowers((prev) => [...prev, userToAdd])
    }
  }

  // Handle reject request
  const handleRejectRequest = (userId: string) => {
    // Remove from requests
    setRequests((prev) => prev.filter((user) => user.id !== userId))
  }

  // Get status translation
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "Completed":
        return dict.projects.status.completed
      case "In Progress":
        return dict.projects.status.inProgress
      case "Planning":
        return dict.projects.status.planning
      default:
        return status
    }
  }

  return (
    <div
      className={`${theme}  text-slate-100 relative overflow-hidden`}
    >
      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Construction className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Sotto Budget
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Button
              variant="outline"
              className="hidden md:flex items-center space-x-2 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
              onClick={() => setIsSearchDialogOpen(true)}
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">{dict.profile.searchUsers}</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Select value={lang} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[100px] bg-slate-800/50 border-slate-700 text-slate-300">
                  <SelectValue placeholder={dict.language[lang]} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dict.nav.notifications}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dict.nav.toggleTheme}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={USER_PROFILE.avatar} alt={USER_PROFILE.name} />
                      <AvatarFallback className="bg-slate-700 text-cyan-500">AJ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{USER_PROFILE.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">@{USER_PROFILE.username}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{dict.nav.profile}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{dict.nav.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    <span>{dict.nav.dashboard}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{dict.nav.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden">
            <img
              src={USER_PROFILE.coverImage || "https://mmatt.mx/wp-content/uploads/2022/06/tips-remodelacion-mmatt.jpg.webp"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-16 left-4 md:left-8">
            <Avatar className="h-32 w-32 border-4 border-slate-900">
              <AvatarImage src={USER_PROFILE.avatar} alt={USER_PROFILE.name} />
              <AvatarFallback className="bg-slate-700 text-cyan-500 text-4xl">AJ</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-2">
<Button className="bg-slate-900/60 hover:bg-slate-900/80  text-white cursor-pointer">
              <Edit className="h-4 w-4 mr-2" />
              {dict.profile.edit}
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer">
              <Share2 className="h-4 w-4 mr-2" />
              {dict.profile.share}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{USER_PROFILE.name}</CardTitle>
                <CardDescription className="text-slate-400">
                  @{USER_PROFILE.username} · {USER_PROFILE.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">{USER_PROFILE.bio}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-slate-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{USER_PROFILE.location}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{USER_PROFILE.email}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{USER_PROFILE.phone}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {dict.profile.joined} {USER_PROFILE.joinedDate}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-slate-800/70"
                    onClick={() => setIsProjectsDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{USER_PROFILE.stats.projects}</span>
                    <span className="text-xs text-slate-400">{dict.profile.projects}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-slate-800/70"
                    onClick={() => setIsFollowersDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{USER_PROFILE.stats.followers}</span>
                    <span className="text-xs text-slate-400">{dict.profile.followers}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-slate-800/70"
                    onClick={() => setIsFollowingDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{USER_PROFILE.stats.following}</span>
                    <span className="text-xs text-slate-400">{dict.profile.following}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-cyan-500" />
                  {dict.requests.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback className="bg-slate-700 text-cyan-500">
                              {request.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{request.name}</p>
                            <p className="text-xs text-slate-400">{request.role}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400">
                    <p>{dict.profile.noRequests}</p>
                  </div>
                )}
              </CardContent>
              {requests.length > 3 && (
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/70"
                    onClick={() => setIsRequestsDialogOpen(true)}
                  >
                    {dict.profile.viewAllRequests.replace("{count}", USER_PROFILE.stats.requests)}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Right Column - Projects and Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-cyan-500" />
                    {dict.profile.recentProjects}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/70"
                    onClick={() => setIsProjectsDialogOpen(true)}
                  >
                    {dict.profile.viewAll}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECTS.slice(0, 4).map((project) => (
                    <Card key={project.id} className="bg-slate-800/50 border-slate-700/30 overflow-hidden">
                      <div className="h-32 w-full">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription className="text-xs text-slate-400 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="p-3 pt-0 flex justify-between">
                        <Badge
                          variant="outline"
                          className={`
                            ${
                            project.status === "Completed"
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : project.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }
                          `}
                        >
                          {getStatusTranslation(project.status)}
                        </Badge>
                        <span className="text-xs text-slate-400">{project.role}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-cyan-500" />
                  {dict.profile.recentActivity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<FileText className="h-4 w-4" />}
                    title="Updated project documentation"
                    description="Modern Residential Complex"
                    time="2 hours ago"
                    iconColor="bg-blue-500/20 text-blue-400"
                  />
                  <ActivityItem
                    icon={<MessageSquare className="h-4 w-4" />}
                    title="Commented on a task"
                    description="Electrical wiring needs to be completed by Friday"
                    time="Yesterday"
                    iconColor="bg-purple-500/20 text-purple-400"
                  />
                  <ActivityItem
                    icon={<Check className="h-4 w-4" />}
                    title="Completed milestone"
                    description="Foundation work for Eco-Friendly School Building"
                    time="3 days ago"
                    iconColor="bg-green-500/20 text-green-400"
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4" />}
                    title="Added new team members"
                    description="3 new members added to Hospital Wing Addition"
                    time="1 week ago"
                    iconColor="bg-cyan-500/20 text-cyan-400"
                  />
                  <ActivityItem
                    icon={<AlertCircle className="h-4 w-4" />}
                    title="Reported an issue"
                    description="Material delivery delay for Commercial Office Renovation"
                    time="1 week ago"
                    iconColor="bg-amber-500/20 text-amber-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Projects Dialog */}
      <Dialog open={isProjectsDialogOpen} onOpenChange={setIsProjectsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Building className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.profile.projects}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {dict.projects.allProjects.replace("{name}", USER_PROFILE.name)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {PROJECTS.map((project) => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700/30 overflow-hidden">
                <div className="h-32 w-full">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-3">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-400 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="flex items-center text-xs text-slate-400 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {project.location}
                  </div>
                  <div className="w-full bg-slate-700/50 h-1.5 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-slate-400">{dict.projects.completion}</span>
                    <span className="text-cyan-400">{project.completion}%</span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <Badge
                    variant="outline"
                    className={`
                      ${
                      project.status === "Completed"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : project.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }
                    `}
                  >
                    {getStatusTranslation(project.status)}
                  </Badge>
                  <span className="text-xs text-slate-400">{project.role}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Followers Dialog */}
      <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.followers.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {dict.followers.description.replace("{name}", USER_PROFILE.name)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder={dict.profile.searchFollowers}
              className="bg-slate-800/50 border-slate-700 mb-4"
              onChange={(e) => {
                const query = e.target.value
                if (query.trim() === "") {
                  setFollowers(FOLLOWERS)
                } else {
                  setFollowers(
                    FOLLOWERS.filter(
                      (user) =>
                        user.name.toLowerCase().includes(query.toLowerCase()) ||
                        user.username.toLowerCase().includes(query.toLowerCase()) ||
                        user.role.toLowerCase().includes(query.toLowerCase()),
                    ),
                  )
                }
              }}
            />

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {followers.length > 0 ? (
                  followers.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={follower.avatar} alt={follower.name} />
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {follower.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{follower.name}</p>
                          <p className="text-xs text-slate-400">{follower.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-800/70 border-slate-700 hover:bg-slate-700/70"
                        onClick={() => handleFollowToggle(follower.id)}
                      >
                        {follower.isFollowing ? dict.followers.following : dict.followers.followBack}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>{dict.followers.noFollowers}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.following.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {dict.following.description.replace("{name}", USER_PROFILE.name)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder={dict.profile.searchFollowing}
              className="bg-slate-800/50 border-slate-700 mb-4"
              onChange={(e) => {
                const query = e.target.value
                if (query.trim() === "") {
                  setFollowing(FOLLOWING)
                } else {
                  setFollowing(
                    FOLLOWING.filter(
                      (user) =>
                        user.name.toLowerCase().includes(query.toLowerCase()) ||
                        user.username.toLowerCase().includes(query.toLowerCase()) ||
                        user.role.toLowerCase().includes(query.toLowerCase()),
                    ),
                  )
                }
              }}
            />

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {following.length > 0 ? (
                  following.map((follow) => (
                    <div
                      key={follow.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={follow.avatar} alt={follow.name} />
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {follow.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{follow.name}</p>
                          <p className="text-xs text-slate-400">{follow.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-800/70 border-slate-700 hover:bg-slate-700/70"
                        onClick={() => handleFollowToggle(follow.id)}
                      >
                        {dict.following.unfollow}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>{dict.following.noFollowing}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requests Dialog */}
      <Dialog open={isRequestsDialogOpen} onOpenChange={setIsRequestsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.requests.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {dict.requests.description.replace("{name}", USER_PROFILE.name)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={request.avatar} alt={request.name} />
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{request.name}</p>
                          <p className="text-xs text-slate-400">{request.role}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          {dict.requests.accept}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-800/70 border-slate-700 hover:bg-slate-700/70"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          {dict.requests.decline}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>{dict.requests.noRequests}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Search className="mr-2 h-5 w-5 text-cyan-500" />
              {dict.search.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">{dict.search.description}</DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder={dict.search.placeholder}
              className="bg-slate-800/50 border-slate-700 mb-4"
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
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-slate-700 text-cyan-500">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.role}</p>
                        </div>
                      </div>
                      {user.id !== USER_PROFILE.id && (
                        <Button
                          variant={user.isFollowing ? "outline" : "default"}
                          size="sm"
                          className={
                            user.isFollowing
                              ? "bg-slate-800/70 border-slate-700 hover:bg-slate-700/70"
                              : "bg-cyan-600 hover:bg-cyan-700"
                          }
                          onClick={() => handleFollowToggle(user.id)}
                        >
                          {user.isFollowing ? dict.search.following : dict.search.follow}
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>{dict.search.noResults}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Activity item component
function ActivityItem({ icon, title, description, time, iconColor }: any) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1.5 rounded-full ${iconColor}`}>{icon}</div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  )
}

// LogOut icon component
function LogOut(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

