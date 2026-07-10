export type CategoryItem = {
    id: number;
    categoryName: string;
    description: string | null;
    isFitnessTools: boolean;
    itemCount: number;
};

export type Stats = {
    total: number;
    withItems: number;
    empty: number;
};

export type DetailResponse = {
    id: number;
    categoryName: string;
    description: string | null;
    isFitnessTools: boolean;
};
