export type InventoryItem = {
    id: number;
    itemCode: string;
    itemName: string;
    categoryName: string;
    stock: number;
    itemCondition: string;
    itemStatus: string;
    locationName: string | null;
    supplierName: string | null;
    imagePath: string | null;
};

export type Stats = {
    total: number;
    baik: number;
    perluPerawatan: number;
    rusak: number;
};

export type CategoryOption = {
    id: number;
    categoryName: string;
};

export type SupplierOption = {
    id: number;
    supplierName: string;
};

export type DetailResponse = {
    id: number;
    itemCode: string;
    itemName: string;
    categoryId: number;
    categoryName: string;
    stock: number;
    itemCondition: string;
    itemStatus: string;
    locationName: string | null;
    supplierId: number | null;
    supplierName: string | null;
    lastServiceDate: string | null;
    imagePath: string | null;
    notes: string | null;
};
