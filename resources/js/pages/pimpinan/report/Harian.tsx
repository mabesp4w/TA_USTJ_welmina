import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Download,
    Printer,
    TrendingUp,
    TrendingDown,
    Activity,
    Users,
    Wrench,
    ShoppingCart,
    Calendar,
} from 'lucide-react';
import report from '@/routes/pimpinan/report';
import PimpinanLayout from '@/components/layouts/pimpinan/PimpinanLayout';

const typeLabels: Record<string, string> = {
    tambah: 'Tambah',
    servis: 'Servis',
    pinjam: 'Pinjam',
    kembali: 'Kembali',
    rusak: 'Rusak',
    pengadaan: 'Pengadaan',
    pembayaran: 'Pembayaran',
    pendaftaran: 'Pendaftaran',
    lainnya: 'Lainnya',
};

const conditionLabel: Record<string, string> = {
    baik: 'Baik',
    perlu_perawatan: 'Perlu Perawatan',
    rusak: 'Rusak',
};

function HarianPage() {
    const {
        date,
        stats,
        registrations,
        memberships,
        procurements,
        maintenances,
        activities,
    } = usePage().props as {
        date: string;
        stats: {
            totalIncome: number;
            totalExpenses: number;
            registrations: number;
            memberships: number;
            procurements: number;
            maintenances: number;
            activities: number;
            newMembers: number;
        };
        registrations: {
            id: number;
            time: string;
            memberName: string;
            amount: number;
            status: string;
        }[];
        memberships: {
            id: number;
            time: string;
            memberName: string;
            durationMonths: number;
            amount: number;
        }[];
        procurements: {
            id: number;
            time: string;
            itemName: string;
            quantity: number;
            totalPrice: number;
            code: string;
        }[];
        maintenances: {
            id: number;
            time: string;
            itemName: string;
            type: string;
            cost: number;
        }[];
        activities: {
            id: number;
            time: string;
            name: string;
            type: string;
            description: string | null;
            userName: string;
        }[];
    };

    const [selectedDate, setSelectedDate] = useState(date);

    const handleFilter = () => {
        router.get(
            report.harian.url(),
            { date: selectedDate },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    return (
        <PimpinanLayout
            title="Laporan Harian"
            actions={
                <>
                    <a
                        className="btn gap-2 btn-ghost"
                        href={report.harian.pdf.url({ date: selectedDate })}
                        target="_blank"
                    >
                        <Printer size={18} />
                        Cetak PDF
                    </a>
                    <a
                        className="btn gap-2 btn-primary"
                        href={report.harian.excel.url({ date: selectedDate })}
                        target="_blank"
                    >
                        <Download size={18} />
                        Export Excel
                    </a>
                </>
            }
        >
            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
                    <div className="card" data-aos="fade-up">
                        <div className="card-body gap-6 p-4 md:p-6">
                            <div className="mb-6 flex flex-wrap items-end gap-3 print:hidden">
                                <label className="form-control">
                                    <span className="label-text mb-1 text-xs font-semibold">
                                        Tanggal
                                    </span>
                                    <input
                                        type="date"
                                        className="input-bordered input input-sm"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </label>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleFilter}
                                >
                                    Tampilkan
                                </button>
                            </div>

                            <div className="mb-4">
                                <h2 className="flex items-center gap-2 text-base font-semibold">
                                    <Calendar size={16} className="text-base-content/60" />
                                    Laporan Tanggal:{' '}
                                    {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </h2>
                            </div>

                            <div className="stats mb-6 w-full stats-vertical shadow sm:stats-horizontal print:border print:border-base-300">
                                <div className="stat border-base-300 bg-base-100/70">
                                    <div className="stat-figure text-success">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="stat-title">Pemasukan</div>
                                    <div className="stat-value text-lg text-success">
                                        Rp {stats.totalIncome.toLocaleString('id-ID')}
                                    </div>
                                    <div className="stat-desc">
                                        {stats.registrations + stats.memberships} transaksi
                                    </div>
                                </div>
                                <div className="stat border-base-300 bg-base-100/70">
                                    <div className="stat-figure text-error">
                                        <TrendingDown size={20} />
                                    </div>
                                    <div className="stat-title">Pengeluaran</div>
                                    <div className="stat-value text-lg text-error">
                                        Rp {stats.totalExpenses.toLocaleString('id-ID')}
                                    </div>
                                    <div className="stat-desc">
                                        {stats.procurements + stats.maintenances} transaksi
                                    </div>
                                </div>
                                <div className="stat border-base-300 bg-base-100/70">
                                    <div className="stat-figure text-info">
                                        <Activity size={20} />
                                    </div>
                                    <div className="stat-title">Aktivitas</div>
                                    <div className="stat-value text-lg text-info">
                                        {stats.activities}
                                    </div>
                                    <div className="stat-desc">Riwayat aktivitas</div>
                                </div>
                                <div className="stat border-base-300 bg-base-100/70">
                                    <div className="stat-figure text-secondary">
                                        <Users size={20} />
                                    </div>
                                    <div className="stat-title">Member Baru</div>
                                    <div className="stat-value text-lg text-secondary-content">
                                        {stats.newMembers}
                                    </div>
                                    <div className="stat-desc">Pendaftaran hari ini</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="card border border-base-300 shadow-sm bg-base-100/70">
                                    <div className="card-body p-4 md:p-5">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70 uppercase">
                                            <TrendingUp size={14} className="text-success" />
                                            Pendaftaran Member
                                        </h3>
                                        {registrations.length === 0 ? (
                                            <p className="mt-4 py-8 text-center text-sm text-base-content/50">
                                                Tidak ada pendaftaran
                                            </p>
                                        ) : (
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="table table-xs">
                                                    <thead>
                                                        <tr className="text-[10px] tracking-wider text-base-content/60 uppercase">
                                                            <th>Member</th>
                                                            <th className="text-right">Total</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {registrations.map((r) => (
                                                            <tr key={r.id}>
                                                                <td className="font-medium">{r.memberName}</td>
                                                                <td className="text-right font-semibold">
                                                                    Rp {r.amount.toLocaleString('id-ID')}
                                                                </td>
                                                                <td>
                                                                    <span className={`badge badge-sm ${r.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                                                                        {r.status === 'paid' ? 'Lunas' : 'Belum'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card border border-base-300 shadow-sm bg-base-100/70">
                                    <div className="card-body p-4 md:p-5">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70 uppercase">
                                            <TrendingUp size={14} className="text-success" />
                                            Pembayaran Iuran
                                        </h3>
                                        {memberships.length === 0 ? (
                                            <p className="mt-4 py-8 text-center text-sm text-base-content/50">
                                                Tidak ada pembayaran iuran
                                            </p>
                                        ) : (
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="table table-xs">
                                                    <thead>
                                                        <tr className="text-[10px] tracking-wider text-base-content/60 uppercase">
                                                            <th>Member</th>
                                                            <th className="text-right">Durasi</th>
                                                            <th className="text-right">Jumlah</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {memberships.map((m) => (
                                                            <tr key={m.id}>
                                                                <td className="font-medium">{m.memberName}</td>
                                                                <td className="text-right">{m.durationMonths} bln</td>
                                                                <td className="text-right font-semibold">
                                                                    Rp {m.amount.toLocaleString('id-ID')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card border border-base-300 shadow-sm bg-base-100/70">
                                    <div className="card-body p-4 md:p-5">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70 uppercase">
                                            <ShoppingCart size={14} className="text-error" />
                                            Pengadaan Barang
                                        </h3>
                                        {procurements.length === 0 ? (
                                            <p className="mt-4 py-8 text-center text-sm text-base-content/50">
                                                Tidak ada pengadaan
                                            </p>
                                        ) : (
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="table table-xs">
                                                    <thead>
                                                        <tr className="text-[10px] tracking-wider text-base-content/60 uppercase">
                                                            <th>Kode</th>
                                                            <th>Barang</th>
                                                            <th className="text-right">Qty</th>
                                                            <th className="text-right">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {procurements.map((p) => (
                                                            <tr key={p.id}>
                                                                <td className="font-mono text-[10px]">{p.code}</td>
                                                                <td>{p.itemName}</td>
                                                                <td className="text-right">{p.quantity}</td>
                                                                <td className="text-right font-semibold">
                                                                    Rp {p.totalPrice.toLocaleString('id-ID')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card border border-base-300 shadow-sm bg-base-100/70">
                                    <div className="card-body p-4 md:p-5">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70 uppercase">
                                            <Wrench size={14} className="text-warning" />
                                            Perawatan Barang
                                        </h3>
                                        {maintenances.length === 0 ? (
                                            <p className="mt-4 py-8 text-center text-sm text-base-content/50">
                                                Tidak ada perawatan
                                            </p>
                                        ) : (
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="table table-xs">
                                                    <thead>
                                                        <tr className="text-[10px] tracking-wider text-base-content/60 uppercase">
                                                            <th>Barang</th>
                                                            <th>Tipe</th>
                                                            <th className="text-right">Biaya</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {maintenances.map((m) => (
                                                            <tr key={m.id}>
                                                                <td>{m.itemName}</td>
                                                                <td>{conditionLabel[m.type] ?? m.type}</td>
                                                                <td className="text-right font-semibold">
                                                                    Rp {m.cost.toLocaleString('id-ID')}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card mt-6 border border-base-300 shadow-sm bg-base-100/70">
                                <div className="card-body p-4 md:p-5">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-base-content/70 uppercase">
                                        <Activity size={14} />
                                        Riwayat Aktivitas
                                    </h3>
                                    {activities.length === 0 ? (
                                        <p className="mt-4 py-8 text-center text-sm text-base-content/50">
                                            Tidak ada aktivitas
                                        </p>
                                    ) : (
                                        <div className="mt-3 overflow-x-auto">
                                            <table className="table table-zebra table-xs">
                                                <thead>
                                                    <tr className="text-[10px] tracking-wider text-base-content/60 uppercase">
                                                        <th>Waktu</th>
                                                        <th>Aktivitas</th>
                                                        <th>Tipe</th>
                                                        <th>Deskripsi</th>
                                                        <th>Oleh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {activities.map((a) => (
                                                        <tr key={a.id}>
                                                            <td className="font-mono text-[10px] whitespace-nowrap">
                                                                {a.time}
                                                            </td>
                                                            <td className="font-medium">{a.name}</td>
                                                            <td>
                                                                <span
                                                                    className={`badge badge-sm ${a.type === 'tambah' || a.type === 'pembayaran' || a.type === 'pendaftaran' ? 'badge-success' : a.type === 'servis' ? 'badge-warning' : a.type === 'rusak' ? 'badge-error' : 'badge-info'}`}
                                                                >
                                                                    {typeLabels[a.type] ?? a.type}
                                                                </span>
                                                            </td>
                                                            <td className="max-w-xs truncate text-base-content/70">
                                                                {a.description ?? '-'}
                                                            </td>
                                                            <td>{a.userName}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="mt-6 hidden text-center text-[10px] text-base-content/40 print:block">
                                Dicetak pada:{' '}
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PimpinanLayout>
    );
}

export default HarianPage;
