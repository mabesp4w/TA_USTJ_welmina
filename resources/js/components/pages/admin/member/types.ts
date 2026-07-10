export type Stat = {
    title: string;
    value: string;
    subtitle: string;
};

export type MemberItem = {
    id: number;
    memberCode: string;
    name: string;
    plan: string;
    period: string;
    status: string;
};

export type PackageOption = {
    id: number;
    packageName: string;
    registrationFee: number;
    prices: { durationMonths: number; price: number }[];
};
