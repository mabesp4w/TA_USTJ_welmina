import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Download, Printer, FileText } from "lucide-react";
import report from "@/routes/pengelola/report";
import PengelolaLayout from "@/components/layouts/pengelola/PengelolaLayout";

const conditionBadge: Record<string, string> = {
    baik: "badge-success",
    perlu_perawatan: "badge-warning",
    rusak: "badge-error",
};

const conditionLabel: Record<string, string> = {
    semua: "Semua Kondisi",
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

const statusLabel: Record<string, string> = {
    aktif: "Aktif",
    tidak_aktif: "Tidak Aktif",
};

const conditionOptions = [
    { value: "", label: "Semua Kondisi" },
    { value: "baik", label: "Baik" },
    { value: "perlu_perawatan", label: "Perlu Perawatan" },
    { value: "rusak", label: "Rusak" },
];

function BarangPage() {
    const { items, stats, condition } = usePage().props as {
        items: any[];
        stats: { total: number; baik: number; perluPerawatan: number; rusak: number };
        condition: string | null;
    };

    const [selectedCondition, setSelectedCondition] = useState(condition ?? "");

    const handleFilter = (value: string) => {
        setSelectedCondition(value);
        router.get(
            report.barang.url(),
            value ? { condition: value } : {},
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const conditionParam = selectedCondition ? { condition: selectedCondition } : {};

    return (
        <PengelolaLayout
            actions={
                <>
                    <a className="btn btn-ghost gap-2" href={report.barang.pdf.url(conditionParam)} target="_blank">
                        <Printer size={18} />
                        Cetak PDF
                    </a>
                    <a className="btn btn-primary gap-2" href={report.barang.excel.url(conditionParam)} target="_blank">
                        <Download size={18} />
                        Export Excel
                    </a>
                </>
            }
        >
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">

            <div className="mb-6 print:hidden">
                <div className="flex flex-wrap gap-3">
                    <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={selectedCondition}
                        onChange={(e) => handleFilter(e.target.value)}
                    >
                        {conditionOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="stats stats-vertical sm:stats-horizontal shadow w-full mb-6 print:border print:border-base-300">
                <div className="stat">
                    <div className="stat-title">Total Barang</div>
                    <div className="stat-value text-lg">{stats.total}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Baik</div>
                    <div className="stat-value text-lg text-success">{stats.baik}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Perlu Perawatan</div>
                    <div className="stat-value text-lg text-warning">{stats.perluPerawatan}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Rusak</div>
                    <div className="stat-value text-lg text-error">{stats.rusak}</div>
                </div>
            </div>

            <div className="card border border-base-300 shadow-sm">
                <div className="card-body p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-4 print:mb-3">
                        <FileText size={18} className="text-base-content/60" />
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                            Daftar Inventaris Barang
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra text-xs">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-base-content/60">
                                    <th>No</th>
                                    <th>Kode</th>
                                    <th>Nama Barang</th>
                                    <th>Kategori</th>
                                    <th className="text-right">Stok</th>
                                    <th>Kondisi</th>
                                    <th>Status</th>
                                    <th>Lokasi</th>
                                    <th>Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-sm text-base-content/50">
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, i) => (
                                        <tr key={item.id}>
                                            <td className="text-base-content/60">{i + 1}</td>
                                            <td className="font-mono">{item.itemCode}</td>
                                            <td className="font-medium text-sm">{item.itemName}</td>
                                            <td>{item.categoryName}</td>
                                            <td className="text-right font-semibold">{item.stock}</td>
                                            <td>
                                                <span className={`badge badge-sm ${conditionBadge[item.itemCondition]}`}>
                                                    {conditionLabel[item.itemCondition]}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${item.itemStatus === "aktif" ? "badge-success" : "badge-error"}`}>
                                                    {statusLabel[item.itemStatus]}
                                                </span>
                                            </td>
                                            <td className="text-base-content/70">{item.locationName ?? "-"}</td>
                                            <td className="text-base-content/70">{item.supplierName ?? "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-[10px] text-center text-base-content/40 print:block hidden">
                Dicetak pada: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
        </div>
    </PengelolaLayout>
    );
}

export default BarangPage;
