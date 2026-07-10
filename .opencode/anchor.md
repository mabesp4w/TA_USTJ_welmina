## Objective
- Create Procurement (Pengadaan Barang), ActivityLog (Riwayat Aktivitas), User (Pengguna), Notification (Notifikasi), and Report (Laporan) CRUD/pages, with updated sidebar grouping.
- Fix InventoryForm `lastServiceDate` date-formatting and DatePickerField modal-width issue.

## Important Details
- InventoryForm (`lastServiceDate`): yup schema `yup.date()`, `format(data.lastServiceDate, "yyyy-MM-dd")` before submit; edit setValue converts `inventory.lastServiceDate ? new Date(...) : undefined`
- DatePickerField fix: replaced `withPortal` with `popperProps={{ strategy: "fixed" }}` + `popperPlacement="bottom-start"` + `wrapperClassName="w-full"` (reference project pattern)
- Procurement table: `procurement_code`(string30,unique), `item_id`, `supplier_id`, `quantity`, `unit_price`, `total_price`(computed), `procurement_date`, `notes`; route param `{procurement}`
- ActivityLog: read-only + delete; route param `{activityLog}`; limit 500, filter by type
- User: `full_name`, `username`(unique), `email`(nullable), `password_hash`, `role`(administrator/pengelola/pimpinan), `is_active`; password optional on edit; cannot delete self
- Notification: `title`, `message`, `notification_type`(info/warning/danger/success), `is_read`; auto mark-as-read on detail view; wayfinder exports `markAllRead` (not `markAllAsRead`) for `admin.notification.mark-all-read`
- Report: single route `admin.report` with `tab` query param (barang/keuangan/harian); ReportController with three private methods
- Sidebar: CETAK LAPORAN group with Laporan Barang/Keuangan/Harian (linked via `report.url({ tab: '...' })`); SISTEM group keeps Notifikasi/Pengguna/Pengaturan
- Wayfinder route naming: `admin.notification.mark-all-read` → generates `markAllRead` function
- Prev-context details still hold: SSR guard, RupiahInputField, StoreGymFeeRequest `->getKey()` fix, registration payment sets member inactive, background consistency, image upload for categories, all previous routes/pages/models

## Work State
### Completed
- **Date format fix**: `resources/js/components/pages/admin/inventory/InventoryForm.tsx` — added `format()` from date-fns in submit handler, `yup.date()` schema
- **DatePickerField modal fix**: `resources/js/components/ui/DatePickerField.tsx` — removed `withPortal`, added `popperProps={{ strategy: "fixed" }}`, `popperPlacement="bottom-start"`, `wrapperClassName="w-full"`
- **DateInputField**: deleted `resources/js/components/ui/DateInputField.tsx`
- **Procurement CRUD**: migration, `Procurement` model, `StoreProcurementRequest`, `ProcurementController`, `pages/admin/Procurement.tsx`, components (types, StatCard, ProcurementForm with auto total, ProcurementListCard, ProcurementDetail), `layouts/ProcurementLayout.tsx`, routes `admin.procurement.*`, sidebar link
- **ActivityLog CRUD**: `ActivityLog` model (table `activity_logs`), `ActivityLogController` (index/show/destroy), `pages/admin/ActivityLog.tsx`, components (types, StatCard, ActivityLogListCard with type badges, ActivityLogDetail), `layouts/ActivityLogLayout.tsx`, routes `admin.activity-log.*`, sidebar link
- **User CRUD**: `UserController`, `StoreUserRequest`, `pages/admin/User.tsx`, components (types, StatCard, UserForm with password optional on edit, UserListCard, UserDetail), `layouts/UserLayout.tsx`, routes `admin.user.*`, sidebar link
- **Notification page**: `Notification` model (table `notifications`), `NotificationController` (index/show/markAllAsRead/destroy), `pages/admin/Notification.tsx`, components (types, StatCard, NotificationListCard with unread indicator, NotificationDetail), `layouts/NotificationLayout.tsx` with "Tandai Dibaca" button, routes `admin.notification.*`, sidebar link
- **Report page**: `ReportController` (index with barang/keuangan/harian tabs, aggregated queries for inventory, finance, daily stats), `pages/admin/Report.tsx` with three tab components (InventoryReport, FinancialReport, DailyReport), `layouts/ReportLayout.tsx` with tab navigation, route `admin.report`, sidebar links updated from `#` to `report.url({ tab: '...' })`
- **Sidebar update**: CETAK LAPORAN group added (ClipboardList/DollarSign/CalendarDays icons, linked to report route with tab param); SISTEM group: Laporan removed, Notifikasi links `notification.url()`
- **Wayfinder**: regenerated after all route additions; pint passed; npm build succeeded

### Active
- *(none)*

### Blocked
- *(none)*

## Next Move
- (nothing pending — all planned pages complete)

## Relevant Files
- `resources/js/components/ui/DatePickerField.tsx`: `popperProps={{ strategy: "fixed" }}`, `popperPlacement="bottom-start"`, `wrapperClassName="w-full"`
- `resources/js/components/pages/admin/inventory/InventoryForm.tsx`: `format(data.lastServiceDate, "yyyy-MM-dd")`, `yup.date()`
- `app/Http/Controllers/Admin/ProcurementController.php`, `ActivityLogController.php`, `UserController.php`, `NotificationController.php`, `ReportController.php`
- `app/Http/Controllers/Admin/ReportController.php`: index with `inventoryReport()`, `financialReport()`, `dailyReport()` private methods
- `app/Models/Procurement.php`, `ActivityLog.php`, `Notification.php`
- `app/Http/Requests/Admin/StoreProcurementRequest.php`, `StoreUserRequest.php`
- `resources/js/pages/admin/Procurement.tsx`, `ActivityLog.tsx`, `User.tsx`, `Notification.tsx`, `Report.tsx`
- `resources/js/components/layouts/ReportLayout.tsx`: tab navigation + AdminLayout wrapper
- `resources/js/components/layouts/sidebar.tsx`: CETAK LAPORAN group with tab-linked routes
- `resources/js/routes/admin/notification/index.ts`: exports `markAllRead`
- `routes/web.php`: all new routes including `admin.report`
