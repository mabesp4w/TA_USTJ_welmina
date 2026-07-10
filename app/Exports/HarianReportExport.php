<?php

namespace App\Exports;

use App\Models\ActivityLog;
use App\Models\MaintenanceLog;
use App\Models\Member;
use App\Models\MemberMembership;
use App\Models\Procurement;
use App\Models\RegistrationPayment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class HarianReportExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    public function __construct(
        private string $date
    ) {}

    public function headings(): array
    {
        return [
            'Waktu',
            'Keterangan',
            'Tipe',
            'Jumlah',
            'Detail',
        ];
    }

    public function collection()
    {
        $data = [];

        $registrations = RegistrationPayment::with('member')
            ->whereDate('registration_date', $this->date)
            ->get()
            ->map(fn ($p) => [
                $p->registration_date?->toDateString(),
                'Pendaftaran: '.($p->member?->full_name ?? '-'),
                'Pemasukan',
                (int) ($p->registration_fee + $p->admin_fee),
                $p->payment_status === 'paid' ? 'Lunas' : 'Belum Dibayar',
            ]);

        $memberships = MemberMembership::with('member')
            ->whereDate('paid_at', $this->date)
            ->where('payment_status', 'paid')
            ->get()
            ->map(fn ($m) => [
                $m->paid_at?->toDateString(),
                'Iuran: '.($m->member?->full_name ?? '-'),
                'Pemasukan',
                (int) ($m->amount + $m->admin_fee),
                $m->duration_months.' bulan',
            ]);

        $procurements = Procurement::with('item')
            ->whereDate('procurement_date', $this->date)
            ->get()
            ->map(fn ($p) => [
                $p->procurement_date?->toDateString(),
                'Pengadaan: '.($p->item?->item_name ?? '-'),
                'Pengeluaran',
                (int) $p->total_price,
                'Qty: '.$p->quantity,
            ]);

        $maintenances = MaintenanceLog::with('inventoryItem')
            ->whereDate('maintenance_date', $this->date)
            ->get()
            ->map(fn ($m) => [
                $m->maintenance_date?->toDateString(),
                'Perawatan: '.($m->inventoryItem?->item_name ?? '-'),
                'Pengeluaran',
                (int) $m->cost,
                $m->maintenance_type,
            ]);

        $activities = ActivityLog::with('user')
            ->whereDate('activity_time', $this->date)
            ->limit(20)
            ->get()
            ->map(fn ($a) => [
                $a->activity_time?->toDateTimeString(),
                $a->activity_name,
                'Aktivitas',
                0,
                $a->description ?? '-',
            ]);

        $newMembers = Member::whereDate('joined_at', $this->date)->get()
            ->map(fn ($m) => [
                $m->joined_at?->toDateString(),
                'Member Baru: '.$m->full_name,
                'Member',
                0,
                $m->member_code,
            ]);

        return $registrations
            ->concat($memberships)
            ->concat($procurements)
            ->concat($maintenances)
            ->concat($activities)
            ->concat($newMembers)
            ->sortByDesc(fn ($r) => $r[0])
            ->values();
    }
}
