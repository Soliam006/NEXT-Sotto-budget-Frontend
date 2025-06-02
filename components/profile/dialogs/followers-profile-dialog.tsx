import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Users} from "lucide-react";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {UserFollower} from "@/contexts/user.types";
import {useUser} from "@/contexts/UserProvider";
import {Dispatch, SetStateAction} from "react";

interface FollowersProps {
    isFollowersDialogOpen: boolean;
    setIsFollowersDialogOpenAction: (open: boolean) => void;
    dict: any;
    handleFollowToggleAction: (userId: number, follow: boolean) => void;
    setFollowersAction: Dispatch<SetStateAction<UserFollower[]>>;
    followers: UserFollower[];
}

export function FollowersProfileDialog({
                                           isFollowersDialogOpen,
                                           setIsFollowersDialogOpenAction,
                                           dict,
                                           handleFollowToggleAction,
                                           setFollowersAction,
                                           followers,
                                       }: FollowersProps) {

    const {user} = useUser()

    return (
        <Dialog open={isFollowersDialogOpen} onOpenChange={setIsFollowersDialogOpenAction}>
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
                                setFollowersAction(followers)
                            } else {
                                setFollowersAction(
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
                            {user?.followers && user.followers.length > 0 ? (
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
                                        {/*(user.role !== "admin") && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="bg-secondary/70 border-border hover:bg-secondary"
                                              onClick={() => handleFollowToggleAction(follower.id, ! follower.isFollowing)}
                                            >
                                              {follower&& follower.isFollowing ? dict.followers.following : dict.followers.followBack}
                                            </Button>
                                          )*/}
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
    )
}