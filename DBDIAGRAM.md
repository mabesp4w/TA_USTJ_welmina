# Database Diagram (dbdiagram.io)

Salin kode DBML di bawah ini ke [https://dbdiagram.io/d](https://dbdiagram.io/d) untuk menghasilkan ERD.

```dbml
// ===========================
// Welmina Fitness - Skema Database
// ===========================

Table users {
  id bigint [pk, increment]
  nama_lengkap varchar(100)
  username varchar(50) [unique]
  email varchar(100) [unique]
  password_hash varchar(255)
  peran varchar(20) [default: 'admin', note: 'admin, pengelola, pimpinan']
  aktif boolean [default: true]
  remember_token varchar(100)
  created_at timestamp
  updated_at timestamp
}

Table sessions {
  id varchar [pk]
  user_id bigint
  ip_address varchar(45)
  user_agent text
  payload longtext
  last_activity integer
}

Table paket_keanggotaan {
  id bigint [pk, increment]
  nama_paket varchar(50) [unique]
  biaya_pendaftaran decimal(12,2) [default: 0.00]
  deskripsi text
  aktif boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

Table harga_paket_keanggotaan {
  id bigint [pk, increment]
  paket_id bigint
  durasi_bulan integer
  harga decimal(12,2)
  created_at timestamp
  updated_at timestamp

  indexes {
    (paket_id, durasi_bulan) [unique]
  }
}

Table anggota {
  id bigint [pk, increment]
  kode_anggota varchar(30) [unique]
  nama_lengkap varchar(100)
  no_identitas varchar(30) [unique]
  jenis_kelamin varchar(2) [note: 'L, P']
  tanggal_lahir date
  telepon varchar(20)
  email varchar(100)
  alamat text
  status_anggota varchar(20) [default: 'active', note: 'active, expired, inactive']
  bergabung_pada datetime
  created_at timestamp
  updated_at timestamp
}

Table keanggotaan {
  id bigint [pk, increment]
  anggota_id bigint
  paket_id bigint
  durasi_bulan integer
  tanggal_mulai date
  tanggal_berakhir date
  jumlah decimal(12,2) [default: 0.00]
  biaya_admin decimal(12,2) [default: 0.00]
  metode_pembayaran varchar(20) [default: 'cash', note: 'cash, transfer, qris, debit, credit, other']
  status_pembayaran varchar(20) [default: 'unpaid', note: 'paid, unpaid, partial, cancelled']
  jatuh_tempo date
  dibayar_pada datetime
  status varchar(20) [default: 'active', note: 'active, expired, inactive, pending']
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table pembayaran_pendaftaran {
  id bigint [pk, increment]
  anggota_id bigint
  paket_id bigint
  tanggal_pendaftaran date
  biaya_pendaftaran decimal(12,2) [default: 0.00]
  biaya_admin decimal(12,2) [default: 0.00]
  metode_pembayaran varchar(20) [default: 'cash', note: 'cash, transfer, qris, debit, credit, other']
  status_pembayaran varchar(20) [default: 'unpaid', note: 'paid, unpaid, partial, cancelled']
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table pemasok {
  id bigint [pk, increment]
  nama_pemasok varchar(100)
  telepon varchar(20)
  email varchar(100)
  alamat text
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table kategori_inventaris {
  id bigint [pk, increment]
  nama_kategori varchar(100) [unique]
  deskripsi text
  alat_fitness boolean [default: false]
  created_at timestamp
  updated_at timestamp
}

Table barang_inventaris {
  id bigint [pk, increment]
  pemasok_id bigint
  kategori_id bigint
  kode_barang varchar(30) [unique]
  nama_barang varchar(100)
  stok integer [default: 0]
  kondisi_barang varchar(20) [default: 'baik', note: 'baik, perlu_perawatan, rusak']
  status_barang varchar(20) [default: 'aktif', note: 'aktif, tidak_aktif']
  lokasi varchar(100)
  tanggal_servis_terakhir date
  path_gambar varchar(255)
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table permintaan_pengadaan {
  id bigint [pk, increment]
  pemasok_id bigint
  kategori_id bigint
  no_permintaan varchar(30) [unique]
  nama_barang varchar(100)
  jumlah integer
  estimasi_harga decimal(12,2) [default: 0.00]
  tanggal_dibutuhkan date
  deskripsi text
  created_at timestamp
  updated_at timestamp
}

Table pengadaan {
  id bigint [pk, increment]
  barang_id bigint
  pemasok_id bigint
  kode_pengadaan varchar(30) [unique]
  jumlah integer
  harga_satuan decimal(12,2)
  harga_total decimal(12,2)
  tanggal_pengadaan date
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table log_perawatan {
  id bigint [pk, increment]
  barang_id bigint
  jenis_perawatan varchar(20) [default: 'service', note: 'service, repair, inspection']
  tanggal_perawatan date
  biaya decimal(12,2) [default: 0.00]
  kondisi_hasil varchar(20) [default: 'baik', note: 'baik, perlu_perawatan, rusak']
  dilakukan_oleh varchar(100)
  catatan text
  created_at timestamp
  updated_at timestamp
}

Table log_aktivitas {
  id bigint [pk, increment]
  waktu_aktivitas datetime
  nama_aktivitas varchar(100)
  jenis_aktivitas varchar(20) [default: 'lainnya', note: 'tambah, servis, pinjam, kembali, rusak, pengadaan, pembayaran, pendaftaran, lainnya']
  barang_id bigint
  anggota_id bigint
  user_id bigint
  deskripsi text
  tabel_referensi varchar(50)
  referensi_id bigint
  created_at timestamp
  updated_at timestamp
}

Table notifikasi {
  id bigint [pk, increment]
  judul varchar(150)
  pesan text
  jenis_notifikasi varchar(20) [default: 'info', note: 'info, warning, danger, success']
  sudah_dibaca boolean [default: false]
  tabel_terkait varchar(50)
  terkait_id bigint
  dibuat_oleh bigint
  created_at timestamp
  updated_at timestamp
}

// ===========================
// Relasi
// ===========================

Ref: sessions.user_id > users.id

Ref: harga_paket_keanggotaan.paket_id > paket_keanggotaan.id

Ref: keanggotaan.anggota_id > anggota.id
Ref: keanggotaan.paket_id > paket_keanggotaan.id

Ref: pembayaran_pendaftaran.anggota_id > anggota.id
Ref: pembayaran_pendaftaran.paket_id > paket_keanggotaan.id

Ref: barang_inventaris.pemasok_id > pemasok.id
Ref: barang_inventaris.kategori_id > kategori_inventaris.id

Ref: permintaan_pengadaan.pemasok_id > pemasok.id
Ref: permintaan_pengadaan.kategori_id > kategori_inventaris.id

Ref: pengadaan.barang_id > barang_inventaris.id
Ref: pengadaan.pemasok_id > pemasok.id

Ref: log_perawatan.barang_id > barang_inventaris.id

Ref: log_aktivitas.barang_id > barang_inventaris.id
Ref: log_aktivitas.anggota_id > anggota.id
Ref: log_aktivitas.user_id > users.id

Ref: notifikasi.dibuat_oleh > users.id
```
