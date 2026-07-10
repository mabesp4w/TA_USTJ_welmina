export type User = {
    id: number;
    full_name: string;
    username: string;
    email: string | null;
    role: 'administrator' | 'staff' | 'kasir' | 'trainer';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
