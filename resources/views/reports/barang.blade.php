<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Barang</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h2 { text-align: center; margin-bottom: 4px; }
        h4 { text-align: center; margin-top: 0; font-weight: normal; color: #666; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin-bottom: 2px; font-size: 16px; }
        .header p { margin: 0; font-size: 11px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 5px 6px; text-align: left; font-size: 10px; }
        th { background: #f0f0f0; font-weight: 600; text-transform: uppercase; font-size: 9px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .stats { margin-bottom: 15px; }
        .stats table { border: none; }
        .stats td { border: none; padding: 3px 10px; font-size: 11px; }
        .footer { text-align: center; margin-top: 20px; font-size: 9px; color: #999; }
        .badge { padding: 1px 6px; border-radius: 3px; font-size: 9px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FITNESS CENTER VICCA SERA POLIMAK</h1>
        <p>Sistem Inventaris - Laporan Barang</p>
        <p>{{ $condition ? 'Filter Kondisi: ' . ucfirst(str_replace('_', ' ', $condition)) : 'Semua Kondisi' }}</p>
    </div>

    <table class="stats">
        <tr>
            <td><strong>Total Barang:</strong> {{ $stats['total'] }}</td>
            <td><strong>Baik:</strong> {{ $stats['baik'] }}</td>
            <td><strong>Perlu Perawatan:</strong> {{ $stats['perluPerawatan'] }}</td>
            <td><strong>Rusak:</strong> {{ $stats['rusak'] }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th class="text-right">Stok</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>Lokasi</th>
                <th>Supplier</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $i => $item)
            <tr>
                <td class="text-center">{{ $i + 1 }}</td>
                <td>{{ $item['itemCode'] }}</td>
                <td>{{ $item['itemName'] }}</td>
                <td>{{ $item['categoryName'] }}</td>
                <td class="text-right">{{ $item['stock'] }}</td>
                <td>{{ $item['itemCondition'] === 'baik' ? 'Baik' : ($item['itemCondition'] === 'perlu_perawatan' ? 'Perlu Perawatan' : 'Rusak') }}</td>
                <td>{{ $item['itemStatus'] === 'aktif' ? 'Aktif' : 'Tidak Aktif' }}</td>
                <td>{{ $item['locationName'] ?? '-' }}</td>
                <td>{{ $item['supplierName'] ?? '-' }}</td>
            </tr>
            @endforeach
            @if (count($items) === 0)
            <tr><td colspan="9" class="text-center">Tidak ada data</td></tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        Dicetak pada: {{ now()->locale('id')->translatedFormat('l, d F Y') }}
    </div>
</body>
</html>
