# 💰 Rekod Aliran Tunai Web App

Web app untuk merekod, mengurus dan memantau **pendapatan serta
perbelanjaan harian**. Aplikasi dibina menggunakan **HTML, CSS dan
Vanilla JavaScript**, dengan **Google Apps Script** sebagai backend dan
**Google Sheets** sebagai tempat penyimpanan data.

## ✨ Features

-   ✅ Rekod pendapatan dan perbelanjaan
-   ✅ Edit dan padam transaksi
-   ✅ Simpan data terus ke Google Sheets
-   ✅ Dashboard KPI dinamik
-   ✅ Paparan **Bulanan / Tahunan / Keseluruhan**
-   ✅ Pilihan bulan dan tahun
-   ✅ Carian transaksi
-   ✅ Filter Pendapatan / Perbelanjaan
-   ✅ Ringkasan perbelanjaan mengikut catatan
-   ✅ Ringkasan bulanan
-   ✅ Eksport CSV
-   ✅ Backup JSON
-   ✅ Responsive untuk desktop dan telefon
-   ✅ Tiada framework JavaScript diperlukan

## 📊 Dashboard

Dashboard memaparkan empat KPI utama:

  KPI                      Fungsi
  ------------------------ -------------------------------------
  💵 Jumlah Pendapatan     Jumlah pendapatan mengikut tempoh
  💸 Jumlah Perbelanjaan   Jumlah perbelanjaan mengikut tempoh
  💰 Baki Bersih           Pendapatan − Perbelanjaan
  📋 Bilangan Rekod        Jumlah transaksi

Pengguna boleh memilih:

``` text
Bulanan
Tahunan
Keseluruhan
```

Contoh struktur filter:

``` text
Tempoh Dashboard
        │
        ├── Bulanan
        │      └── Oktober 2026
        │
        ├── Tahunan
        │      └── 2026
        │
        └── Keseluruhan
```

## 📝 Kategori Transaksi

``` text
GAJI
MYTNB
MYUNIFI
KAD KREDIT VISA
KAD KREDIT MC
PB VIOS
HOMELOAN
DUIT BELANJA MYWIFE
AEON
BONUS
Lain-lain
```

Jika **Lain-lain** dipilih, pengguna perlu memasukkan **Catatan
Tambahan**.

## 🛠️ Tech Stack

  Technology           Purpose
  -------------------- --------------------------
  HTML5                Struktur web app
  CSS3                 UI dan responsive design
  Vanilla JavaScript   Logik aplikasi
  Google Apps Script   Backend
  Google Sheets        Penyimpanan data

## 🏗️ Architecture

``` text
┌─────────────────────────────┐
│            USER             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         Index.html          │
│ HTML + CSS + JavaScript     │
└──────────────┬──────────────┘
               │
               │ google.script.run
               ▼
┌─────────────────────────────┐
│          Code.gs            │
│ Google Apps Script Backend  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Google Sheets        │
│         TRANSAKSI           │
└─────────────────────────────┘
```

## 📁 Project Structure

``` text
cash-flow-tracker-google-apps-script/
│
├── Code.gs
├── Index.html
└── README.md
```

## 🗃️ Google Sheets Structure

Aplikasi menggunakan sheet:

``` text
TRANSAKSI
```

Struktur data:

  -------------------------------------------------------------------------------
  ID       Tarikh   Jenis         Jumlah Catatan   Catatan    Dicipta   Dikemas
                                                   Tambahan             Kini
  -------- -------- -------- ----------- --------- ---------- --------- ---------

  -------------------------------------------------------------------------------

Contoh:

``` text
ID      : UUID
Tarikh  : 03/10/2026
Jenis   : expense
Jumlah  : 800
Catatan : AEON
```

## 🚀 Installation

### 1. Create Google Sheet

Cipta Google Sheet baharu untuk menyimpan rekod transaksi.

### 2. Open Apps Script

Daripada Google Sheets:

``` text
Extensions
↓
Apps Script
```

### 3. Add Project Files

Pastikan projek mempunyai:

``` text
Code.gs
Index.html
```

Masukkan backend Google Apps Script ke `Code.gs` dan antaramuka web app
ke `Index.html`.

### 4. Configure Time Zone

Tetapkan zon masa projek kepada **GMT+08:00** yang sesuai untuk
Malaysia/Singapura.

### 5. Deploy Web App

``` text
Deploy
↓
New deployment
↓
Web app
```

Selepas deployment berjaya, buka URL Web App yang berakhir dengan:

``` text
/exec
```

## 🔄 Updating Deployment

Selepas mengubah `Index.html` atau `Code.gs`:

``` text
Save
↓
Deploy
↓
Manage deployments
↓
Edit
↓
New version
↓
Deploy
```

Kemudian refresh Web App.

## 💾 Data Flow

``` text
Isi Borang
    ↓
Simpan Rekod
    ↓
Index.html
    ↓
saveTransaction()
    ↓
Code.gs
    ↓
Google Sheets
    ↓
TRANSAKSI
```

Selepas data disimpan:

``` text
Google Sheets
    ↓
getTransactions()
    ↓
Index.html
    ↓
Dashboard dikemas kini
```

## 📈 Dashboard Filtering

Filter tempoh utama mengawal:

``` text
Tempoh Dashboard
        │
        ├── Jumlah Pendapatan
        ├── Jumlah Perbelanjaan
        ├── Baki Bersih
        ├── Bilangan Rekod
        ├── Rekod Transaksi
        ├── Perbelanjaan Mengikut Catatan
        └── Ringkasan Bulanan
```

### Bulanan

Dashboard hanya mengira transaksi bagi bulan yang dipilih.

### Tahunan

Dashboard mengira transaksi bagi tahun yang dipilih.

### Keseluruhan

Dashboard mengira semua transaksi yang direkodkan.

## 🔐 Validation

Backend melakukan validation sebelum transaksi disimpan:

``` text
✓ Tarikh mesti sah
✓ Jenis transaksi mesti sah
✓ Jumlah mesti lebih daripada RM0
✓ Catatan mesti daripada kategori yang dibenarkan
✓ Lain-lain memerlukan Catatan Tambahan
✓ Catatan Tambahan mempunyai had panjang
```

## 📤 Export CSV

Data boleh dieksport sebagai:

``` text
rekod-aliran-tunai.csv
```

Fail CSV boleh dibuka menggunakan Microsoft Excel, Google Sheets atau
aplikasi spreadsheet lain.

## 💾 Backup JSON

Web app turut menyediakan backup dalam format:

``` text
backup-aliran-tunai.json
```

Contoh:

``` json
[
  {
    "id": "example-id",
    "date": "2026-10-03",
    "type": "expense",
    "amount": 800,
    "category": "AEON",
    "extra": ""
  }
]
```

## 📱 Responsive Design

Antaramuka direka untuk:

-   🖥️ Desktop
-   💻 Laptop
-   📱 Tablet
-   📱 Smartphone

## 🗺️ Future Roadmap

-   [ ] Budget bulanan
-   [ ] Sasaran simpanan
-   [ ] Month-over-Month comparison
-   [ ] Year-over-Year comparison
-   [ ] Import CSV
-   [ ] Progressive Web App (PWA)
-   [ ] Dark Mode
-   [ ] Offline mode menggunakan `localStorage`
-   [ ] Offline → Google Sheets synchronization
-   [ ] Microsoft Excel / OneDrive integration
-   [ ] Authentication
-   [ ] Dashboard analitik tambahan

## 🔒 Privacy

Projek ini dibangunkan untuk pengurusan kewangan peribadi.

**Jangan commit data kewangan sebenar ke public repository.**

Elakkan memuat naik:

``` text
❌ Data transaksi sebenar
❌ Credential
❌ Password
❌ Access token
❌ API key
❌ Maklumat kewangan sensitif
```

Untuk screenshot portfolio, gunakan **dummy data**.

## 🎯 Project Purpose

Projek ini dibangunkan sebagai latihan praktikal dalam:

-   Frontend web development
-   Vanilla JavaScript
-   CRUD operations
-   Google Apps Script
-   Google Sheets integration
-   Data filtering
-   Dashboard development
-   Data validation
-   Cloud-based web application

Ia juga sesuai digunakan sebagai projek portfolio GitHub.

## 📄 License

MIT License boleh digunakan jika projek ini mahu dikongsi sebagai projek
sumber terbuka.

## 👨‍💻 Author

**Muhammad Munzir**

GitHub: `Munzir-Mdn`

------------------------------------------------------------------------

⭐ Jika projek ini berguna, pertimbangkan untuk memberikan **Star** pada
repository.
