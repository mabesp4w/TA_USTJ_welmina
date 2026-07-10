<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Harian</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin-bottom: 2px; font-size: 16px; }
        .header p { margin: 0; font-size: 11px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
        th, td { border: 1px solid #ccc; padding: 4px 5px; text-align: left; font-size: 9px; }
        th { background: #f0f0f0; font-weight: 600; text-transform: uppercase; font-size: 8px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .stats { margin-bottom: 12px; }
        .stats table { border: none; }
        .stats td { border: none; padding: 2px 10px; font-size: 10px; }
        .section-title { font-size: 11px; font-weight: 600; margin: 12px 0 4px; padding: 3px 0; border-bottom: 1px solid #ccc; }
        .footer { text-align: center; margin-top: 15px; font-size: 8px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FITNESS CENTER VICCA SERA POLIMAK</h1>
        <p>Sistem Inventaris - Laporan Harian</p>
        <p>{{ \Carbon\Carbon::parse($date)->locale('id')->translatedFormat('l, d F Y') }}</p>
    </div>

    <table class="stats">
        <tr>
            <td><strong>Pemasukan:</strong> Rp {{ number_format($stats['totalIncome'], 0, ',', '.') }}</td>
            <td><strong>Pengeluaran:</strong> Rp {{ number_format($stats['totalExpenses'], 0, ',', '.') }}</td>
            <td><strong>Aktivitas:</strong> {{ $stats['activities'] }}</td>
            <td><strong>Member Baru:</strong> {{ $stats['newMembers'] }}</td>
        </tr>
    </table>

    @if (count($registrations) > 0)
    <div class="section-title">Pendaftaran Member</div>
    <table>
        <thead><tr><th>Member</th><th class="text-right">Total</th><th>Status</th></tr></thead>
        <tbody>
            @foreach ($registrations as $r)
            <tr>
                <td>{{ $r['memberName'] }}</td>
                <td class="text-right">Rp {{ number_format($r['amount'], 0, ',', '.') }}</td>
                <td>{{ $r['status'] === 'paid' ? 'Lunas' : 'Belum' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if (count($memberships) > 0)
    <div class="section-title">Pembayaran Iuran</div>
    <table>
        <thead><tr><th>Member</th><th class="text-right">Durasi</th><th class="text-right">Jumlah</th></tr></thead>
        <tbody>
            @foreach ($memberships as $m)
            <tr>
                <td>{{ $m['memberName'] }}</td>
                <td class="text-right">{{ $m['durationMonths'] }} bln</td>
                <td class="text-right">Rp {{ number_format($m['amount'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if (count($procurements) > 0)
    <div class="section-title">Pengadaan Barang</div>
    <table>
        <thead><tr><th>Kode</th><th>Barang</th><th class="text-right">Qty</th><th class="text-right">Total</th></tr></thead>
        <tbody>
            @foreach ($procurements as $p)
            <tr>
                <td>{{ $p['code'] }}</td>
                <td>{{ $p['itemName'] }}</td>
                <td class="text-right">{{ $p['quantity'] }}</td>
                <td class="text-right">Rp {{ number_format($p['totalPrice'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if (count($maintenances) > 0)
    <div class="section-title">Perawatan Barang</div>
    <table>
        <thead><tr><th>Barang</th><th>Tipe</th><th class="text-right">Biaya</th></tr></thead>
        <tbody>
            @foreach ($maintenances as $m)
            <tr>
                <td>{{ $m['itemName'] }}</td>
                <td>{{ $m['type'] === 'baik' ? 'Baik' : ($m['type'] === 'perlu_perawatan' ? 'Perlu Perawatan' : 'Rusak') }}</td>
                <td class="text-right">Rp {{ number_format($m['cost'], 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if (count($activities) > 0)
    <div class="section-title">Riwayat Aktivitas</div>
    <table>
        <thead><tr><th>Waktu</th><th>Aktivitas</th><th>Tipe</th><th>Deskripsi</th><th>Oleh</th></tr></thead>
        <tbody>
            @foreach ($activities as $a)
            <tr>
                <td>{{ $a['time'] }}</td>
                <td>{{ $a['name'] }}</td>
                <td>{{ $a['type'] }}</td>
                <td>{{ $a['description'] ?? '-' }}</td>
                <td>{{ $a['userName'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->translatedFormat('l, d F Y') }}
    </div>
</body>
</html>
