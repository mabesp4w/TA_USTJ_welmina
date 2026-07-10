<?php

namespace App\Exports;

use App\Models\MemberMembership;
use App\Models\Procurement;
use App\Models\RegistrationPayment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class KeuanganReportExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    public function __construct(
        private ?string $month = null,
        private string $year = ''
    ) {}

    public function headings(): array
    {
        return [
            'Tanggal',
            'Keterangan',
            'Tipe',
            'Jumlah',
        ];
    }

    public function collection()
    {
        $registrations = RegistrationPayment::with('member')
            ->where('payment_status', 'paid')
            ->when($this->month, fn ($q) => $q->whereMonth('registration_date', $this->month)->whereYear('registration_date', $this->year))
            ->get()
            ->map(fn ($p) => [
                $p->registration_date?->toDateString(),
                'Pendaftaran: '.($p->member?->full_name ?? '-'),
                'Pemasukan',
                (int) ($p->registration_fee + $p->admin_fee),
            ]);

        $memberships = MemberMembership::with('member')
            ->where('payment_status', 'paid')
            ->when($this->month, fn ($q) => $q->whereMonth('paid_at', $this->month)->whereYear('paid_at', $this->year))
            ->get()
            ->map(fn ($m) => [
                $m->paid_at?->toDateString(),
                'Iuran: '.($m->member?->full_name ?? '-').' ('.$m->duration_months.' bln)',
                'Pemasukan',
                (int) ($m->amount + $m->admin_fee),
            ]);

        $expenses = Procurement::with('item')
            ->when($this->month, fn ($q) => $q->whereMonth('procurement_date', $this->month)->whereYear('procurement_date', $this->year))
            ->get()
            ->map(fn ($p) => [
                $p->procurement_date?->toDateString(),
                'Pengadaan: '.($p->item?->item_name ?? '-'),
                'Pengeluaran',
                (int) $p->total_price,
            ]);

        return collect($registrations)
            ->concat($memberships)
            ->concat($expenses)
            ->sortByDesc(fn ($r) => $r[0])
            ->values();
    }
}
