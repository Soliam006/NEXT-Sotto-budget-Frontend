
// Get status translation
export const getStatusTranslation = (status: string, dict: any): string => {
    switch (status) {
        case "Inactive":
            return dict.projects.status.completed
        case "Active":
            return dict.projects.status.inProgress
        case "Planning":
            return dict.projects.status.planning
        default:
            return status
    }
}

// Función para formatear fechas en formato legible
export function formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}