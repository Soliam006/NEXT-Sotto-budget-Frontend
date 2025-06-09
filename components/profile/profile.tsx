"use client"

import {useEffect, useState} from "react"
import {
  Activity, AlertCircle, Bell, Building, Calendar, Check, Edit, FileText, Mail,
  MapPin, MessageSquare, Phone, Users, X,
} from "lucide-react"
import {useRouter} from "next/navigation"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {useUser} from "@/contexts/UserProvider";
import {EditProfileDialog} from "./dialogs/edit-profile-dialog"
import {AvailabilityDisplay} from "./availability-display"
import {getRole} from "@/app/services/auth-service";
import {User as User_Type} from "@/lib/types/user.types";
import {FollowingProfileDialog} from "@/components/profile/dialogs/following-profile-dialog";
import {FollowersProfileDialog} from "@/components/profile/dialogs/followers-profile-dialog";
import {RequestsProfileDialog} from "@/components/profile/dialogs/request-profile-dialog";
import {ProjectsProfileDialog} from "@/components/profile/dialogs/projects-details-profile-dialog";
import {useProject} from "@/contexts/project-context";
import {getStatusTranslation} from "@/lib/helpers/projects";

export default function ProfilePage({dict, lang}: { dict: any; lang: string }) {

  const router = useRouter()
  const {user, setFollowers,
    acceptFollower,
    rejectFollower,
    followUser,
    unfollowUser,
    isSaving,
    saveProfile,
  } = useUser();

  const {projects} = useProject()

  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false)
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false)
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false)
  const [isRequestsDialogOpen, setIsRequestsDialogOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [following, setFollowing] = useState(user?.following || [])
  const [requests, setRequests] = useState(user?.requests || [])

  /**
   * Handle follow/unfollow toggle
   * @param userId User ID to follow/unfollow
   * @param follow Boolean indicating whether to follow or unfollow
   */
  const handleFollowToggle = (userId: number, follow: boolean) => {
    try {
      if (follow) {
        followUser(userId);
      } else {
        console.log("Unfollow User", userId);
        unfollowUser(userId);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }
  // Handle accept request
  const handleAcceptRequest = async (userId: number) => {
      acceptFollower(userId);
  }

  // Handle reject request
  const handleRejectRequest = async (userId: number) => {
     rejectFollower(userId);
  }
  /**
   * Handle save profile
   * @param updatedUser User data to save
   * @throws {Error} if there is an issue saving the profile
   */
  const handleSaveProfile = async (updatedUser: User_Type): Promise<void> => {
    // Simulate API call
    const statusCode = await saveProfile(updatedUser);

    if (statusCode === 400) {
      throw new Error(
          JSON.stringify({
            email: dict.signup.validation.emailTaken || "Email slslsls already taken",
          })
      );
    }
    if (statusCode === 409) {
      throw new Error(
          JSON.stringify({
            username: dict.signup.validation.userTaken || "Username sksksksk already taken",
          })
      );
    }

    // If language preference changed, redirect to new language
    if (updatedUser.language_preference !== lang) {
      router.push(`/${updatedUser.language_preference}/profile`);
    }
  };

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
            {/*<Button className="bg-primary hover:bg-primary/90 cursor-pointer">
              <Share2 className="h-4 w-4 mr-2"/>
              {dict.profile.share}
            </Button> */}
          </div>
        </div>

        {/* Profile Content */}
        <div className={`grid grid-cols-1 ${projects.length > 0 ? 'lg:grid-cols-3' : ''} gap-6 mt-16`}>
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
                    <span className="text-xl font-bold text-cyan-400">{projects.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.projects}</span>
                  </Button>

                  {((user?.followers) && user?.role === 'admin') && (
                      <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-secondary cursor-pointer"
                    onClick={() => setIsFollowersDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{user?.followers.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.followers}</span>
                  </Button>
                  )}
                  {user?.role !== 'admin' && (
                  <Button
                    variant="ghost"
                    className="flex flex-col items-center hover:bg-secondary cursor-pointer"
                    onClick={() => setIsFollowingDialogOpen(true)}
                  >
                    <span className="text-xl font-bold text-cyan-400">{user?.following?.length}</span>
                    <span className="text-xs text-muted-foreground">{dict.profile.following}</span>
                  </Button>
                  )}
                </div>
              </CardFooter>
            </Card>

            {/* Availability Display */}
            <AvailabilityDisplay availabilities={user?.client?.availabilities || []} lang={lang} dictionary={dict}/>

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
          {projects.length > 0 && (
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
                    {projects.slice(0, 4).map((project) => (
                      <Card key={project.id} className="bg-card/80 border-border/30 overflow-hidden">
                        <div className="h-32 w-full">
                          <img
                            src={"https://www.echeverrimontes.com/hubfs/remodelaci%C3%B3n%20de%20casas%20peque%C3%B1as.png"}
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
                            {getStatusTranslation(project.status, dict)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{project.admin}</span>
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
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onSave={handleSaveProfile}
        dictionary={dict}
        lang={lang}
      />
      {/* Projects Dialog */}
      <ProjectsProfileDialog
        isProjectsDialogOpen={isProjectsDialogOpen}
        setIsProjectsDialogOpenAction={setIsProjectsDialogOpen}
        dict={dict}
        />
      { /* Followers Dialog */}
      <FollowersProfileDialog
        isFollowersDialogOpen={isFollowersDialogOpen}
        setIsFollowersDialogOpenAction={setIsFollowersDialogOpen}
        setFollowersAction={setFollowers}
        handleFollowToggleAction={handleFollowToggle}
        dict={dict}
        />
      {/* Following Dialog*/}
      <FollowingProfileDialog setFollowingAction= {setFollowing} following={following}
        isFollowingDialogOpen={isFollowingDialogOpen}
        setIsFollowingDialogOpenAction={setIsFollowingDialogOpen}
        handleFollowToggleAction={handleFollowToggle}
        dict={dict}
        />
      {/* Requests Dialog */}
      <RequestsProfileDialog
        isRequestsDialogOpen={isRequestsDialogOpen}
        setIsRequestsDialogOpenAction={setIsRequestsDialogOpen}
        requests={requests}
        handleAcceptRequestAction={handleAcceptRequest}
        handleRejectRequestAction={handleRejectRequest}
        dict={dict}
        />
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
