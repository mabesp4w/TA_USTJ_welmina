export type MaintenanceLogItem = {
    id: number;
    inventoryItemId: number;
    itemName: string;
    maintenanceType: string;
    maintenanceDate: string;
    cost: number;
    resultCondition: string;
    performedBy: string;
};

export type Stats = {
    total: number;
    totalCost: number;
    perbaikan: number;
    perawatan: number;
};

export type InventoryItemOption = {
    id: number;
    itemName: string;
};

export type DetailResponse = {
    id: number;
    inventoryItemId: number;
    itemName: string;
    maintenanceType: string;
    maintenanceDate: string;
    cost: number;
    resultCondition: string;
    performedBy: string;
    notes: string | null;
};
