<?php

// cek jika aplikasi dijalankan dari command line
if ( php_sapi_name() !== 'cli' ) {
    echo "Aplikasi ini hanya bisa dijalankan dari command line." . PHP_EOL;
    exit( 1 );
}

$filename = './README.md';

// Dapatkan semua link pada setiap baris di setiap tabel dengan link terletak di indeks kolom ke-3
$content = file_get_contents( $filename ); // Konten Markdown.

// Buat pola regex untuk mencari tabel dalam konten Markdown
$tableRegex = '/### (.*?)\n\n(.*?)\n\n/s';

// Temukan semua tabel dalam konten
preg_match_all( $tableRegex, $content, $matches, PREG_SET_ORDER );

// Inisialisasi array untuk menyimpan hasil
$tables = [];

// Loop melalui tabel yang ditemukan
foreach ( $matches as $match ) {
    $apiGroup     = $match[1]; // Nama grup API
    $tableContent = $match[2]; // Konten tabel

    // Buat pola regex untuk mengambil baris-baris dalam tabel
    $rowRegex = '/\| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|/s';

    // Temukan semua baris dalam tabel
    preg_match_all( $rowRegex, $tableContent, $rows, PREG_SET_ORDER );

    // Inisialisasi array untuk menyimpan data API dalam tabel ini
    $apis = [];

    // delete rows index 0 and 1
    unset($rows[0]);
    unset($rows[1]);

    // Loop melalui baris-baris dalam tabel
    foreach ( $rows as $row ) {
        // Extract informasi dari setiap kolom dalam baris
        $apiName     = trim( $row[1] );
        $developer   = trim( $row[2] );
        $url         = trim( $row[3] );
        $status      = trim( $row[4] );
        $description = trim( $row[5] );
        $auth        = trim( $row[6] );

        // Buat objek API
        $api = [
            "api_name"    => $apiName,
            "developer"   => $developer,
            "url"         => $url,
            "status"      => $status,
            "description" => $description,
            "auth"        => $auth,
        ];

        // Tambahkan objek API ke dalam array $apis
        $apis[] = $api;
    }

    // Buat objek grup API
    $apiGroupObj = [
        "api_group" => $apiGroup,
        "apis"      => $apis,
    ];

    // Tambahkan objek grup API ke dalam array $tables
    $tables[] = $apiGroupObj;
}

// Hasilnya adalah array $tables yang berisi semua data API dalam tabel-tabel dari konten Markdown.
// Anda dapat melakukan apa yang Anda inginkan dengan array ini, seperti mencetaknya atau memprosesnya lebih lanjut.

// Hitung total grup API
$totalApiGroups = count( $tables );

// Lakukan perulangan untuk setiap grup API untuk mengecek status API apakah 200 atau tidak
for ( $i = 0; $i < $totalApiGroups; $i++ ) {
    // Dapatkan nama grup API
    $apiGroupName = $tables[$i]['api_group'];

    // Dapatkan semua API dalam grup ini
    $apis = $tables[$i]['apis'];

    // Hitung total API dalam grup ini
    $totalApis = count( $apis );

    // Lakukan perulangan untuk setiap API dalam grup ini
    echo "❖ Grup API: $apiGroupName" . PHP_EOL;
    for ( $j = 0; $j < $totalApis; $j++ ) {
        // Dapatkan URL API
        $url = $apis[$j]['url'];

        // $url kemungkinan berisi format markdown, jadi kita perlu menghapus karakter yang tidak perlu menggunakan regex
        // dan hanya ambil hostname saja. Contoh: [Link](https://www.mediawiki.org/wiki/API:Tutorial)
        // menjadi www.mediawiki.org

        // Perbaikan pola regex
        $url = preg_replace( '/\[.*?\]\((https?[^)]+)\)/', '$1', $url );



        // Cek status API
        $status = checkStatus( $url );

        // Tampilkan status API
        if ( $status ) {
            echo colorGreen( "\t✓ " . $apis[$j]['api_name'] . ' - ' . bold( "AKTIF" ) ) . PHP_EOL;
            echo colorYellow( "\t⎋ " . $url ) . PHP_EOL . PHP_EOL;
        } else {
            echo colorRed( "\t✗ " . $apis[$j]['api_name'] . ' - ' . bold( "TIDAK AKTIF" ) ) . PHP_EOL;
            echo colorYellow( "\t⎋ " . $url ) . PHP_EOL . PHP_EOL;

        }
    }

    echo PHP_EOL;
}

// buat function untuk check status API
function checkStatus($url)
{
    try {

        $ch = curl_init( $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        // set timeout
        curl_setopt( $ch, CURLOPT_TIMEOUT, 10 );
        curl_exec( $ch );
        $status = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
        curl_close( $ch );

        // if status is 20* or 30* then return true
        if ( $status >= 200 && $status < 400 ) {
            echo colorGreen( "\t◆ $status" ) . PHP_EOL;
            return true;
        } elseif ( $status == 403 ) {
            echo colorRed( "\t◆ $status ⍉ Gagal!. Kemungkinan terkena Cloudflare atau memang domain sudah tidak terdaftar." ) . PHP_EOL;
            return true;
        } else {
            echo colorRed( "\t◆ $status" ) . PHP_EOL;
            return false;
        }
    }
    catch (\Throwable $th) {
        echo colorRed( "\t◆ {$th->getMessage()}" ) . PHP_EOL;
        return false;
    }
}

function colorGreen(string $text)
{
    return "\e[32m" . $text . "\e[39m";
}

function colorRed(string $text)
{
    return "\e[31m" . $text . "\e[39m";
}

function colorYellow(string $text)
{
    return "\e[33m" . $text . "\e[39m";
}

function bold(string $text)
{
    return "\e[1m" . $text . "\e[22m";
}
?>