import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Download, Printer, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { report } from "@/routes/admin";
import AdminLayout from "@/components/layouts/admin/AdminLayout";

const months = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

function KeuanganPage() {
    const { stats, incomeByMonth, membershipByMonth, expensesByMonth, recentTransactions, month, year } = usePage().props as {
        stats: {
            totalIncome: number;
            totalExpenses: number;
            netIncome: number;
            registrationIncome: number;
            membershipIncome: number;
            registrationCount: number;
            membershipCount: number;
            procurementCount: number;
        };
        incomeByMonth: { month: string; total: number; transactions: number }[];
        membershipByMonth: { month: string; total: number; transactions: number }[];
        expensesByMonth: { month: string; total: number; transactions: number }[];
        recentTransactions: { date: string; description: string; type: string; amount: number }[];
        month: string | null;
        year: string | number;
    };

    const [selectedMonth, setSelectedMonth] = useState(month ?? "");
    const [selectedYear, setSelectedYear] = useState(String(year));

    const handleFilter = () => {
        router.get(
            report.keuangan.url(),
            { month: selectedMonth || undefined, year: selectedYear || undefined },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const filterParams = { month: selectedMonth || undefined, year: selectedYear || undefined };

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-xl font-bold">Laporan Keuangan</h1>
                    <p className="text-sm text-base-content/60">
                        Ringkasan pemasukan dan pengeluaran
                    </p>
                </div>
                <div className="flex gap-2">
                    <a className="btn btn-ghost gap-2" href={report.keuangan.pdf.url(filterParams)} target="_blank">
                        <Printer size={18} />
                        Cetak PDF
                    </a>
                    <a className="btn btn-primary gap-2" href={report.keuangan.excel.url(filterParams)} target="_blank">
                        <Download size={18} />
                        Export Excel
                    </a>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3 print:hidden">
                <select
                    className="select select-bordered select-sm"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <input
                    type="number"
                    className="input input-bordered input-sm w-24"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    placeholder="Tahun"
                />
                <button className="btn btn-primary btn-sm" onClick={handleFilter}>
                    Terapkan
                </button>
            </div>

            <div className="stats stats-vertical sm:stats-horizontal shadow w-full mb-6 print:border print:border-base-300">
                <div className="stat">
                    <div className="stat-figure text-success">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-title">Total Pemasukan</div>
                    <div className="stat-value text-lg text-success">
                        Rp {stats.totalIncome.toLocaleString("id-ID")}
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-error">
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-title">Total Pengeluaran</div>
                    <div className="stat-value text-lg text-error">
                        Rp {stats.totalExpenses.toLocaleString("id-ID")}
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-info">
                        <Wallet size={24} />
                    </div>
                    <div className="stat-title">Saldo Bersih</div>
                    <div className={`stat-value text-lg ${stats.netIncome >= 0 ? "text-info" : "text-error"}`}>
                        Rp {stats.netIncome.toLocaleString("id-ID")}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6">
                <div className="card border border-base-300 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Pendaftaran
                        </p>
                        <p className="mt-1 text-lg font-bold text-success">
                            Rp {stats.registrationIncome.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-base-content/50">{stats.registrationCount} transaksi</p>
                    </div>
                </div>
                <div className="card border border-base-300 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Iuran Member
                        </p>
                        <p className="mt-1 text-lg font-bold text-success">
                            Rp {stats.membershipIncome.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-base-content/50">{stats.membershipCount} transaksi</p>
                    </div>
                </div>
                <div className="card border border-base-300 shadow-sm">
                    <div className="card-body p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Pengadaan Barang
                        </p>
                        <p className="mt-1 text-lg font-bold text-error">
                            Rp {stats.totalExpenses.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-base-content/50">{stats.procurementCount} transaksi</p>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 shadow-sm mb-6">
                <div className="card-body p-4 md:p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                        Ringkasan per Bulan
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra text-xs">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-base-content/60">
                                    <th>Bulan</th>
                                    <th className="text-right">Pendaftaran</th>
                                    <th className="text-right">Iuran Member</th>
                                    <th className="text-right">Total Pemasukan</th>
                                    <th className="text-right">Pengeluaran</th>
                                    <th className="text-right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const allMonths = new Set([
                                        ...incomeByMonth.map((m: any) => m.month),
                                        ...membershipByMonth.map((m: any) => m.month),
                                        ...expensesByMonth.map((m: any) => m.month),
                                    ]);
                                    const sorted = Array.from(allMonths).sort();
                                    return sorted.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-base-content/50">
                                                Belum ada data
                                            </td>
                                        </tr>
                                    ) : (
                                        sorted.map((m) => {
                                            const inc = incomeByMonth.find((i: any) => i.month === m);
                                            const mem = membershipByMonth.find((i: any) => i.month === m);
                                            const exp = expensesByMonth.find((i: any) => i.month === m);
                                            const totalInc = (inc ? Number(inc.total) : 0) + (mem ? Number(mem.total) : 0);
                                            const totalExp = exp ? Number(exp.total) : 0;
                                            return (
                                                <tr key={m}>
                                                    <td className="font-mono">{m}</td>
                                                    <td className="text-right">
                                                        {inc
                                                            ? `Rp ${Number(inc.total).toLocaleString("id-ID")}`
                                                            : "-"}
                                                    </td>
                                                    <td className="text-right">
                                                        {mem
                                                            ? `Rp ${Number(mem.total).toLocaleString("id-ID")}`
                                                            : "-"}
                                                    </td>
                                                    <td className="text-right font-semibold text-success">
                                                        Rp {totalInc.toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="text-right font-semibold text-error">
                                                        Rp {totalExp.toLocaleString("id-ID")}
                                                    </td>
                                                    <td className={`text-right font-semibold ${totalInc - totalExp >= 0 ? "text-info" : "text-error"}`}>
                                                        Rp {(totalInc - totalExp).toLocaleString("id-ID")}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 shadow-sm">
                <div className="card-body p-4 md:p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                        Transaksi Terbaru
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra text-xs">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-base-content/60">
                                    <th>Tanggal</th>
                                    <th>Keterangan</th>
                                    <th className="text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-12 text-center text-base-content/50">
                                            Belum ada transaksi
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.map((t, i) => (
                                        <tr key={i}>
                                            <td className="font-mono">{t.date}</td>
                                            <td>
                                                <span className="flex items-center gap-2">
                                                    {t.type === "income" ? (
                                                        <TrendingUp size={12} className="text-success" />
                                                    ) : (
                                                        <TrendingDown size={12} className="text-error" />
                                                    )}
                                                    {t.description}
                                                </span>
                                            </td>
                                            <td className={`text-right font-semibold ${t.type === "income" ? "text-success" : "text-error"}`}>
                                                {t.type === "income" ? "+" : "-"}
                                                Rp {t.amount.toLocaleString("id-ID")}
                                            </td>
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
    );
}

KeuanganPage.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default KeuanganPage;
