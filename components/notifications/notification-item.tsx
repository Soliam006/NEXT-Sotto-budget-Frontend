import React from 'react'
import { cn } from "@/lib/utils"

import {ActivityType} from "@/lib/types/notification";
import {formatDate} from "@/lib/helpers/projects";

interface NotificationItemProps {
    metadatas: any
    activity_type: ActivityType
    dict: any
}

export const NotificationItem = ({
                              metadatas,
                              activity_type,
                              dict
                          }: NotificationItemProps) => {

    // Renderizar cambios específicos
    // Función para renderizar cambios con traducciones
    const renderChanges = (metadatas: any, dict: any) => {
        const translations = dict?.notifications || {};

    return (
        <div className="mt-2 space-y-1 text-xs">
            <div className="font-medium">{translations.changes || "Changes"}:</div>
                <div className={`${Object.entries(metadatas.changes).length > 2 ? "grid grid-cols-2 gap-2": ""} `}>
                    {Object.entries(metadatas.changes).map(([field, changeObj]) => {
                        const change = changeObj as { old?: string; new?: string };
                        return (
                            <div key={field} className="flex items-start">
                                <span className="font-medium capitalize mr-1">
                                    {translations[field] || field.charAt(0).toUpperCase() + field.slice(1)}:
                                </span>
                                <div className="flex-1">
                                    <div className="line-through text-muted-foreground">
                                        {change.old
                                            ? (field.toLowerCase().includes("date") ? formatDate(change.old) : change.old)
                                            : (translations.empty || 'Empty')}
                                    </div>
                                    <div className="font-semibold">
                                        {field.toLowerCase().includes("date") && change.new
                                            ? formatDate(change.new)
                                            : change.new}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
        </div>
        </div>
    );
    }

    // Renderizar detalles específicos según el tipo de actividad
    const renderSpecificDetails = (activity_type: ActivityType, metadatas: any, dict: any) => {
        const translations = dict?.notifications || {};

        switch (activity_type) {
            case 'task_created':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        {metadatas?.worker && (
                            <div><span className="font-medium">{translations.worker || "Worker"}: </span> {metadatas.worker}</div>
                        )}
                        {metadatas?.assignee && (
                            <div><span className="font-medium">{translations.assignee || "Assignee"}: </span> {metadatas.assignee}</div>
                        )}
                        {metadatas?.due_date && (
                            <div><span className="font-medium">{translations.dueDate || "Due"}: </span> {formatDate(metadatas.due_date)}</div>
                        )}
                    </div>
                );

            case 'task_deleted':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        <div><span className="font-medium">{translations.task || "Task"}:</span> {metadatas?.deleted_task?.title}</div>
                        <div><span className="font-medium">{translations.status || "Status"}:</span> {metadatas?.deleted_task?.status}</div>
                    </div>
                );

            case 'expense_added':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        {metadatas?.description && (
                            <div><span className="font-medium">{translations.description || "Description"}:</span> {metadatas.description}</div>
                        )}
                        {metadatas?.category && (
                            <div><span className="font-medium">{translations.category || "Category"}:</span> {metadatas.category}</div>
                        )}
                        {metadatas?.amount !== undefined && (
                            <div><span className="font-medium">{translations.amount || "Amount"}:</span> {metadatas.amount}</div>
                        )}
                        {metadatas?.status && (
                            <div><span className="font-medium">{translations.status || "Status"}:</span> {metadatas.status}</div>
                        )}
                    </div>
                );

            case 'expense_deleted':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        {metadatas?.deleted_expense?.amount !== undefined && (
                            <div><span className="font-medium">{translations.amount || "Amount"}:</span> {metadatas.deleted_expense.amount}</div>
                        )}
                        {metadatas?.deleted_expense?.category && (
                            <div><span className="font-medium">{translations.category || "Category"}:</span> {metadatas.deleted_expense.category}</div>
                        )}
                        {metadatas?.deleted_expense?.status && (
                            <div><span className="font-medium">{translations.status || "Status"}:</span> {metadatas.deleted_expense.status}</div>
                        )}
                    </div>
                );

            case 'inventory_added':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        {metadatas?.quantity !== undefined && (
                            <div><span className="font-medium">{translations.quantity || "Quantity"}:</span> {metadatas.quantity} {metadatas?.unit}</div>
                        )}
                        {metadatas?.unit_cost !== undefined && (
                            <div><span className="font-medium">{translations.unitCost || "Unit Cost"}:</span> {metadatas.unit_cost}</div>
                        )}
                        {metadatas?.supplier && (
                            <div><span className="font-medium">{translations.supplier || "Supplier"}:</span> {metadatas.supplier}</div>
                        )}
                        {metadatas?.status && (
                            <div><span className="font-medium">{translations.status || "Status"}:</span> {metadatas.status}</div>
                        )}
                    </div>
                );

            case 'inventory_deleted':
                return (
                    <div className="mt-2 space-y-1 text-xs">
                        {metadatas?.deleted_item?.total !== undefined && (
                            <div><span className="font-medium">{translations.quantity || "Quantity"}:</span> {metadatas.deleted_item.total}</div>
                        )}
                        {metadatas?.deleted_item?.unit_cost !== undefined && (
                            <div><span className="font-medium">{translations.unitCost || "Unit Cost"}:</span> {metadatas.deleted_item.unit_cost}</div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-colors border opacity-100 bg-background"
            )}
        >
            <div className="flex-1 min-w-0">
                {/* Mostrar detalles*/}
                <div className="mt-2">
                    {metadatas?.changes ? renderChanges( metadatas, dict) :
                        renderSpecificDetails( activity_type, metadatas, dict)}
                </div>
            </div>
        </div>
    )
}