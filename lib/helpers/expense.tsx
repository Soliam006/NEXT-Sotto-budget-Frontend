
export function getNameTraduction(category: string, dict: any): string {
    switch (category) {
        case "Materials":
            return dict.expenses?.categories.materials || "Materials"
        case "Labour":
            return dict.expenses?.categories.labour || "Labour"
        case "Products":
            return dict.expenses?.categories.products || "Products"
        case "Transport":
            return dict.expenses?.categories.transport || "Transport"
        case "Others":
            return dict.expenses?.categories.others || "Others"
        default:
            return category
    }
}