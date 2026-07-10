export type SupplierItem = {
    id: number;
    supplierName: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    itemCount: number;
};

export type Stats = {
    total: number;
    withItems: number;
};

export type DetailResponse = {
    id: number;
    supplierName: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
};
