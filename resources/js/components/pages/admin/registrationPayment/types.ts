export type PaymentItem = {
    id: number;
    memberCode: string;
    memberName: string;
    packageName: string;
    durationMonths: number;
    startDate: string;
    endDate: string;
    registrationDate: string;
    registrationFee: number;
    amount: number;
    adminFee: number;
    totalFee: number;
    paymentMethod: string;
    paymentStatus: string;
    createdBy: string;
};

export type MemberOption = {
    id: number;
    memberCode: string;
    fullName: string;
};

export type PackageOption = {
    id: number;
    packageName: string;
    registrationFee: number;
    prices: { durationMonths: number; price: number }[];
};

export type DetailResponse = {
    id: number;
    memberId: number;
    memberCode: string;
    memberName: string;
    packageId: number;
    packageName: string;
    durationMonths: number;
    startDate: string;
    endDate: string;
    registrationDate: string;
    registrationFee: number;
    amount: number;
    adminFee: number;
    totalFee: number;
    paymentMethod: string;
    paymentStatus: string;
    paidAt: string | null;
    notes: string | null;
    createdBy: string;
    createdAt: string;
};

export type EditPaymentData = {
    id: number;
    memberId: number;
    packageId: number;
    durationMonths: number;
    startDate: string;
    registrationDate: string;
    registrationFee: number;
    amount: number;
    adminFee: number;
    paymentMethod: string;
    paymentStatus: string;
    notes: string | null;
};
