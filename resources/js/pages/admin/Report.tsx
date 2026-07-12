import ReportLayout from "@/components/layouts/admin/ReportLayout";

function InventoryReport({ data }: { data: any }) {
    const total = data.baik + data.perluPerawatan + data.rusak;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-up">
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Total Barang</p>
                        <p className="mt-1 text-2xl font-bold">{data.totalItems}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Seluruh inventaris</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Aktif</p>
                        <p className="mt-1 text-2xl font-bold text-success">{data.activeItems}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Barang dalam penggunaan</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Perlu Perawatan</p>
                        <p className="mt-1 text-2xl font-bold text-warning">{data.perluPerawatan}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Memerlukan servis</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Rusak</p>
                        <p className="mt-1 text-2xl font-bold text-error">{data.rusak}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Tidak dapat digunakan</p>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                <div className="card-body">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Kondisi Barang</h3>
                    <div className="mt-4 space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Baik</span>
                                <span className="font-semibold">{data.baik} ({total > 0 ? Math.round(data.baik / total * 100) : 0}%)</span>
                            </div>
                            <progress
                                className="progress progress-success w-full"
                                value={data.baik}
                                max={total || 1}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Perlu Perawatan</span>
                                <span className="font-semibold">{data.perluPerawatan} ({total > 0 ? Math.round(data.perluPerawatan / total * 100) : 0}%)</span>
                            </div>
                            <progress
                                className="progress progress-warning w-full"
                                value={data.perluPerawatan}
                                max={total || 1}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Rusak</span>
                                <span className="font-semibold">{data.rusak} ({total > 0 ? Math.round(data.rusak / total * 100) : 0}%)</span>
                            </div>
                            <progress
                                className="progress progress-error w-full"
                                value={data.rusak}
                                max={total || 1}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                <div className="card-body">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Barang per Kategori</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Kategori</th>
                                    <th className="text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.byCategory.map((c: any, i: number) => (
                                    <tr key={i}>
                                        <td>{c.category}</td>
                                        <td className="text-right font-semibold">{c.total}</td>
                                    </tr>
                                ))}
                                {data.byCategory.length === 0 && (
                                    <tr><td colSpan={2} className="text-center text-base-content/50 py-8">Belum ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FinancialReport({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-right">
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Total Pengadaan</p>
                        <p className="mt-1 text-2xl font-bold">{data.totalProcurements}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Transaksi</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Total Pengeluaran</p>
                        <p className="mt-1 text-2xl font-bold">Rp {data.totalSpending.toLocaleString("id-ID")}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Seluruh pengadaan</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Total Barang</p>
                        <p className="mt-1 text-2xl font-bold">{data.totalQuantity}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Unit dibeli</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Rata-rata Harga</p>
                        <p className="mt-1 text-2xl font-bold">Rp {data.avgUnitPrice.toLocaleString("id-ID")}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Per unit</p>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                <div className="card-body">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Pengeluaran per Bulan</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Bulan</th>
                                    <th className="text-right">Jumlah Barang</th>
                                    <th className="text-right">Total Pengeluaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.spendingByMonth.map((m: any) => (
                                    <tr key={m.month}>
                                        <td className="font-mono text-sm">{m.month}</td>
                                        <td className="text-right">{m.qty}</td>
                                        <td className="text-right font-semibold">Rp {Number(m.total).toLocaleString("id-ID")}</td>
                                    </tr>
                                ))}
                                {data.spendingByMonth.length === 0 && (
                                    <tr><td colSpan={3} className="text-center text-base-content/50 py-8">Belum ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DailyReport({ data }: { data: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-aos="fade-left">
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Pengadaan Hari Ini</p>
                        <p className="mt-1 text-2xl font-bold">{data.procurementsToday}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Transaksi</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Perawatan Hari Ini</p>
                        <p className="mt-1 text-2xl font-bold">{data.maintenanceToday}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Aktivitas servis</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Peminjaman Aktif</p>
                        <p className="mt-1 text-2xl font-bold">{data.activeLoans}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Barang dipinjam</p>
                    </div>
                </div>
                <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                    <div className="card-body p-4 md:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">Pengadaan Terbaru</p>
                        <p className="mt-1 text-2xl font-bold">{data.recentProcurements.length}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Transaksi terakhir</p>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                <div className="card-body">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Ringkasan per Bulan</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Bulan</th>
                                    <th className="text-right">Transaksi</th>
                                    <th className="text-right">Barang Masuk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.summaryByMonth.map((m: any) => (
                                    <tr key={m.month}>
                                        <td className="font-mono text-sm">{m.month}</td>
                                        <td className="text-right">{m.transactions}</td>
                                        <td className="text-right font-semibold">{m.items_in}</td>
                                    </tr>
                                ))}
                                {data.summaryByMonth.length === 0 && (
                                    <tr><td colSpan={3} className="text-center text-base-content/50 py-8">Belum ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
                <div className="card-body">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Pengadaan Terbaru</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Barang</th>
                                    <th className="text-right">Jumlah</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentProcurements.map((p: any, i: number) => (
                                    <tr key={i}>
                                        <td className="font-mono text-xs">{p.date}</td>
                                        <td>{p.itemName}</td>
                                        <td className="text-right">{p.quantity}</td>
                                        <td className="text-right font-semibold">Rp {p.totalPrice.toLocaleString("id-ID")}</td>
                                    </tr>
                                ))}
                                {data.recentProcurements.length === 0 && (
                                    <tr><td colSpan={4} className="text-center text-base-content/50 py-8">Belum ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReportPage({ reportData, tab }: { reportData: any; tab: string }) {
    return (
        <div className="min-h-screen">
            {tab === "barang" && <InventoryReport data={reportData} />}
            {tab === "keuangan" && <FinancialReport data={reportData} />}
            {tab === "harian" && <DailyReport data={reportData} />}
        </div>
    );
}

ReportPage.layout = (page: React.ReactNode) => <ReportLayout>{page}</ReportLayout>;

export default ReportPage;
