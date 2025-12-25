# Panduan Kontribusi ke DAFTAR API LOKAL INDONESIA

Selamat datang di panduan kontribusi untuk proyek "DAFTAR API LOKAL INDONESIA". Kami senang Anda ingin berkontribusi!

## Kode Etik

Kami menerapkan Kode Etik yang diharapkan dipatuhi oleh semua peserta proyek. Mohon [baca teks lengkapnya](./CODE_OF_CONDUCT.md) agar Anda memahami tindakan-tindakan yang akan atau tidak akan ditoleransi.

## Proses Pengembangan Kami

Kami menggunakan GitHub untuk menyinkronkan kode dari dan ke repositori internal kami. Kami akan menggunakan GitHub untuk melacak masalah dan permintaan fitur, serta menerima permintaan tarik (pull requests).

## Permintaan Tarik (Pull Requests)

Kami dengan penuh semangat menyambut permintaan tarik (pull requests) dari Anda. Untuk berkontribusi pada proyek ini, ikuti langkah-langkah di bawah ini:

1. **Fork Repositori dan Buat Cabang**
   - Fork repositori ini ke akun GitHub Anda.
   - Buatlah cabang baru dari branch `master` di repositori Anda.

2. **Tambahkan Restful API ke Data**
   - Buka direktori `data` dan pilih kategori yang sesuai.
   - Tambahkan informasi Restful API Anda ke semua file bahasa yang tersedia (contohnya: `id.json`, `en.json`, dst), sesuaikan dengan format yang telah ada.

3. **Lakukan Pengecekan dan Uji**
   - Jalankan perintah `bun check` dan pastikan tidak ada kesalahan.
   - Jalankan `bun start` untuk memastikan perubahan yang Anda buat dapat berjalan dengan baik.

4. **Commit, Push, dan Pull-Request**
   - Lakukan commit perubahan Anda dengan deskripsi yang jelas.
   - Push commit Anda ke cabang di repositori GitHub Anda.
   - Ajukan pull-request dari cabang Anda ke branch `master` di repositori ini.

Kami akan melakukan review pada permintaan tarik yang diajukan dan merespons segera setelah memungkinkan. Terima kasih atas kontribusi Anda untuk membuat DAFTAR API LOKAL INDONESIA semakin berkembang!

Pastikan untuk memperhatikan langkah-langkah ini dengan seksama untuk memastikan kontribusi Anda dapat diintegrasikan dengan lancar ke dalam proyek. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk bertanya.

## Masalah (Issues)

Kami menggunakan masalah GitHub untuk melacak bug publik. Pastikan deskripsi Anda jelas dan memiliki petunjuk yang cukup untuk dapat memperbanyak masalah. Jika memungkinkan, berikan demo minimal dari masalah tersebut.

## Pengelolaan Masalah

Berikut beberapa tag yang kami gunakan untuk mengatur masalah di repositori ini:

- `good first issue` - Kandidat baik untuk kontributor baru dalam proyek ini.
- `help wanted` - Masalah yang perlu ditangani dan kami menyambut permintaan tarik untuknya, tetapi mungkin memerlukan penyelidikan atau pekerjaan yang signifikan.
- `support` - Permintaan bantuan terkait konsep atau potongan kode, tetapi bukan masalah proyek.
- `needs more info` - Langkah reproduksi yang hilang atau konteks untuk masalah proyek dan pertanyaan dukungan.
- `discussion` - Masalah di mana orang membahas pendekatan dan gagasan berbagai hal.
- `question` - Pertanyaan khusus untuk para pengelola.
- `documentation` - Terkait peningkatan dokumentasi proyek.

## Stabilitas

Kami sangat memperhatikan stabilitas dan kualitas daftar API kami. Berikut adalah langkah-langkah yang kami lakukan untuk menjaga stabilitas proyek ini:

1. **Pengecekan Otomatis Bulanan**
   - Setiap bulan, kami akan menjalankan pengecekan otomatis menggunakan GitHub Actions.
   - Jika pada bulan pertama HTTP status code dari URL dokumentasi bukan 200 (berhasil), maka status akan di nonaktifkan sementara.
   - Jika pada bulan kedua HTTP status code masih bukan 200, maka URL tersebut akan dihapus dari daftar.

2. **Pemantauan Otomatis NSFW**
   - Saat pengecekan otomatis berlangsung, kami juga akan melakukan pengambilan data dari URL dokumentasi yang ada.
   - Jika pada body response URL tersebut terdapat kata yang ada dalam daftar kata "blacklist," maka URL tersebut akan dihapus secara otomatis dari daftar dan ditandai sebagai NSFW (Not Safe For Work).

3. **Pengecekan Manual Berkala**
   - Selain pengecekan otomatis bulanan, kami juga melakukan pengecekan manual secara berkala terhadap seluruh daftar API.
   - Pengecekan manual ini melibatkan pemeriksaan kualitas dan validitas setiap entri.

Kami berkomitmen untuk menjaga kualitas dan keandalan daftar API ini. Kontribusi Anda dalam memantau, melaporkan, atau bahkan membantu melakukan pengecekan akan sangat dihargai. Jika Anda menemukan masalah atau memiliki saran, jangan ragu untuk berpartisipasi dalam usaha ini.

## Lisensi

Dengan berkontribusi pada DAFTAR API LOKAL INDONESIA, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah [Lisensi Attribution 4.0 International](./LICENSE.md).
