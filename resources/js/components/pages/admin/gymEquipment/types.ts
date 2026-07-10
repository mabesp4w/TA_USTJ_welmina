export type CategoryItem = {
    id: number;
    categoryName: string;
    description: string | null;
    image: string | null;
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
    image: string | null;
    imagePath: string | null;
};
