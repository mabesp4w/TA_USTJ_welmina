<?php

namespace App\Http\Controllers\Admin;

use App\Exports\BarangReportExport;
use App\Exports\HarianReportExport;
use App\Exports\KeuanganReportExport;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\InventoryItem;
use App\Models\InventoryLoan;
use App\Models\MaintenanceLog;
use App\Models\Member;
use App\Models\MemberMembership;
use App\Models\Procurement;
use App\Models\RegistrationPayment;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'barang');

        $data = match ($tab) {
            'barang' => $this->inventoryReport(),
            'keuangan' => $this->financialReport(),
            'harian' => $this->dailyReport(),
            default => $this->inventoryReport(),
        };

        return Inertia::render('admin/Report', [
            'tab' => $tab,
            'reportData' => $data,
        ]);
    }

    public function barang(Request $request): Response
    {
        $condition = $request->query('condition');

        $items = InventoryItem::with(['category', 'supplier'])
            ->when($condition, fn ($q, $c) => $q->where('item_condition', $c))
            ->orderBy('item_name')
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'itemCode' => $i->item_code,
                'itemName' => $i->item_name,
                'categoryName' => $i->category?->category_name ?? '-',
                'stock' => $i->stock,
                'itemCondition' => $i->item_condition,
                'itemStatus' => $i->item_status,
                'locationName' => $i->location_name,
                'supplierName' => $i->supplier?->supplier_name ?? '-',
                'lastServiceDate' => $i->last_service_date?->toDateString(),
                'notes' => $i->notes,
            ]);

        $stats = [
            'total' => $items->count(),
            'baik' => $items->where('itemCondition', 'baik')->count(),
            'perluPerawatan' => $items->where('itemCondition', 'perlu_perawatan')->count(),
            'rusak' => $items->where('itemCondition', 'rusak')->count(),
        ];

        return $this->inertia('admin/report/Barang', [
            'items' => $items,
            'stats' => $stats,
            'condition' => $condition,
        ]);
    }

    public function keuangan(Request $request): Response
    {
        $month = $request->query('month');
        $year = $request->query('year', now()->year);

        $registrationQuery = RegistrationPayment::where('payment_status', 'paid');
        $membershipQuery = MemberMembership::where('payment_status', 'paid');

        if ($month) {
            $registrationQuery->whereMonth('registration_date', $month)->whereYear('registration_date', $year);
            $membershipQuery->whereMonth('paid_at', $month)->whereYear('paid_at', $year);
        }

        $totalRegistrationIncome = (int) $registrationQuery->sum('registration_fee');
        $totalRegistrationAdmin = (int) $registrationQuery->sum('admin_fee');
        $totalMembershipIncome = (int) $membershipQuery->sum('amount');
        $totalMembershipAdmin = (int) $membershipQuery->sum('admin_fee');
        $totalIncome = $totalRegistrationIncome + $totalRegistrationAdmin + $totalMembershipIncome + $totalMembershipAdmin;

        $procurementQuery = Procurement::query();
        if ($month) {
            $procurementQuery->whereMonth('procurement_date', $month)->whereYear('procurement_date', $year);
        }
        $totalExpenses = (int) $procurementQuery->sum('total_price');

        $registrationRegistrationsQuery = RegistrationPayment::query();
        $membershipRegistrationsQuery = MemberMembership::query();
        $procurementRegistrationsQuery = Procurement::query();
        if ($month) {
            $registrationRegistrationsQuery->whereMonth('registration_date', $month)->whereYear('registration_date', $year);
            $membershipRegistrationsQuery->whereMonth('paid_at', $month)->whereYear('paid_at', $year);
            $procurementRegistrationsQuery->whereMonth('procurement_date', $month)->whereYear('procurement_date', $year);
        }
        $registrationCount = $registrationRegistrationsQuery->count();
        $membershipCount = $membershipRegistrationsQuery->count();
        $procurementCount = $procurementRegistrationsQuery->count();

        $incomeByMonth = RegistrationPayment::selectRaw(
            "DATE_FORMAT(registration_date, '%Y-%m') as month, sum(registration_fee + admin_fee) as total, count(*) as transactions"
        )
            ->where('payment_status', 'paid')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $membershipByMonth = MemberMembership::selectRaw(
            "DATE_FORMAT(paid_at, '%Y-%m') as month, sum(amount + admin_fee) as total, count(*) as transactions"
        )
            ->where('payment_status', 'paid')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $expensesByMonth = Procurement::selectRaw(
            "DATE_FORMAT(procurement_date, '%Y-%m') as month, sum(total_price) as total, count(*) as transactions"
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $recentTransactions = RegistrationPayment::with('member')
            ->where('payment_status', 'paid')
            ->orderByDesc('registration_date')
            ->limit(10)
            ->get()
            ->map(fn ($p) => [
                'date' => $p->registration_date?->toDateString(),
                'description' => 'Pendaftaran: '.($p->member?->full_name ?? '-'),
                'type' => 'income',
                'amount' => (int) ($p->registration_fee + $p->admin_fee),
            ]);

        $recentMemberships = MemberMembership::with('member')
            ->where('payment_status', 'paid')
            ->orderByDesc('paid_at')
            ->limit(10)
            ->get()
            ->map(fn ($m) => [
                'date' => $m->paid_at?->toDateString(),
                'description' => 'Iuran: '.($m->member?->full_name ?? '-').' ('.$m->duration_months.' bln)',
                'type' => 'income',
                'amount' => (int) ($m->amount + $m->admin_fee),
            ]);

        $recentExpenses = Procurement::with('item')
            ->orderByDesc('procurement_date')
            ->limit(10)
            ->get()
            ->map(fn ($p) => [
                'date' => $p->procurement_date?->toDateString(),
                'description' => 'Pengadaan: '.($p->item?->item_name ?? '-'),
                'type' => 'expense',
                'amount' => (int) $p->total_price,
            ]);

        $merged = collect($recentTransactions)
            ->concat($recentMemberships)
            ->concat($recentExpenses)
            ->sortByDesc('date')
            ->take(10)
            ->values();

        return $this->inertia('admin/report/Keuangan', [
            'stats' => [
                'totalIncome' => $totalIncome,
                'totalExpenses' => $totalExpenses,
                'netIncome' => $totalIncome - $totalExpenses,
                'registrationIncome' => $totalRegistrationIncome + $totalRegistrationAdmin,
                'membershipIncome' => $totalMembershipIncome + $totalMembershipAdmin,
                'registrationCount' => $registrationCount,
                'membershipCount' => $membershipCount,
                'procurementCount' => $procurementCount,
            ],
            'incomeByMonth' => $incomeByMonth,
            'membershipByMonth' => $membershipByMonth,
            'expensesByMonth' => $expensesByMonth,
            'recentTransactions' => $merged,
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function harian(Request $request): Response
    {
        $date = $request->query('date', now()->toDateString());

        $registrations = RegistrationPayment::with('member')
            ->whereDate('registration_date', $date)
            ->orderBy('registration_date')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'time' => $p->registration_date?->toDateString(),
                'memberName' => $p->member?->full_name ?? '-',
                'amount' => (int) ($p->registration_fee + $p->admin_fee),
                'status' => $p->payment_status,
            ]);

        $memberships = MemberMembership::with('member')
            ->whereDate('paid_at', $date)
            ->where('payment_status', 'paid')
            ->orderBy('paid_at')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'time' => $m->paid_at?->toDateString(),
                'memberName' => $m->member?->full_name ?? '-',
                'durationMonths' => $m->duration_months,
                'amount' => (int) ($m->amount + $m->admin_fee),
            ]);

        $procurements = Procurement::with('item')
            ->whereDate('procurement_date', $date)
            ->orderBy('procurement_date')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'time' => $p->procurement_date?->toDateString(),
                'itemName' => $p->item?->item_name ?? '-',
                'quantity' => $p->quantity,
                'totalPrice' => (int) $p->total_price,
                'code' => $p->procurement_code,
            ]);

        $maintenances = MaintenanceLog::with('inventoryItem')
            ->whereDate('maintenance_date', $date)
            ->orderBy('maintenance_date')
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'time' => $m->maintenance_date?->toDateString(),
                'itemName' => $m->inventoryItem?->item_name ?? '-',
                'type' => $m->maintenance_type,
                'cost' => (int) $m->cost,
            ]);

        $activities = ActivityLog::with('user')
            ->whereDate('activity_time', $date)
            ->orderByDesc('activity_time')
            ->limit(20)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'time' => $a->activity_time?->toDateTimeString(),
                'name' => $a->activity_name,
                'type' => $a->activity_type,
                'description' => $a->description,
                'userName' => $a->user?->full_name ?? '-',
            ]);

        $newMembers = Member::whereDate('joined_at', $date)->count();

        $totalIncome = $registrations->sum('amount') + $memberships->sum('amount');
        $totalExpenses = $procurements->sum('totalPrice') + $maintenances->sum('cost');

        return $this->inertia('admin/report/Harian', [
            'date' => $date,
            'stats' => [
                'totalIncome' => $totalIncome,
                'totalExpenses' => $totalExpenses,
                'registrations' => $registrations->count(),
                'memberships' => $memberships->count(),
                'procurements' => $procurements->count(),
                'maintenances' => $maintenances->count(),
                'activities' => $activities->count(),
                'newMembers' => $newMembers,
            ],
            'registrations' => $registrations,
            'memberships' => $memberships,
            'procurements' => $procurements,
            'maintenances' => $maintenances,
            'activities' => $activities,
        ]);
    }

    public function barangPdf(Request $request)
    {
        $condition = $request->query('condition');

        $items = InventoryItem::with(['category', 'supplier'])
            ->when($condition, fn ($q, $c) => $q->where('item_condition', $c))
            ->orderBy('item_name')
            ->get()
            ->map(fn ($i) => [
                'itemCode' => $i->item_code,
                'itemName' => $i->item_name,
                'categoryName' => $i->category?->category_name ?? '-',
                'stock' => $i->stock,
                'itemCondition' => $i->item_condition,
                'itemStatus' => $i->item_status,
                'locationName' => $i->location_name,
                'supplierName' => $i->supplier?->supplier_name ?? '-',
            ]);

        $stats = [
            'total' => $items->count(),
            'baik' => $items->where('itemCondition', 'baik')->count(),
            'perluPerawatan' => $items->where('itemCondition', 'perlu_perawatan')->count(),
            'rusak' => $items->where('itemCondition', 'rusak')->count(),
        ];

        $html = View::make('reports.barang', [
            'items' => $items,
            'stats' => $stats,
            'condition' => $condition,
        ])->render();

        $dompdf = new Dompdf;
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-barang.pdf"',
        ]);
    }

    public function barangExcel(Request $request)
    {
        $condition = $request->query('condition');

        return Excel::download(
            new BarangReportExport($condition),
            'laporan-barang.xlsx'
        );
    }

    public function keuanganPdf(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year', now()->year);

        $registrationQuery = RegistrationPayment::where('payment_status', 'paid');
        $membershipQuery = MemberMembership::where('payment_status', 'paid');

        if ($month) {
            $registrationQuery->whereMonth('registration_date', $month)->whereYear('registration_date', $year);
            $membershipQuery->whereMonth('paid_at', $month)->whereYear('paid_at', $year);
        }

        $totalRegistrationIncome = (int) $registrationQuery->sum('registration_fee');
        $totalRegistrationAdmin = (int) $registrationQuery->sum('admin_fee');
        $totalMembershipIncome = (int) $membershipQuery->sum('amount');
        $totalMembershipAdmin = (int) $membershipQuery->sum('admin_fee');
        $totalIncome = $totalRegistrationIncome + $totalRegistrationAdmin + $totalMembershipIncome + $totalMembershipAdmin;

        $procurementQuery = Procurement::query();
        if ($month) {
            $procurementQuery->whereMonth('procurement_date', $month)->whereYear('procurement_date', $year);
        }
        $totalExpenses = (int) $procurementQuery->sum('total_price');

        $registrationCount = RegistrationPayment::where('payment_status', 'paid')
            ->when($month, fn ($q) => $q->whereMonth('registration_date', $month)->whereYear('registration_date', $year))
            ->count();
        $membershipCount = MemberMembership::where('payment_status', 'paid')
            ->when($month, fn ($q) => $q->whereMonth('paid_at', $month)->whereYear('paid_at', $year))
            ->count();
        $procurementCount = Procurement::query()
            ->when($month, fn ($q) => $q->whereMonth('procurement_date', $month)->whereYear('procurement_date', $year))
            ->count();

        $incomeByMonth = RegistrationPayment::selectRaw(
            "DATE_FORMAT(registration_date, '%Y-%m') as month, sum(registration_fee + admin_fee) as total"
        )
            ->where('payment_status', 'paid')
            ->groupBy('month')->orderBy('month')->get();

        $membershipByMonth = MemberMembership::selectRaw(
            "DATE_FORMAT(paid_at, '%Y-%m') as month, sum(amount + admin_fee) as total"
        )
            ->where('payment_status', 'paid')
            ->groupBy('month')->orderBy('month')->get();

        $expensesByMonth = Procurement::selectRaw(
            "DATE_FORMAT(procurement_date, '%Y-%m') as month, sum(total_price) as total"
        )
            ->groupBy('month')->orderBy('month')->get();

        $allMonths = collect($incomeByMonth)->pluck('month')
            ->merge(collect($membershipByMonth)->pluck('month'))
            ->merge(collect($expensesByMonth)->pluck('month'))
            ->unique()->sort()->values();

        $mergedMonths = $allMonths->map(fn ($m) => [
            'month' => $m,
            'registration' => (int) (collect($incomeByMonth)->firstWhere('month', $m)?->total ?? 0),
            'membership' => (int) (collect($membershipByMonth)->firstWhere('month', $m)?->total ?? 0),
            'totalIncome' => (int) (collect($incomeByMonth)->firstWhere('month', $m)?->total ?? 0) + (int) (collect($membershipByMonth)->firstWhere('month', $m)?->total ?? 0),
            'totalExpense' => (int) (collect($expensesByMonth)->firstWhere('month', $m)?->total ?? 0),
            'net' => (int) (collect($incomeByMonth)->firstWhere('month', $m)?->total ?? 0) + (int) (collect($membershipByMonth)->firstWhere('month', $m)?->total ?? 0) - (int) (collect($expensesByMonth)->firstWhere('month', $m)?->total ?? 0),
        ]);

        $recentTransactions = collect(
            RegistrationPayment::with('member')->where('payment_status', 'paid')->orderByDesc('registration_date')->limit(10)->get()
                ->map(fn ($p) => ['date' => $p->registration_date?->toDateString(), 'description' => 'Pendaftaran: '.($p->member?->full_name ?? '-'), 'type' => 'income', 'amount' => (int) ($p->registration_fee + $p->admin_fee)])
        )->concat(
            MemberMembership::with('member')->where('payment_status', 'paid')->orderByDesc('paid_at')->limit(10)->get()
                ->map(fn ($m) => ['date' => $m->paid_at?->toDateString(), 'description' => 'Iuran: '.($m->member?->full_name ?? '-'), 'type' => 'income', 'amount' => (int) ($m->amount + $m->admin_fee)])
        )->concat(
            Procurement::with('item')->orderByDesc('procurement_date')->limit(10)->get()
                ->map(fn ($p) => ['date' => $p->procurement_date?->toDateString(), 'description' => 'Pengadaan: '.($p->item?->item_name ?? '-'), 'type' => 'expense', 'amount' => (int) $p->total_price])
        )->sortByDesc('date')->take(10)->values();

        $stats = [
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'netIncome' => $totalIncome - $totalExpenses,
            'registrationIncome' => $totalRegistrationIncome + $totalRegistrationAdmin,
            'membershipIncome' => $totalMembershipIncome + $totalMembershipAdmin,
            'registrationCount' => $registrationCount,
            'membershipCount' => $membershipCount,
            'procurementCount' => $procurementCount,
        ];

        $html = View::make('reports.keuangan', [
            'stats' => $stats,
            'mergedMonths' => $mergedMonths,
            'recentTransactions' => $recentTransactions,
            'month' => $month,
            'year' => $year,
        ])->render();

        $dompdf = new Dompdf;
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-keuangan.pdf"',
        ]);
    }

    public function keuanganExcel(Request $request)
    {
        $month = $request->query('month');
        $year = $request->query('year', now()->year);

        return Excel::download(
            new KeuanganReportExport($month, $year),
            'laporan-keuangan.xlsx'
        );
    }

    public function harianPdf(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $registrations = RegistrationPayment::with('member')
            ->whereDate('registration_date', $date)->orderBy('registration_date')->get()
            ->map(fn ($p) => ['memberName' => $p->member?->full_name ?? '-', 'amount' => (int) ($p->registration_fee + $p->admin_fee), 'status' => $p->payment_status]);

        $memberships = MemberMembership::with('member')
            ->whereDate('paid_at', $date)->where('payment_status', 'paid')->orderBy('paid_at')->get()
            ->map(fn ($m) => ['memberName' => $m->member?->full_name ?? '-', 'durationMonths' => $m->duration_months, 'amount' => (int) ($m->amount + $m->admin_fee)]);

        $procurements = Procurement::with('item')
            ->whereDate('procurement_date', $date)->orderBy('procurement_date')->get()
            ->map(fn ($p) => ['code' => $p->procurement_code, 'itemName' => $p->item?->item_name ?? '-', 'quantity' => $p->quantity, 'totalPrice' => (int) $p->total_price]);

        $maintenances = MaintenanceLog::with('inventoryItem')
            ->whereDate('maintenance_date', $date)->orderBy('maintenance_date')->get()
            ->map(fn ($m) => ['itemName' => $m->inventoryItem?->item_name ?? '-', 'type' => $m->maintenance_type, 'cost' => (int) $m->cost]);

        $activities = ActivityLog::with('user')
            ->whereDate('activity_time', $date)->orderByDesc('activity_time')->limit(20)->get()
            ->map(fn ($a) => ['time' => $a->activity_time?->toDateTimeString(), 'name' => $a->activity_name, 'type' => $a->activity_type, 'description' => $a->description, 'userName' => $a->user?->full_name ?? '-']);

        $newMembers = Member::whereDate('joined_at', $date)->count();
        $totalIncome = $registrations->sum('amount') + $memberships->sum('amount');
        $totalExpenses = $procurements->sum('totalPrice') + $maintenances->sum('cost');

        $stats = [
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'registrations' => $registrations->count(),
            'memberships' => $memberships->count(),
            'procurements' => $procurements->count(),
            'maintenances' => $maintenances->count(),
            'activities' => $activities->count(),
            'newMembers' => $newMembers,
        ];

        $html = View::make('reports.harian', [
            'date' => $date,
            'stats' => $stats,
            'registrations' => $registrations,
            'memberships' => $memberships,
            'procurements' => $procurements,
            'maintenances' => $maintenances,
            'activities' => $activities,
        ])->render();

        $dompdf = new Dompdf;
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="laporan-harian.pdf"',
        ]);
    }

    public function harianExcel(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        return Excel::download(
            new HarianReportExport($date),
            'laporan-harian.xlsx'
        );
    }

    private function inventoryReport(): array
    {
        $totalItems = InventoryItem::count();
        $byCondition = InventoryItem::selectRaw('item_condition, count(*) as total')
            ->groupBy('item_condition')
            ->pluck('total', 'item_condition');

        $byCategory = InventoryItem::selectRaw('category_id, count(*) as total')
            ->with('category')
            ->groupBy('category_id')
            ->get()
            ->map(fn ($i) => [
                'category' => $i->category?->category_name ?? '-',
                'total' => $i->total,
            ]);

        $activeItems = InventoryItem::where('item_status', 'aktif')->count();
        $inactiveItems = InventoryItem::where('item_status', 'tidak_aktif')->count();

        return [
            'totalItems' => $totalItems,
            'activeItems' => $activeItems,
            'inactiveItems' => $inactiveItems,
            'baik' => $byCondition['baik'] ?? 0,
            'perluPerawatan' => $byCondition['perlu_perawatan'] ?? 0,
            'rusak' => $byCondition['rusak'] ?? 0,
            'byCategory' => $byCategory,
        ];
    }

    private function financialReport(): array
    {
        $totalProcurements = Procurement::count();
        $totalSpending = (int) Procurement::sum('total_price');
        $totalQuantity = (int) Procurement::sum('quantity');

        $spendingByMonth = Procurement::selectRaw(
            "DATE_FORMAT(procurement_date, '%Y-%m') as month, sum(total_price) as total, sum(quantity) as qty"
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $avgUnitPrice = $totalQuantity > 0 ? (int) ($totalSpending / $totalQuantity) : 0;

        return [
            'totalProcurements' => $totalProcurements,
            'totalSpending' => $totalSpending,
            'totalQuantity' => $totalQuantity,
            'avgUnitPrice' => $avgUnitPrice,
            'spendingByMonth' => $spendingByMonth,
        ];
    }

    private function dailyReport(): array
    {
        $today = now()->toDateString();

        $procurementsToday = Procurement::whereDate('procurement_date', $today)->count();

        $maintenanceToday = MaintenanceLog::whereDate('maintenance_date', $today)->count();

        $activeLoans = InventoryLoan::whereNull('returned_at')->count();

        $recentProcurements = Procurement::with('item')
            ->orderByDesc('procurement_date')
            ->limit(10)
            ->get()
            ->map(fn ($p) => [
                'date' => $p->procurement_date?->toDateString(),
                'itemName' => $p->item?->item_name ?? '-',
                'quantity' => $p->quantity,
                'totalPrice' => (int) $p->total_price,
            ]);

        $summaryByMonth = Procurement::selectRaw(
            "DATE_FORMAT(procurement_date, '%Y-%m') as month, count(*) as transactions, sum(quantity) as items_in"
        )
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(12)
            ->get();

        return [
            'procurementsToday' => $procurementsToday,
            'maintenanceToday' => $maintenanceToday,
            'activeLoans' => $activeLoans,
            'recentProcurements' => $recentProcurements,
            'summaryByMonth' => $summaryByMonth,
        ];
    }
}
