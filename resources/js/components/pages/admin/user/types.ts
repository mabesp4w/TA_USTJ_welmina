export type UserItem = {
    id: number;
    fullName: string;
    username: string;
    email: string | null;
    role: string;
    isActive: boolean;
};

export type Stats = {
    total: number;
    active: number;
    roles: Record<string, number>;
};

export type DetailResponse = {
    id: number;
    fullName: string;
    username: string;
    email: string | null;
    role: string;
    isActive: boolean;
};
