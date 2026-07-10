export type ProcurementItem = {
    id: number;
    procurementCode: string;
    itemName: string;
    supplierName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    procurementDate: string;
};

export type Stats = {
    total: number;
    totalQuantity: number;
    totalSpending: number;
};

export type ItemOption = {
    id: number;
    itemName: string;
};

export type SupplierOption = {
    id: number;
    supplierName: string;
};

export type DetailResponse = {
    id: number;
    procurementCode: string;
    itemId: number;
    itemName: string;
    supplierId: number;
    supplierName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    procurementDate: string;
    notes: string | null;
};
