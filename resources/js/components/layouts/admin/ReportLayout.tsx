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

    return (
        <AdminLayout
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
                <div role="tablist" className="tabs tabs-bordered mb-6">
                    {tabs.map((t) => (
                        <a
                            key={t.key}
                            role="tab"
                            className={`tab ${tab === t.key ? "tab-active" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                router.get(
                                    report.url(),
                                    { tab: t.key },
                                    { preserveScroll: true, preserveState: true, replace: true },
                                );
                            }}
                        >
                            {t.label}
                        </a>
                    ))}
                </div>

                {children}
            </div>
        </AdminLayout>
    );
}
