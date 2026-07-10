<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activityTypes = ['tambah', 'servis', 'pinjam', 'kembali', 'rusak', 'pengadaan', 'pembayaran', 'pendaftaran', 'lainnya'];
        $activityNames = [
            'tambah' => ['Menambahkan barang baru', 'Registrasi inventaris', 'Input data kategori'],
            'servis' => ['Melakukan perawatan alat', 'Service rutin', 'Perbaikan alat'],
            'pinjam' => ['Peminjaman alat', 'Peminjaman inventaris', 'Peminjaman oleh staff'],
            'kembali' => ['Pengembalian alat', 'Retur peminjaman', 'Pengembalian inventaris'],
            'rusak' => ['Melaporkan kerusakan', 'Alat rusak', 'Kerusakan ditemukan'],
            'pengadaan' => ['Pengadaan barang baru', 'Pembelian inventaris', 'Pengadaan rutin'],
            'pembayaran' => ['Pembayaran iuran', 'Pembayaran pendaftaran', 'Transaksi berhasil'],
            'pendaftaran' => ['Member baru mendaftar', 'Registrasi member', 'Pendaftaran online'],
            'lainnya' => ['Update data member', 'Perubahan status', 'Aktivitas sistem'],
        ];
        $referenceTables = ['inventory_items', 'members', 'procurements', 'maintenance_logs', 'inventory_loans', 'registration_payments', 'member_memberships'];

        $userIds = range(1, 23);
        $activityLogs = [];

        for ($i = 1; $i <= 30; $i++) {
            $type = $activityTypes[array_rand($activityTypes)];
            $names = $activityNames[$type];

            $activityLogs[] = [
                'activity_time' => now()->subDays(rand(0, 90))->subHours(rand(0, 23)),
                'activity_name' => $names[array_rand($names)],
                'activity_type' => $type,
                'inventory_item_id' => rand(0, 2) === 0 ? rand(1, 25) : null,
                'member_id' => rand(0, 2) === 0 ? rand(1, 25) : null,
                'user_id' => $userIds[array_rand($userIds)],
                'description' => 'Aktivitas '.$type.' - '.$names[array_rand($names)],
                'reference_table' => $referenceTables[array_rand($referenceTables)],
                'reference_id' => rand(1, 25),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('activity_logs')->insert($activityLogs);

        // Notifications (25 records)
        $notificationTypes = ['info', 'warning', 'success', 'error'];
        $notificationTitles = [
            'info' => ['Jadwal Maintenance', 'Update Sistem', 'Informasi Inventaris'],
            'warning' => ['Stok Menipis', 'Alat Perlu Diservis', 'Masa Aktif Akan Berakhir'],
            'success' => ['Pembayaran Berhasil', 'Data Tersimpan', 'Pengadaan Selesai'],
            'error' => ['Gagal Menyimpan Data', 'Koneksi Terputus', 'Kesalahan Sistem'],
        ];
        $notificationMessages = [
            'Jadwal maintenance alat telah diupdate.',
            'Stok barang hampir habis, segera lakukan pengadaan.',
            'Pembayaran member telah dikonfirmasi.',
            'Terdapat alat yang perlu perawatan segera.',
            'Pengadaan barang baru telah selesai diproses.',
            'Member baru telah terdaftar dalam sistem.',
            'Perubahan status inventaris berhasil disimpan.',
            'Peminjaman alat telah melewati batas waktu.',
            'Data member berhasil diperbarui.',
            'Sistem akan menjalankan maintenance pada malam hari.',
        ];

        $notifications = [];
        for ($i = 1; $i <= 25; $i++) {
            $type = $notificationTypes[array_rand($notificationTypes)];
            $titles = $notificationTitles[$type];

            $notifications[] = [
                'title' => $titles[array_rand($titles)],
                'message' => $notificationMessages[array_rand($notificationMessages)],
                'notification_type' => $type,
                'is_read' => rand(0, 1),
                'related_table' => $referenceTables[array_rand($referenceTables)],
                'related_id' => rand(1, 25),
                'created_by' => $userIds[array_rand($userIds)],
                'created_at' => now()->subDays(rand(0, 30)),
                'updated_at' => now(),
            ];
        }
        DB::table('notifications')->insert($notifications);
    }
}
