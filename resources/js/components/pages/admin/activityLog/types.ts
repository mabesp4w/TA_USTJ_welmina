export type ActivityLogItem = {
    id: number;
    activityTime: string;
    activityName: string;
    activityType: string;
    description: string | null;
    userName: string;
};

export type Stats = {
    total: number;
    today: number;
    types: Record<string, number>;
};

export type DetailResponse = {
    id: number;
    activityTime: string;
    activityName: string;
    activityType: string;
    description: string | null;
    userName: string;
    referenceTable: string | null;
    referenceId: number | null;
};
