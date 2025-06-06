import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Users} from "lucide-react";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {UserFollower} from "@/lib/types/user.types";
import {useUser} from "@/contexts/UserProvider";
import {Dispatch, SetStateAction} from "react";

interface FollowingProps {
    isFollowingDialogOpen: boolean;
    setIsFollowingDialogOpenAction: (open: boolean) => void;
    dict: any;
    handleFollowToggleAction: (userId: number, follow: boolean) => void;
    setFollowingAction: Dispatch<SetStateAction<UserFollower[]>>;
    following: UserFollower[];
}

export function FollowingProfileDialog({
    isFollowingDialogOpen,
    setIsFollowingDialogOpenAction,
    dict,
    handleFollowToggleAction,
    setFollowingAction,
    following,
}: FollowingProps) {

    const {user} = useUser()

  return(
      <Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpenAction}>
        {/* Following Dialog */}
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
                            setFollowingAction(following)
                        } else {
                            setFollowingAction(
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
                                        className="bg-secondary/70 border-border hover:bg-secondary cursor-pointer"
                                        onClick={() => handleFollowToggleAction(follow.id, false)}
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
    </Dialog>)
}