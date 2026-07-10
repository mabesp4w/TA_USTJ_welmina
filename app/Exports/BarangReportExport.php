<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BarangReportExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    public function __construct(
        private ?string $condition = null
    ) {}

    public function headings(): array
    {
        return [
            'Kode Barang',
            'Nama Barang',
            'Kategori',
            'Stok',
            'Kondisi',
            'Status',
            'Lokasi',
            'Supplier',
        ];
    }

    public function collection()
    {
        return InventoryItem::with(['category', 'supplier'])
            ->when($this->condition, fn ($q) => $q->where('item_condition', $this->condition))
            ->orderBy('item_name')
            ->get()
            ->map(fn ($i) => [
                $i->item_code,
                $i->item_name,
                $i->category?->category_name ?? '-',
                $i->stock,
                $i->item_condition === 'baik' ? 'Baik' : ($i->item_condition === 'perlu_perawatan' ? 'Perlu Perawatan' : 'Rusak'),
                $i->item_status === 'aktif' ? 'Aktif' : 'Tidak Aktif',
                $i->location_name ?? '-',
                $i->supplier?->supplier_name ?? '-',
            ]);
    }
}
