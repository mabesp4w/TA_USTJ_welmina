# DOKUMENTASI IMPLEMENTASI ANTAR MUKA PEMAKAI

> **Aplikasi**: Sistem Informasi Inventaris Fitness Center Vicca Sera Polimak — Sistem Pengelolaan Inventaris Alat Fitness, Data Member, dan Laporan Keuangan

---

## DAFTAR ISI


2. [Halaman Administrator](#2-halaman-administrator)
   - 2.1 Dashboard Administrator
   - 2.2 Halaman Data Member
   - 2.3 Halaman Biaya Pendaftaran
   - 2.4 Halaman Biaya Gym
   - 2.5 Halaman Data Inventaris
   - 2.6 Halaman Peralatan Gym
   - 2.7 Halaman Kategori
   - 2.8 Halaman Perawatan Barang
   - 2.9 Halaman Pemasok
   - 2.10 Halaman Pengadaan Barang
   - 2.11 Halaman Riwayat Aktivitas
   - 2.12 Halaman Laporan
   - 2.13 Halaman Laporan Barang
   - 2.14 Halaman Laporan Keuangan
   - 2.15 Halaman Laporan Harian
   - 2.16 Halaman Notifikasi
   - 2.17 Halaman Pengguna
   - 2.18 Halaman Pengaturan
3. [Halaman Pengelola](#3-halaman-pengelola)
   - 3.1 Dashboard Pengelola
   - 3.2 Halaman Data Inventaris
   - 3.3 Halaman Peralatan Gym
   - 3.4 Halaman Perawatan Barang
   - 3.5 Halaman Pemasok
   - 3.6 Halaman Laporan Barang
   - 3.7 Halaman Laporan Keuangan
   - 3.8 Halaman Laporan Harian
4. [Halaman Pimpinan](#4-halaman-pimpinan)
   - 4.1 Dashboard Pimpinan
   - 4.2 Halaman Laporan Barang
   - 4.3 Halaman Laporan Keuangan
   - 4.4 Halaman Laporan Harian

## 1 Halaman Login (Beranda)

**Alamat halaman**: `/`

Halaman login merupakan pintu masuk utama ke sistem. Halaman ini berfungsi untuk mengautentikasi pengguna sebelum mengakses fitur-fitur sistem berdasarkan peran masing-masing.

Tampilan halaman menggunakan tata letak dua kolom pada layar besar. Pada kolom kiri ditampilkan panel informasi dengan latar belakang gelap yang memuat logo ikon dumbbell, nama "Fitness Center Vicca Sera Polimak", lencana "Sistem Inventaris Modern", judul besar "Kelola inventaris gym dengan lebih cepat dan rapi", dan paragraf deskripsi sistem. Di bagian bawah kolom kiri terdapat tiga kartu statistik yang menampilkan data real-time dari database: Total Inventaris, Kondisi Baik, dan Perlu Tindakan. Panel kiri disembunyikan pada layar kecil.

Pada kolom kanan ditampilkan formulir login dengan latar putih yang memuat judul "Selamat Datang", deskripsi, dan kartu formulir. Formulir terdiri dari kolom masukan username dengan ikon pengguna, kolom masukan password dengan ikon gembok dan tombol tampilkan/sembunyikan, kotak centang "Ingat saya", dan tombol "Masuk" dengan ikon panah kanan. Tombol berubah menjadi animasi berputar saat proses login berlangsung. Apabila login gagal, pesan kesalahan ditampilkan di bawah kolom yang bermasalah.

Di bawah formulir terdapat pembatas bertuliskan "Aman & Terenkripsi" dan panel informasi keamanan dengan ikon perisai hijau. Di bagian paling bawah terdapat teks hak cipta "© 2026 Fitness Center Vicca Sera Polimak".

Setelah login berhasil, pengguna diarahkan ke dashboard sesuai perannya: administrator diarahkan ke `/admin/dashboard`, pengelola diarahkan ke `/pengelola/dashboard`, dan pimpinan diarahkan ke `/pimpinan/dashboard`.

Seluruh elemen halaman menggunakan animasi masuk bertahap (AOS) yang dipicu saat halaman dimuat.

---

## 2. HALAMAN ADMINISTRATOR

Halaman administrator hanya dapat diakses oleh pengguna yang sudah berhasil login dengan peran `administrator`. Seluruh halaman dilindungi oleh middleware autentikasi dan pengecekan peran. Apabila pengguna tidak memiliki peran yang sesuai, akan diarahkan kembali ke dashboard perannya.

Setiap halaman administrator ditampilkan dalam kerangka tampilan yang terdiri dari dua bagian. Bagian pertama adalah bilah samping (sidebar) di sisi kiri yang berisi judul "FITNESS CENTER VICCA SERA POLIMAK" dengan subjudul "Sistem Inventaris", kemudian menu navigasi yang dikelompokkan menjadi enam kategori: UTAMA (Dashboard), MEMBER (Data Member, Biaya Pendaftaran, Biaya Gym), INVENTARIS (Data Inventaris, Peralatan Gym, Kategori, Perawatan Barang, Pemasok), TRANSAKSI (Pengadaan Barang, Riwayat Aktivitas), CETAK LAPORAN (Laporan Barang, Laporan Keuangan, Laporan Harian), dan SISTEM (Laporan, Notifikasi, Pengguna, Pengaturan). Setiap item menu memiliki ikon dan penandaan aktif berupa latar berwarna primer saat halaman terkait sedang dibuka. Menu notifikasi menampilkan lencana jumlah notifikasi belum dibaca. Di bagian bawah bilah samping terdapat tombol "Logout". Pada layar kecil, bilah samping berubah menjadi panel geser dari kiri yang dapat dibuka melalui tombol menu di sudut kiri atas, dengan lapisan gelap buram sebagai latar.

Bagian kedua adalah area konten utama yang memuat bilah header sticky di bagian atas. Header menampilkan label "Fitness Center", judul halaman aktif, dan area aksi (tombol-tombol) di sisi kanan pada halaman tertentu.

---

### 2.1 Dashboard Administrator

**Alamat halaman**: `/admin/dashboard`

Halaman dashboard merupakan halaman pertama yang ditampilkan setelah administrator berhasil login. Halaman ini berfungsi untuk menampilkan ringkasan kondisi inventaris.

Pada bagian atas terdapat empat kartu statistik dalam satu baris pada layar besar (dua kolom pada layar kecil) yang masing-masing menampilkan: Total Inventaris (jumlah item dan item baru bulan ini), Kondisi Bagus (persentase item baik dari total), Perlu Perawatan (jumlah item yang perlu tindakan), dan Rusak Tidak Layak (jumlah item yang perlu segera diganti). Setiap kartu memiliki judul, angka besar, dan subtitle deskriptif.

Di bawah kartu statistik terdapat empat panel dalam grid dua kolom: panel "Distribusi Kategori" menampilkan daftar kategori inventaris beserta jumlah barang per kategori; panel "Aktivitas Terbaru" menampilkan lima aktivitas terakhir dengan waktu relatif; panel "Perawatan Rutin" menampilkan lima log perawatan terbaru beserta tipe perawatannya; dan panel "Ringkasan Cepat" menampilkan empat angka ringkasan (Inventaris Aktif, Barang Baru, Sedang Diservis, Perlu Diganti) dalam grid dua kolom.

Di bagian bawah terdapat tabel data inventaris terbaru dengan kolom: Nama Barang, Kategori, Kondisi (lencana berwarna: hijau untuk Baik, kuning untuk Perlu Perawatan, merah untuk Rusak), Lokasi, dan Update (waktu relatif).

---

### 2.2 Halaman Data Member

**Alamat halaman**: `/admin/member`

Halaman ini berfungsi untuk mengelola data member fitness center. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data member.

Pada bagian atas terdapat bilah header dengan judul "Data Member" dan tombol aksi untuk menambah member baru. Di bawahnya terdapat tabel data member dengan fitur pencarian, pagination, dan kolom aksi (lihat, edit, hapus). Setiap operasi CRUD dilakukan melalui dialog modal.

---

### 2.3 Halaman Biaya Pendaftaran

**Alamat halaman**: `/admin/registration-payment`

Halaman ini berfungsi untuk mengelola data pembayaran pendaftaran member. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data pembayaran pendaftaran.

Pada bagian atas terdapat bilah header dengan judul "Biaya Pendaftaran" dan tombol tambah. Di bawahnya terdapat tabel data pembayaran dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.4 Halaman Biaya Gym

**Alamat halaman**: `/admin/gym-fee`

Halaman ini berfungsi untuk mengelola data iuran/biaya gym (membership). Administrator dapat menambah, melihat detail, mengubah, dan menghapus data biaya gym.

Pada bagian atas terdapat bilah header dengan judul "Biaya Gym" dan tombol tambah. Di bawahnya terdapat tabel data iuran dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.5 Halaman Data Inventaris

**Alamat halaman**: `/admin/inventory`

Halaman ini berfungsi untuk mengelola data inventaris barang fitness center. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data inventaris.

Pada bagian atas terdapat bilah header dengan judul "Data Inventaris" dan tombol tambah barang baru. Di bawahnya terdapat tabel data inventaris dengan fitur pencarian, pagination, dan kolom aksi. Tabel menampilkan informasi kode barang, nama, kategori, stok, kondisi (dengan lencana berwarna), status, lokasi, dan supplier.

---

### 2.6 Halaman Peralatan Gym

**Alamat halaman**: `/admin/gym-equipment`

Halaman ini berfungsi untuk mengelola data peralatan gym secara spesifik. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data peralatan gym.

Pada bagian atas terdapat bilah header dengan judul "Peralatan Gym" dan tombol tambah. Di bawahnya terdapat tabel data peralatan dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.7 Halaman Kategori

**Alamat halaman**: `/admin/category`

Halaman ini berfungsi untuk mengelola kategori inventaris barang. Administrator dapat menambah, melihat detail, mengubah, dan menghapus kategori.

Pada bagian atas terdapat bilah header dengan judul "Kategori" dan tombol tambah. Di bawahnya terdapat tabel data kategori dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.8 Halaman Perawatan Barang

**Alamat halaman**: `/admin/maintenance-logs`

Halaman ini berfungsi untuk mengelola log perawatan barang inventaris. Administrator dapat menambah, melihat detail, mengubah, dan menghapus catatan perawatan.

Pada bagian atas terdapat bilah header dengan judul "Perawatan Barang" dan tombol tambah. Di bawahnya terdapat tabel log perawatan dengan fitur pencarian, pagination, dan kolom aksi. Tabel menampilkan nama barang, tipe perawatan, tanggal, biaya, dan keterangan.

---

### 2.9 Halaman Pemasok

**Alamat halaman**: `/admin/supplier`

Halaman ini berfungsi untuk mengelola data supplier/pemasok barang. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data pemasok.

Pada bagian atas terdapat bilah header dengan judul "Pemasok" dan tombol tambah. Di bawahnya terdapat tabel data pemasok dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.10 Halaman Pengadaan Barang

**Alamat halaman**: `/admin/procurement`

Halaman ini berfungsi untuk mengelola data pengadaan/pembelian barang inventaris. Administrator dapat menambah, melihat detail, mengubah, dan menghapus data pengadaan.

Pada bagian atas terdapat bilah header dengan judul "Pengadaan Barang" dan tombol tambah. Di bawahnya terdapat tabel data pengadaan dengan fitur pencarian, pagination, dan kolom aksi. Tabel menampilkan kode pengadaan, nama barang, jumlah, harga satuan, total harga, dan tanggal pengadaan.

---

### 2.11 Halaman Riwayat Aktivitas

**Alamat halaman**: `/admin/activity-log`

Halaman ini berfungsi untuk menampilkan seluruh riwayat aktivitas yang tercatat dalam sistem. Administrator dapat melihat detail dan menghapus catatan aktivitas.

Pada bagian atas terdapat bilah header dengan judul "Riwayat Aktivitas". Di bawahnya terdapat tabel log aktivitas dengan fitur pencarian dan pagination. Tabel menampilkan waktu aktivitas, nama aktivitas, tipe (dengan lencana berwarna sesuai jenis: hijau untuk tambah/pembayaran/pendaftaran, kuning untuk servis, merah untuk rusak, biru untuk lainnya), deskripsi, dan nama pengguna pelaku.

---

### 2.12 Halaman Laporan

**Alamat halaman**: `/admin/report`

Halaman ini berfungsi sebagai halaman induk laporan dengan tab navigasi. Terdapat tiga tab: Barang, Keuangan, dan Harian. Masing-masing tab menampilkan ringkasan data sesuai kategorinya.

---

### 2.13 Halaman Laporan Barang

**Alamat halaman**: `/admin/report/barang`

Halaman ini berfungsi untuk menampilkan laporan inventaris barang secara lengkap dengan fitur cetak PDF dan export Excel.

Pada bagian atas terdapat bilah header dengan judul "Laporan Barang" dan dua tombol aksi: "Cetak PDF" dan "Export Excel". Di bawahnya terdapat filter dropdown kondisi barang (Semua Kondisi, Baik, Perlu Perawatan, Rusak) yang memfilter data secara langsung.

Di bawah filter terdapat empat kartu statistik horizontal: Total Barang, Baik (hijau), Perlu Perawatan (kuning), dan Rusak (merah). Di bawahnya terdapat tabel "Daftar Inventaris Barang" dengan kolom: No, Kode, Nama Barang, Kategori, Stok (rata kanan), Kondisi (lencana berwarna), Status (lencana berwarna), Lokasi, dan Supplier.

Di bagian bawah terdapat keterangan tanggal cetak yang hanya terlihat saat dicetak (print). Tombol PDF dan Excel mengunduh file dengan parameter filter yang sedang aktif.

---

### 2.14 Halaman Laporan Keuangan

**Alamat halaman**: `/admin/report/keuangan`

Halaman ini berfungsi untuk menampilkan laporan keuangan lengkap mencakup pemasukan (pendaftaran dan iuran member) serta pengeluaran (pengadaan barang).

Pada bagian atas terdapat bilah header dengan judul "Laporan Keuangan" dan dua tombol aksi: "Cetak PDF" dan "Export Excel". Di bawahnya terdapat filter bulan (dropdown 12 bulan), tahun (input angka), dan tombol "Terapkan".

Di bawah filter terdapat tiga kartu statistik horizontal: Total Pemasukan (hijau dengan ikon tren naik), Total Pengeluaran (merah dengan ikon tren turun), dan Saldo Bersih (biru/merah dengan ikon dompet, warna berubah sesuai positif/negatif).

Di bawahnya terdapat tiga kartu ringkasan dalam grid tiga kolom: Pendaftaran (jumlah pemasukan dan transaksi), Iuran Member (jumlah pemasukan dan transaksi), dan Pengadaan Barang (jumlah pengeluaran dan transaksi).

Bagian berikutnya adalah tabel "Ringkasan per Bulan" dengan kolom: Bulan, Pendaftaran (rata kanan), Iuran Member (rata kanan), Total Pemasukan (rata kanan, hijau), Pengeluaran (rata kanan, merah), dan Saldo (rata kanan, biru/merah sesuai positif/negatif).

Di bawahnya terdapat tabel "Transaksi Terbaru" yang menampilkan 10 transaksi terakhir dengan kolom: Tanggal, Keterangan (dengan ikon tren naik hijau untuk pemasukan atau tren turun merah untuk pengeluaran), dan Jumlah (berwarna sesuai jenis transaksi).

---

### 2.15 Halaman Laporan Harian

**Alamat halaman**: `/admin/report/harian`

Halaman ini berfungsi untuk menampilkan laporan aktivitas harian pada tanggal tertentu.

Pada bagian atas terdapat bilah header dengan judul "Laporan Harian" dan dua tombol aksi: "Cetak PDF" dan "Export Excel". Di bawahnya terdapat filter tanggal (input date) dan tombol "Tampilkan". Default menampilkan data hari ini.

Di bawah filter terdapat judul "Laporan Tanggal:" diikuti tanggal dalam format panjang Indonesia (contoh: Sabtu, 12 Juli 2026). Di bawahnya terdapat empat kartu statistik horizontal: Pemasukan (hijau, jumlah transaksi pendaftaran + iuran), Pengeluaran (merah, jumlah transaksi pengadaan + perawatan), Aktivitas (biru, jumlah riwayat aktivitas), dan Member Baru (sekunder, jumlah pendaftaran hari itu).

Di bawah statistik terdapat empat panel dalam grid dua kolom:
- **Pendaftaran Member**: tabel dengan kolom Member, Total, dan Status (lencana Lunas/Belum).
- **Pembayaran Iuran**: tabel dengan kolom Member, Durasi (bulan), dan Jumlah.
- **Pengadaan Barang**: tabel dengan kolom Kode, Barang, Qty, dan Total.
- **Perawatan Barang**: tabel dengan kolom Barang, Tipe, dan Biaya.

Di bagian bawah terdapat panel "Riwayat Aktivitas" lebar penuh dengan tabel bergaris: Waktu, Aktivitas, Tipe (lencana berwarna), Deskripsi, dan Oleh.

---

### 2.16 Halaman Notifikasi

**Alamat halaman**: `/admin/notification`

Halaman ini berfungsi untuk menampilkan notifikasi sistem kepada administrator. Administrator dapat melihat detail dan menghapus notifikasi, serta menandai semua sebagai telah dibaca.

---

### 2.17 Halaman Pengguna

**Alamat halaman**: `/admin/user`

Halaman ini berfungsi untuk mengelola akun pengguna sistem. Administrator dapat menambah, melihat detail, mengubah, dan menghapus akun pengguna dengan berbagai peran (administrator, pengelola, pimpinan).

Pada bagian atas terdapat bilah header dengan judul "Pengguna" dan tombol tambah. Di bawahnya terdapat tabel data pengguna dengan fitur pencarian, pagination, dan kolom aksi.

---

### 2.18 Halaman Pengaturan

**Alamat halaman**: `/admin/settings`

Halaman ini berfungsi untuk mengatur konfigurasi sistem seperti pengaturan umum aplikasi.

---

## 3. HALAMAN PENGELOLA

Halaman pengelola hanya dapat diakses oleh pengguna yang sudah berhasil login dengan peran `pengelola`. Seluruh halaman dilindungi oleh middleware autentikasi dan pengecekan peran.

Setiap halaman pengelola ditampilkan dalam kerangka tampilan yang sama dengan administrator namun dengan menu navigasi yang lebih terbatas. Bilah samping menampilkan subjudul "Panel Pengelola" dan menu dikelompokkan menjadi tiga kategori: UTAMA (Dashboard), INVENTARIS (Data Inventaris, Peralatan Gym, Perawatan Barang, Pemasok), dan CETAK LAPORAN (Laporan Barang, Laporan Keuangan, Laporan Harian). Di bagian bawah bilah samping terdapat tombol "Logout".

Pengelola memiliki akses baca (read-only) terhadap data inventaris dan fitur cetak laporan, tanpa kemampuan menambah, mengubah, atau menghapus data.

---

### 3.1 Dashboard Pengelola

**Alamat halaman**: `/pengelola/dashboard`

Halaman dashboard pengelola menampilkan tampilan yang sama dengan dashboard administrator (lihat bagian 2.1), yaitu ringkasan kondisi inventaris, distribusi kategori, aktivitas terbaru, perawatan rutin, ringkasan cepat, dan tabel inventaris terbaru.

---

### 3.2 Halaman Data Inventaris

**Alamat halaman**: `/pengelola/inventory`

Halaman ini menampilkan data inventaris barang dalam format yang sama dengan halaman administrator (lihat bagian 2.5) namun tanpa kemampuan tambah, ubah, atau hapus.

---

### 3.3 Halaman Peralatan Gym

**Alamat halaman**: `/pengelola/gym-equipment`

Halaman ini menampilkan data peralatan gym dalam format yang sama dengan halaman administrator (lihat bagian 2.6) namun hanya untuk dilihat.

---

### 3.4 Halaman Perawatan Barang

**Alamat halaman**: `/pengelola/maintenance-logs`

Halaman ini menampilkan log perawatan barang dalam format yang sama dengan halaman administrator (lihat bagian 2.8) namun hanya untuk dilihat.

---

### 3.5 Halaman Pemasok

**Alamat halaman**: `/pengelola/supplier`

Halaman ini menampilkan data pemasok dalam format yang sama dengan halaman administrator (lihat bagian 2.9) namun hanya untuk dilihat.

---

### 3.6 Halaman Laporan Barang

**Alamat halaman**: `/pengelola/report/barang`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan barang administrator (lihat bagian 2.13). Terdapat filter kondisi, kartu statistik, tabel inventaris, serta tombol cetak PDF dan export Excel.

---

### 3.7 Halaman Laporan Keuangan

**Alamat halaman**: `/pengelola/report/keuangan`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan keuangan administrator (lihat bagian 2.14). Terdapat filter bulan/tahun, kartu statistik, ringkasan per bulan, transaksi terbaru, serta tombol cetak PDF dan export Excel.

---

### 3.8 Halaman Laporan Harian

**Alamat halaman**: `/pengelola/report/harian`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan harian administrator (lihat bagian 2.15). Terdapat filter tanggal, kartu statistik, panel per kategori transaksi, riwayat aktivitas, serta tombol cetak PDF dan export Excel.

---

## 4. HALAMAN PIMPINAN

Halaman pimpinan hanya dapat diakses oleh pengguna yang sudah berhasil login dengan peran `pimpinan`. Seluruh halaman dilindungi oleh middleware autentikasi dan pengecekan peran.

Setiap halaman pimpinan ditampilkan dalam kerangka tampilan yang sama dengan administrator namun dengan menu navigasi paling terbatas. Bilah samping menampilkan subjudul "Panel Pimpinan" dan menu dikelompokkan menjadi dua kategori: UTAMA (Dashboard) dan CETAK LAPORAN (Laporan Barang, Laporan Keuangan, Laporan Harian). Di bagian bawah bilah samping terdapat tombol "Logout".

Pimpinan memiliki akses khusus untuk melihat dashboard ringkasan dan mencetak laporan, tanpa akses ke pengelolaan data inventaris atau transaksi.

---

### 4.1 Dashboard Pimpinan

**Alamat halaman**: `/pimpinan/dashboard`

Halaman dashboard pimpinan menampilkan tampilan yang sama dengan dashboard administrator (lihat bagian 2.1), yaitu ringkasan kondisi inventaris, distribusi kategori, aktivitas terbaru, perawatan rutin, ringkasan cepat, dan tabel inventaris terbaru. Halaman ini memberikan gambaran umum kondisi inventaris fitness center kepada pimpinan.

---

### 4.2 Halaman Laporan Barang

**Alamat halaman**: `/pimpinan/report/barang`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan barang administrator (lihat bagian 2.13). Terdapat filter kondisi barang (Semua Kondisi, Baik, Perlu Perawatan, Rusak), empat kartu statistik (Total Barang, Baik, Perlu Perawatan, Rusak), tabel daftar inventaris barang lengkap, serta tombol "Cetak PDF" dan "Export Excel" yang mengunduh file sesuai filter aktif.

---

### 4.3 Halaman Laporan Keuangan

**Alamat halaman**: `/pimpinan/report/keuangan`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan keuangan administrator (lihat bagian 2.14). Terdapat filter bulan dan tahun, tiga kartu statistik (Total Pemasukan, Total Pengeluaran, Saldo Bersih), tiga kartu ringkasan transaksi (Pendaftaran, Iuran Member, Pengadaan Barang), tabel ringkasan per bulan, tabel transaksi terbaru, serta tombol "Cetak PDF" dan "Export Excel".

---

### 4.4 Halaman Laporan Harian

**Alamat halaman**: `/pimpinan/report/harian`

Halaman ini memiliki tampilan dan fungsi yang sama dengan halaman laporan harian administrator (lihat bagian 2.15). Terdapat filter tanggal, empat kartu statistik (Pemasukan, Pengeluaran, Aktivitas, Member Baru), empat panel detail (Pendaftaran Member, Pembayaran Iuran, Pengadaan Barang, Perawatan Barang), panel riwayat aktivitas, serta tombol "Cetak PDF" dan "Export Excel".

---

## RINGKASAN HALAMAN

| No | Halaman | Alamat | Akses | Fungsi Utama |
|---|---|---|---|---|
| 1 | Login (Beranda) | `/` | Publik | Formulir login, statistik inventaris real-time |
| 2 | Dashboard Admin | `/admin/dashboard` | Administrator | Ringkasan inventaris, kategori, aktivitas, perawatan |
| 3 | Data Member | `/admin/member` | Administrator | CRUD data member fitness center |
| 4 | Biaya Pendaftaran | `/admin/registration-payment` | Administrator | CRUD pembayaran pendaftaran member |
| 5 | Biaya Gym | `/admin/gym-fee` | Administrator | CRUD iuran/biaya membership gym |
| 6 | Data Inventaris | `/admin/inventory` | Administrator | CRUD data inventaris barang |
| 7 | Peralatan Gym | `/admin/gym-equipment` | Administrator | CRUD data peralatan gym |
| 8 | Kategori | `/admin/category` | Administrator | CRUD kategori inventaris |
| 9 | Perawatan Barang | `/admin/maintenance-logs` | Administrator | CRUD log perawatan barang |
| 10 | Pemasok | `/admin/supplier` | Administrator | CRUD data supplier/pemasok |
| 11 | Pengadaan Barang | `/admin/procurement` | Administrator | CRUD data pengadaan/pembelian barang |
| 12 | Riwayat Aktivitas | `/admin/activity-log` | Administrator | Lihat dan hapus log aktivitas sistem |
| 13 | Laporan | `/admin/report` | Administrator | Halaman induk laporan dengan tab navigasi |
| 14 | Laporan Barang | `/admin/report/barang` | Administrator | Laporan inventaris, filter kondisi, PDF, Excel |
| 15 | Laporan Keuangan | `/admin/report/keuangan` | Administrator | Laporan keuangan, filter bulan/tahun, PDF, Excel |
| 16 | Laporan Harian | `/admin/report/harian` | Administrator | Laporan harian per tanggal, PDF, Excel |
| 17 | Notifikasi | `/admin/notification` | Administrator | Lihat dan kelola notifikasi sistem |
| 18 | Pengguna | `/admin/user` | Administrator | CRUD akun pengguna sistem |
| 19 | Pengaturan | `/admin/settings` | Administrator | Konfigurasi sistem |
| 20 | Dashboard Pengelola | `/pengelola/dashboard` | Pengelola | Ringkasan inventaris (sama dengan admin) |
| 21 | Inventaris Pengelola | `/pengelola/inventory` | Pengelola | Lihat data inventaris (read-only) |
| 22 | Peralatan Pengelola | `/pengelola/gym-equipment` | Pengelola | Lihat peralatan gym (read-only) |
| 23 | Perawatan Pengelola | `/pengelola/maintenance-logs` | Pengelola | Lihat log perawatan (read-only) |
| 24 | Pemasok Pengelola | `/pengelola/supplier` | Pengelola | Lihat data pemasok (read-only) |
| 25 | Laporan Barang | `/pengelola/report/barang` | Pengelola | Laporan inventaris, PDF, Excel |
| 26 | Laporan Keuangan | `/pengelola/report/keuangan` | Pengelola | Laporan keuangan, PDF, Excel |
| 27 | Laporan Harian | `/pengelola/report/harian` | Pengelola | Laporan harian, PDF, Excel |
| 28 | Dashboard Pimpinan | `/pimpinan/dashboard` | Pimpinan | Ringkasan inventaris (sama dengan admin) |
| 29 | Laporan Barang | `/pimpinan/report/barang` | Pimpinan | Laporan inventaris, PDF, Excel |
| 30 | Laporan Keuangan | `/pimpinan/report/keuangan` | Pimpinan | Laporan keuangan, PDF, Excel |
| 31 | Laporan Harian | `/pimpinan/report/harian` | Pimpinan | Laporan harian, PDF, Excel |
