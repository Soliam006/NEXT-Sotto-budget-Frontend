import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {UserPlus} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {UserFollower} from "@/contexts/user.types";
import {useUser} from "@/contexts/UserProvider";

interface RequestsProps {
    isRequestsDialogOpen: boolean;
    setIsRequestsDialogOpenAction: (open: boolean) => void;
    dict: any;
    handleAcceptRequestAction: (userId: number) => void;
    handleRejectRequestAction: (userId: number) => void;
    requests: UserFollower[];
}

export function RequestsProfileDialog({
                                          isRequestsDialogOpen,
                                          setIsRequestsDialogOpenAction,
                                          dict,
                                          handleAcceptRequestAction,
                                          handleRejectRequestAction,
                                          requests,
                                      }: RequestsProps) {

    const {user} = useUser()

    return (
        <Dialog open={isRequestsDialogOpen} onOpenChange={setIsRequestsDialogOpenAction}>
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
                                                className="bg-primary hover:bg-primary/90 cursor-pointer"
                                                onClick={() => handleAcceptRequestAction(request.id)}
                                            >
                                                {dict.requests.accept}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-secondary/70 border-border hover:bg-secondary cursor-pointer"
                                                onClick={() => handleRejectRequestAction(request.id)}
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
    )
}