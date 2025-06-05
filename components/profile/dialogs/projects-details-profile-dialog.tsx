import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Building, MapPin} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {useUser} from "@/contexts/UserProvider";
import {useProject} from "@/contexts/project-context";
import {getStatusTranslation} from "@/lib/helpers/projects";

interface ProjectsProps {
    isProjectsDialogOpen: boolean;
    setIsProjectsDialogOpenAction: (open: boolean) => void;
    dict: any;
}

export function ProjectsProfileDialog({
                                          isProjectsDialogOpen,
                                          setIsProjectsDialogOpenAction,
                                          dict
                                      }: ProjectsProps) {

    const {user} = useUser();
    const {projects} = useProject()

    return (
        <Dialog open={isProjectsDialogOpen} onOpenChange={setIsProjectsDialogOpenAction}>
            <DialogContent className="bg-background border-border text-foreground max-w-2xl">
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
                    <div className={`grid  grid-cols-1 
                    ${projects.length !== 1 ? "md:grid-cols-2 lg:grid-cols-3 gap-4":"gap-1"}`}>
                    {projects.map((project) => {
                        const completion = Math.round((project.currentSpent / project.limit_budget) * 100);
                        return (
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
                                <CardContent className="p-3 pt-0">
                                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                                        <MapPin className="h-3 w-3 mr-1"/>
                                        {project.location}
                                    </div>
                                    <div className="w-full bg-slate-700/50 h-1.5 rounded-full">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                            style={{width: `${completion}%`}}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs">
                                        <span className="text-muted-foreground">{dict.projects.completion}</span>
                                        <span className="text-cyan-400">{completion}%</span>
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
                                        {getStatusTranslation(project.status, dict)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{project.admin}</span>
                                </CardFooter>
                            </Card>
                        );
                        }
                    )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}