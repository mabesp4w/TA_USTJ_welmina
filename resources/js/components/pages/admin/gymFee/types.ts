export type PackageItem = {
    id: number;
    packageName: string;
    registrationFee: number;
    description: string | null;
    isActive: boolean;
    prices: PriceItem[];
    priceCount: number;
    minPrice: number;
    maxPrice: number;
};

export type PriceItem = {
    id?: number;
    durationMonths: number;
    price: number;
};

export type DetailResponse = {
    id: number;
    packageName: string;
    registrationFee: number;
    description: string | null;
    isActive: boolean;
    prices: PriceItem[];
};

export type Stats = {
    revenue: number;
    paid: number;
    unpaid: number;
    arrears: number;
};
