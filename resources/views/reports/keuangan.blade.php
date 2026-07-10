<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin-bottom: 2px; font-size: 16px; }
        .header p { margin: 0; font-size: 11px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 5px 6px; text-align: left; font-size: 10px; }
        th { background: #f0f0f0; font-weight: 600; text-transform: uppercase; font-size: 9px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .stats { margin-bottom: 15px; }
        .stats table { border: none; width: auto; }
        .stats td { border: none; padding: 2px 10px; font-size: 11px; }
        .section-title { font-size: 12px; font-weight: 600; margin: 15px 0 5px; }
        .footer { text-align: center; margin-top: 20px; font-size: 9px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FITNESS CENTER VICCA SERA POLIMAK</h1>
        <p>Sistem Inventaris - Laporan Keuangan</p>
        @if ($month)
        <p>Periode: {{ \Carbon\Carbon::create()->month((int)$month)->locale('id')->translatedFormat('F') }} {{ $year }}</p>
        @else
        <p>Tahun: {{ $year }}</p>
        @endif
    </div>

    <table class="stats">
        <tr>
            <td><strong>Total Pemasukan:</strong> Rp {{ number_format($stats['totalIncome'], 0, ',', '.') }}</td>
            <td><strong>Total Pengeluaran:</strong> Rp {{ number_format($stats['totalExpenses'], 0, ',', '.') }}</td>
            <td><strong>Saldo Bersih:</strong> Rp {{ number_format($stats['netIncome'], 0, ',', '.') }}</td>
        </tr>
    </table>

    <table>
        <tr>
            <td><strong>Pendaftaran:</strong> Rp {{ number_format($stats['registrationIncome'], 0, ',', '.') }} ({{ $stats['registrationCount'] }} transaksi)</td>
        </tr>
        <tr>
            <td><strong>Iuran Member:</strong> Rp {{ number_format($stats['membershipIncome'], 0, ',', '.') }} ({{ $stats['membershipCount'] }} transaksi)</td>
        </tr>
        <tr>
            <td><strong>Pengadaan Barang:</strong> Rp {{ number_format($stats['totalExpenses'], 0, ',', '.') }} ({{ $stats['procurementCount'] }} transaksi)</td>
        </tr>
    </table>

    <div class="section-title">Ringkasan per Bulan</div>
    <table>
        <thead>
            <tr>
                <th>Bulan</th>
                <th class="text-right">Pendaftaran</th>
                <th class="text-right">Iuran</th>
                <th class="text-right">Pemasukan</th>
                <th class="text-right">Pengeluaran</th>
                <th class="text-right">Saldo</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($mergedMonths as $m)
            <tr>
                <td>{{ $m['month'] }}</td>
                <td class="text-right">{{ $m['registration'] ? 'Rp '.number_format($m['registration'], 0, ',', '.') : '-' }}</td>
                <td class="text-right">{{ $m['membership'] ? 'Rp '.number_format($m['membership'], 0, ',', '.') : '-' }}</td>
                <td class="text-right">Rp {{ number_format($m['totalIncome'], 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($m['totalExpense'], 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($m['net'], 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr><td colspan="6" class="text-center">Belum ada data</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">Transaksi Terbaru</div>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th class="text-right">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($recentTransactions as $t)
            <tr>
                <td>{{ $t['date'] }}</td>
                <td>{{ $t['description'] }}</td>
                <td class="text-right">{{ $t['type'] === 'income' ? '+' : '-' }} Rp {{ number_format($t['amount'], 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr><td colspan="3" class="text-center">Belum ada transaksi</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->translatedFormat('l, d F Y') }}
    </div>
</body>
</html>
