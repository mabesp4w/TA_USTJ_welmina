<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            ['supplier_name' => 'PT. Fitness Mandiri', 'phone' => '021-5550001', 'email' => 'info@fitnessmandiri.co.id', 'address' => 'Jl. Merdeka No. 1, Jakarta'],
            ['supplier_name' => 'CV. Sportama Jaya', 'phone' => '021-5550002', 'email' => 'sportama@cvsport.com', 'address' => 'Jl. Sudirman No. 45, Bandung'],
            ['supplier_name' => 'UD. Bugar Sejahtera', 'phone' => '031-5550003', 'email' => 'bugar@udsejahtera.com', 'address' => 'Jl. Tunjungan No. 78, Surabaya'],
            ['supplier_name' => 'PT. Alat Fitness Nusantara', 'phone' => '061-5550004', 'email' => 'afn@ptafn.com', 'address' => 'Jl. Diponegoro No. 12, Medan'],
            ['supplier_name' => 'CV. Olahraga Bersama', 'phone' => '0274-555005', 'email' => 'ob@cvolahraga.com', 'address' => 'Jl. Malioboro No. 56, Yogyakarta'],
            ['supplier_name' => 'PT. Gaya Hidup Sehat', 'phone' => '0361-555006', 'email' => 'ghs@ptghs.com', 'address' => 'Jl. Sunset Road No. 23, Bali'],
            ['supplier_name' => 'CV. Peralatan Gym Indo', 'phone' => '022-5550007', 'email' => 'pgi@cvgymindo.com', 'address' => 'Jl. Setiabudi No. 89, Bandung'],
            ['supplier_name' => 'UD. Sport Supply', 'phone' => '021-5550008', 'email' => 'sportsupply@ud.com', 'address' => 'Jl. Gatot Subroto No. 34, Jakarta'],
            ['supplier_name' => 'PT. Wellness Equipment', 'phone' => '031-5550009', 'email' => 'we@ptwellness.com', 'address' => 'Jl. Basuki Rahmat No. 67, Surabaya'],
            ['supplier_name' => 'CV. Fitnesia', 'phone' => '024-5550010', 'email' => 'fitnesia@cv.com', 'address' => 'Jl. Pandanaran No. 90, Semarang'],
            ['supplier_name' => 'PT. Cardio Tech', 'phone' => '021-5550011', 'email' => 'cardio@ptcardio.com', 'address' => 'Jl. Thamrin No. 15, Jakarta'],
            ['supplier_name' => 'CV. Strength Master', 'phone' => '061-5550012', 'email' => 'sm@cvmaster.com', 'address' => 'Jl. Sisingamangaraja No. 33, Medan'],
            ['supplier_name' => 'UD. Yoga & Pilates Supply', 'phone' => '0361-555013', 'email' => 'yps@udyp.com', 'address' => 'Jl. Ubud No. 12, Bali'],
            ['supplier_name' => 'PT. Sanitasi & Kebersihan', 'phone' => '021-5550014', 'email' => 'sk@ptsk.com', 'address' => 'Jl. Kuningan No. 56, Jakarta'],
            ['supplier_name' => 'CV. Matras dan Alas', 'phone' => '022-5550015', 'email' => 'ma@cvmatras.com', 'address' => 'Jl. Cihampelas No. 78, Bandung'],
            ['supplier_name' => 'PT. Dumbbell & Barbell Inc.', 'phone' => '031-5550016', 'email' => 'dbi@ptdbi.com', 'address' => 'Jl. Darmo No. 90, Surabaya'],
            ['supplier_name' => 'CV. Treadmill Solution', 'phone' => '024-5550017', 'email' => 'ts@cvtreadmill.com', 'address' => 'Jl. Gajah Mada No. 45, Semarang'],
            ['supplier_name' => 'UD. Alat Terapi', 'phone' => '0274-555018', 'email' => 'at@udterapi.com', 'address' => 'Jl. Solo No. 67, Yogyakarta'],
            ['supplier_name' => 'PT. Gym Accessories', 'phone' => '021-5550019', 'email' => 'ga@ptga.com', 'address' => 'Jl. Rasuna Said No. 22, Jakarta'],
            ['supplier_name' => 'CV. Fitness Nutrition', 'phone' => '031-5550020', 'email' => 'fn@cvfn.com', 'address' => 'Jl. Kertajaya No. 88, Surabaya'],
        ];

        DB::table('suppliers')->insert($suppliers);
    }
}
