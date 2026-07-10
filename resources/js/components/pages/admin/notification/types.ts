export type NotificationItem = {
    id: number;
    title: string;
    message: string;
    notificationType: string;
    isRead: boolean;
    createdAt: string;
};

export type Stats = {
    total: number;
    unread: number;
    recentToday: number;
};

export type DetailResponse = {
    id: number;
    title: string;
    message: string;
    notificationType: string;
    isRead: boolean;
    createdAt: string;
    relatedTable: string | null;
    relatedId: number | null;
    creatorName: string | null;
};
