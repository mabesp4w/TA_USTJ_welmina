import React from "react";
import { Printer, Download } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import { report } from "@/routes/admin";
import AdminLayout from "./AdminLayout";

export default function ReportLayout({ children }: { children: React.ReactNode }) {
    const { tab } = usePage<{ tab: string }>().props;
    const tabs = [
        { key: "barang", label: "Laporan Barang" },
        { key: "keuangan", label: "Laporan Keuangan" },
        { key: "harian", label: "Laporan Harian" },
    ];

    const handleTabChange = (key: string) => {
        if (key === tab) return;
        router.get(
            report.url(),
            { tab: key },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout
            title="Laporan"
            actions={
                <>
                    <button
                        className="btn btn-ghost gap-2"
                        onClick={() => window.print()}
                    >
                        <Printer size={18} />
                        Cetak PDF
                    </button>
                    <button
                        className="btn btn-primary gap-2"
                        onClick={() => {
                            toast.success("Fitur export Excel akan segera tersedia");
                        }}
                    >
                        <Download size={18} />
                        Export Excel
                    </button>
                </>
            }
        >
            <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                <div className="tabs tabs-lift" data-aos="fade-up">
                    {tabs.map((t) => (
                        <React.Fragment key={t.key}>
                            <label className="tab">
                                <input
                                    type="radio"
                                    name="report_tabs"
                                    defaultChecked={tab === t.key}
                                    onChange={() => handleTabChange(t.key)}
                                />
                                {t.label}
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                {tab === t.key ? children : null}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
