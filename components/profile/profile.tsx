"use client"

import {useEffect, useState} from "react"
import {
  Activity, AlertCircle, Bell, Building, Calendar, Check, Edit, FileText, Mail,
  MapPin, MessageSquare, Phone, Share2, UserPlus, Users, X,
} from "lucide-react"
import {useRouter} from "next/navigation"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {ScrollArea} from "@/components/ui/scroll-area"
import {useUser} from "@/contexts/UserProvider";
import {EditProfileDialog} from "../edit-profile-dialog"
import {AvailabilityDisplay} from "./availability-display"
import {getRole, getToken} from "@/app/services/auth-service";
import {User as User_Type} from "@/contexts/user.types";
import {updateUserInformation} from "@/app/actions/auth";


// Mock data for projects
const PROJECTS = [
  {
    id: 1,
    title: "Modern Residential Complex",
    description: "A 12-unit modern residential complex with sustainable features",
    status: "In Progress",
    completion: 65,
    role: "Project Manager",
    image: "https://th.bing.com/th/id/R.d284962ea61b482b58c6d65052f03a29?rik=%2fGV0UPT9hgsgqw&riu=http%3a%2f%2fguiasde.com%2fmaterialescentenario%2fwp-content%2fuploads%2f2021%2f10%2fremodelacion.jpg&ehk=aKhpFHH8%2fN0RFpFYMAlR0Fyt%2fK3ScltMbFFG7f2A6N4%3d&risl=&pid=ImgRaw&r=0",
    location: "Oakland, CA",
  },
  {
    id: 2,
    title: "Commercial Office Renovation",
    description: "Complete renovation of a 5-story commercial office building",
    status: "Completed",
    completion: 100,
    role: "Lead Manager",
    image: "https://www.echeverrimontes.com/hubfs/remodelaci%C3%B3n%20de%20casas%20peque%C3%B1as.png",
    location: "San Francisco, CA",
  },
  {
    id: 3,
    title: "Eco-Friendly School Building",
    description: "Construction of a new eco-friendly elementary school",
    status: "In Progress",
    completion: 42,
    role: "Consultant",
    image: "https://a.storyblok.com/f/88871/1254x836/6ea6ef0e4a/realkredit-modernisierung.jpg",
    location: "Berkeley, CA",
  },
  {
    id: 4,
    title: "Hospital Wing Addition",
    description: "Adding a new specialized care wing to existing hospital",
    status: "Planning",
    completion: 15,
    role: "Project Manager",
    image: "https://th.bing.com/th/id/R.d284962ea61b482b58c6d65052f03a29?rik=%2fGV0UPT9hgsgqw&riu=http%3a%2f%2fguiasde.com%2fmaterialescentenario%2fwp-content%2fuploads%2f2021%2f10%2fremodelacion.jpg&ehk=aKhpFHH8%2fN0RFpFYMAlR0Fyt%2fK3ScltMbFFG7f2A6N4%3d&risl=&pid=ImgRaw&r=0",
    location: "San Jose, CA",
  },
  {
    id: 5,
    title: "Historic Building Restoration",
    description: "Careful restoration of a 19th century historic building",
    status: "Completed",
    completion: 100,
    role: "Restoration Specialist",
    image: "https://www.echeverrimontes.com/hubfs/remodelaci%C3%B3n%20de%20casas%20peque%C3%B1as.png",
    location: "San Francisco, CA",
  },
]


export default function ProfilePage({dict, lang}: { dict: any; lang: string }) {

  const router = useRouter()
  const {user, setUser,
    acceptFollower,
    rejectFollower,
    followUser,
    unfollowUser,
    isSaving} = useUser();

  const [user_data, setUser_data] = useState<User_Type | null>(user);

  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false)
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false)
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [followers, setFollowers] = useState(user?.followers || [])
  const [following, setFollowing] = useState(user?.following || [])
  const [requests, setRequests] = useState(user?.requests || [])

  useEffect(() => {
    console.log("User data updated:", user)
    setFollowers(user?.followers || [])
    setFollowing(user?.following || [])
    setRequests(user?.requests || [])
  }, [user])

  /**
   * Handle follow/unfollow toggle
   * @param userId User ID to follow/unfollow
   * @param follow Boolean indicating whether to follow or unfollow
   */
  const handleFollowToggle = (userId: number, follow: boolean) => {
    try {
      if (follow) {
        const follower = followUser(userId);
        if (!follower) {
          throw new Error("Error following user");
        }
      } else {
        console.log("Unfollow User", userId);
        const unfollower = unfollowUser(userId);
        if (!unfollower) {
          throw new Error("Error unfollowing user");
        }
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }
  // Handle accept request
const handleAcceptRequest = async (userId: number) => {
  try {
    const follower = await acceptFollower(userId);
    if (!follower) {
      throw new Error("Error accepting follower request");
    }
    console.log("User After Accept:", user);
  } catch (error) {
    alert(`Error: ${error}`);
  }
}

  // Handle reject request
  const handleRejectRequest = async (userId: number) => {
    try {
      const responseFollower = await rejectFollower(userId);
      if (! responseFollower) {
        throw new Error("Error rejecting follower request");
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }
  /**
   * Handle save profile
   * @param updatedUser User data to save
   * @throws {Error} if there is an issue saving the profile
   */
  const handleSaveProfile = async (updatedUser: User_Type): Promise<void> => {
    // Simulate API call
    const response = await updateUserInformation(updatedUser, user_data, getToken(), dict.common);

    console.log("Response:", response);
    if (response.status !== "success") {
      throw new Error(response.message);
    }

    if (response.data) {
      const json = response.data;
      if (json.statusCode === 400) {
        throw new Error(
          JSON.stringify({
            email: dict.signup.validation.emailTaken || "Email slslsls already taken",
          })
        );
      }
      if (json.statusCode === 409) {
        throw new Error(
          JSON.stringify({
            username: dict.signup.validation.userTaken || "Username sksksksk already taken",
          })
        );
      }
    } else {
      throw new Error(dict.common.serverError);
    }

    console.log("GUARDANDO USUARIO", updatedUser);
    // Update user_data state
    setUser_data(updatedUser);
    setUser(updatedUser);

    // Show success message
    alert(`Title: ${dict.profile.edit.successTitle} Message: ${dict.profile.edit.successMessage}`);

    // If language preference changed, redirect to new language
    if (updatedUser.language_preference !== lang) {
      router.push(`/${updatedUser.language_preference}/profile`);
    }
  };
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

  function generateInicials(name: string) {
    return name.split(" ").map((part) => part.charAt(0)).join("")
  }

  return (
    <div className={`min-h-screen bg-background text-foreground relative overflow-hidden`}>
      <div className="container mx-auto p-4 relative z-10">

        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 md:h-64 w-full rounded-xl overflow-hidden">
            <img src="https://a.storyblok.com/f/88871/1254x836/6ea6ef0e4a/realkredit-modernisierung.jpg" alt="Cover"
                 className="w-full h-full object-cover"/>
          </div>
          <div className="absolute -bottom-16 left-4 md:left-8">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src="/placeholder.svg?height=200&width=200&text=AJ" alt={user?.name}/>
              <AvatarFallback className="bg-slate-700 text-cyan-500 text-4xl">
                {generateInicials(user?.name || "Undefined")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              className="bg-secondary/90 border-border hover:bg-secondary text-primary cursor-pointer"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2"/>
              {dict.profile.edit.button}
            </Button>
            <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
              <Share2 className="h-4 w-4 mr-2"/>
              {dict.profile.share}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  @{user?.username} · {getRole(user?.role || "CLIENT", lang as "es" | "en" | "ca")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80">{user?.description}</p>

                <div className="space-y-2">
                  {user?.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2"/>
                      <span>{user?.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2"/>
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2"/>
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.created_at && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2"/>
                      <span>
                        {dict.profile.joined} {formatDate(user.created_at, lang)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-secondary cursor-pointer"
                    onClick={() => setIsProjectsDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{PROJECTS.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.projects}</span>
                  </Button>
                  {user?.followers && user.followers.length>0 &&
                      <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-secondary cursor-pointer"
                    onClick={() => setIsFollowersDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{user.followers.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.followers}</span>
                  </Button>
                  }
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-secondary cursor-pointer"
                    onClick={() => setIsFollowingDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{user?.following?.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.following}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Availability Display */}
            <AvailabilityDisplay availabilities={user?.availabilities || []} lang={lang} dictionary={dict}/>

            {/* Follow Requests */}
            {user?.requests &&( user.requests.length > 0 ) && (
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-cyan-500"/>
                    {dict.requests.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={request.avatar} alt={request.name}/>
                            <AvatarFallback className="bg-slate-700 text-cyan-500">
                              {request.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{request.name}</p>
                            <p className="text-xs text-muted-foreground">{request.role}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={isSaving}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={isSaving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {user.requests.length > 3 && (
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-secondary"
                      onClick={() => setIsRequestsDialogOpen(true)}
                    >
                      {dict.profile.viewAllRequests.replace("{count}", user.requests.length.toString())}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Projects and Activity */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-5 w-5 mr-2 text-cyan-500"/>
                    {dict.profile.recentProjects}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-secondary"
                    onClick={() => setIsProjectsDialogOpen(true)}
                  >
                    {dict.profile.viewAll}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECTS.slice(0, 4).map((project) => (
                    <Card key={project.id} className="bg-card/80 border-border/30 overflow-hidden">
                      <div className="h-32 w-full">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2">
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
                        <span className="text-xs text-muted-foreground">{project.role}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-cyan-500"/>
                  {dict.profile.recentActivity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<FileText className="h-4 w-4"/>}
                    title="Updated project documentation"
                    description="Modern Residential Complex"
                    time="2 hours ago"
                    iconColor="bg-blue-500/20 text-blue-400"
                  />
                  <ActivityItem
                    icon={<MessageSquare className="h-4 w-4"/>}
                    title="Commented on a task"
                    description="Electrical wiring needs to be completed by Friday"
                    time="Yesterday"
                    iconColor="bg-purple-500/20 text-purple-400"
                  />
                  <ActivityItem
                    icon={<Check className="h-4 w-4"/>}
                    title="Completed milestone"
                    description="Foundation work for Eco-Friendly School Building"
                    time="3 days ago"
                    iconColor="bg-green-500/20 text-green-400"
                  />
                  <ActivityItem
                    icon={<Users className="h-4 w-4"/>}
                    title="Added new team members"
                    description="3 new members added to Hospital Wing Addition"
                    time="1 week ago"
                    iconColor="bg-cyan-500/20 text-cyan-400"
                  />
                  <ActivityItem
                    icon={<AlertCircle className="h-4 w-4"/>}
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

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        user={user}
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSave={handleSaveProfile}
        dictionary={dict}
        lang={lang}
      />

      {/* Projects Dialog */}
      <Dialog open={isProjectsDialogOpen} onOpenChange={setIsProjectsDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground w-md-[50vw]">
        <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl flex items-center">
                  <Building className="mr-2 h-5 w-5 text-cyan-500"/>
                  {dict.profile.projects}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {dict.projects.allProjects.replace("{name}", user?.name || user?.username)}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[70vh] pr-4 mt-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS.map((project) => (
                <Card key={project.id} className="bg-card/80 border-border/30 overflow-hidden">
                  <div className="h-32 w-full">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1"/>
                      {project.location}
                    </div>
                    <div className="w-full bg-slate-700/50 h-1.5 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{width: `${project.completion}%`}}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-muted-foreground">{dict.projects.completion}</span>
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
                    <span className="text-xs text-muted-foreground">{project.role}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>


      {/* Followers Dialog */}
      <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-500"/>
              {dict.followers.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {dict.followers.description.replace("{name}", user?.name || user?.username)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder={dict.profile.searchFollowers}
              className="bg-background border-input mb-4"
              onChange={(e) => {
                const query = e.target.value
                if (query.trim() === "") {
                  setFollowers(followers)
                } else {
                  setFollowers(
                    followers.filter(
                      (user) =>
                        user.name.toLowerCase().includes(query.toLowerCase()) ||
                        user.username.toLowerCase().includes(query.toLowerCase()) ||
                        user.role.toLowerCase().includes(query.toLowerCase()),
                    ) || []
                  )
                }
              }}
            />

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {user?.followers&& user.followers.length > 0 ? (
                  followers.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={follower.avatar} alt={follower.name}/>
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {follower.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{follower.name}</p>
                          <p className="text-xs text-muted-foreground">{follower.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-secondary/70 border-border hover:bg-secondary"
                        onClick={() => handleFollowToggle(follower.id, ! follower.isFollowing)}
                      >
                        {follower&& follower.isFollowing ? dict.followers.following : dict.followers.followBack}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
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
        <DialogContent className="bg-background border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Users className="mr-2 h-5 w-5 text-cyan-500"/>
              {dict.following.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {dict.following.description.replace("{name}", user?.name || user?.username)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder={dict.profile.searchFollowing}
              className="bg-background border-input mb-4"
              onChange={(e) => {
                const query = e.target.value
                if (query.trim() === "") {
                  setFollowing(following)
                } else {
                  setFollowing(
                    following.filter(
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
                {user?.following && user.following.length > 0 ? (
                  following.map((follow) => (
                    <div
                      key={follow.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={follow.avatar} alt={follow.name}/>
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {follow.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{follow.name}</p>
                          <p className="text-xs text-muted-foreground">{follow.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-secondary/70 border-border hover:bg-secondary"
                        onClick={() => handleFollowToggle(follow.id, false)}
                      >
                        {dict.following.unfollow}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
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
        <DialogContent className="bg-background border-border text-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-cyan-500"/>
              {dict.requests.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {dict.requests.description.replace("{name}", user?.name || user?.username)}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {user?.requests && user.requests.length > 0 ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={request.avatar} alt={request.name}/>
                          <AvatarFallback className="bg-slate-700 text-cyan-500">
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">{request.role}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          {dict.requests.accept}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-secondary/70 border-border hover:bg-secondary"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          {dict.requests.decline}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{dict.requests.noRequests}</p>
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
function ActivityItem({icon, title, description, time, iconColor}: any) {
  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1.5 rounded-full ${iconColor}`}>{icon}</div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-foreground/90">{title}</div>
          <div className="ml-2 text-xs text-muted-foreground">{time}</div>
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}

// LogOut icon component
function LogOut(props: any) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

// Format date helper
function formatDate(dateString: string, lang: string) {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  } catch (error) {
    return dateString
  }
}
