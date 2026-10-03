/**
 * ============================================================
 * REKOD ALIRAN TUNAI
 * Google Apps Script Backend
 * ============================================================
 *
 * Frontend : Index.html
 * Database : Google Sheets
 * Sheet    : TRANSAKSI
 *
 * Fungsi:
 * - Papar Web App
 * - Setup Sheet automatik
 * - Tambah transaksi
 * - Edit transaksi
 * - Padam transaksi
 * - Baca semua transaksi
 * - Validation data
 * ============================================================
 */

const SHEET_NAME = 'TRANSAKSI';

const HEADERS = [
  'ID',
  'Tarikh',
  'Jenis',
  'Jumlah',
  'Catatan',
  'Catatan Tambahan',
  'Dicipta',
  'Dikemas Kini'
];


/**
 * ============================================================
 * SENARAI CATATAN YANG DIBENARKAN
 * ============================================================
 */

const ALLOWED_CATEGORIES = [
  'GAJI',
  'MYTNB',
  'MYUNIFI',
  'KAD KREDIT VISA',
  'KAD KREDIT MC',
  'PB VIOS',
  'HOMELOAN',
  'DUIT BELANJA MYWIFE',
  'AEON',
  'BONUS',
  'Lain-lain'
];


/**
 * ============================================================
 * PAPAR WEB APP
 * ============================================================
 */

function doGet() {

  setupSheet_();

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Rekod Aliran Tunai')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


/**
 * ============================================================
 * SETUP GOOGLE SHEET
 * ============================================================
 */

function setupSheet_() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      'Google Spreadsheet tidak dijumpai.'
    );
  }


  let sheet =
    ss.getSheetByName(SHEET_NAME);


  /*
   * Jika sheet TRANSAKSI belum wujud,
   * sistem akan cipta secara automatik.
   */

  if (!sheet) {

    sheet =
      ss.insertSheet(SHEET_NAME);

  }


  /*
   * Jika sheet masih kosong,
   * masukkan header.
   */

  if (sheet.getLastRow() === 0) {

    sheet
      .getRange(
        1,
        1,
        1,
        HEADERS.length
      )
      .setValues([
        HEADERS
      ]);

  }


  /*
   * Pastikan header sentiasa betul.
   */

  sheet
    .getRange(
      1,
      1,
      1,
      HEADERS.length
    )
    .setValues([
      HEADERS
    ]);


  /*
   * Format header.
   */

  sheet
    .getRange(
      1,
      1,
      1,
      HEADERS.length
    )
    .setFontWeight('bold');


  sheet.setFrozenRows(1);


  /*
   * Format Tarikh
   */

  sheet
    .getRange('B:B')
    .setNumberFormat(
      'dd/MM/yyyy'
    );


  /*
   * Format Jumlah RM
   */

  sheet
    .getRange('D:D')
    .setNumberFormat(
      '"RM" #,##0.00'
    );


  /*
   * Format timestamp
   */

  sheet
    .getRange('G:H')
    .setNumberFormat(
      'dd/MM/yyyy HH:mm:ss'
    );


  return sheet;
}


/**
 * ============================================================
 * DAPATKAN SHEET
 * ============================================================
 */

function getSheet_() {

  return setupSheet_();

}


/**
 * ============================================================
 * BACA SEMUA TRANSAKSI
 * ============================================================
 */

function getTransactions() {

  const sheet =
    getSheet_();


  const lastRow =
    sheet.getLastRow();


  /*
   * Tiada data selain header.
   */

  if (lastRow < 2) {

    return [];

  }


  const values =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        HEADERS.length
      )
      .getValues();


  const timezone =
    Session.getScriptTimeZone();


  const result =
    values
      .filter(row => row[0])
      .map(row => {


        /*
         * Format tarikh supaya
         * HTML menerima YYYY-MM-DD.
         */

        let date = '';

        if (
          row[1] instanceof Date
        ) {

          date =
            Utilities.formatDate(
              row[1],
              timezone,
              'yyyy-MM-dd'
            );

        } else {

          date =
            String(
              row[1] || ''
            );

        }


        return {

          id:
            String(
              row[0] || ''
            ),

          date:
            date,

          type:
            String(
              row[2] || ''
            ),

          amount:
            Number(
              row[3] || 0
            ),

          category:
            String(
              row[4] || ''
            ),

          extra:
            String(
              row[5] || ''
            ),

          created:
            formatDateTime_(
              row[6]
            ),

          updated:
            formatDateTime_(
              row[7]
            )

        };

      });


  return result;
}


/**
 * ============================================================
 * SIMPAN / EDIT TRANSAKSI
 * ============================================================
 */

function saveTransaction(data) {

  /*
   * Validation asas
   */

  if (!data) {

    throw new Error(
      'Data transaksi tidak diterima.'
    );

  }


  const date =
    String(
      data.date || ''
    ).trim();


  const type =
    String(
      data.type || ''
    ).trim();


  const amount =
    Number(
      data.amount
    );


  let category =
    String(
      data.category || ''
    ).trim();


  const extra =
    String(
      data.extra || ''
    ).trim();


  const id =
    String(
      data.id || ''
    ).trim();


  /*
   * ==========================================================
   * BACKWARD COMPATIBILITY
   * ==========================================================
   *
   * Jika frontend / rekod lama menghantar:
   *
   * KADKREDIT MC
   *
   * sistem akan tukar kepada:
   *
   * KAD KREDIT MC
   */

  if (
    category === 'KADKREDIT MC'
  ) {

    category =
      'KAD KREDIT MC';

  }


  /*
   * ==========================================================
   * VALIDATION TARIKH
   * ==========================================================
   */

  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(date)
  ) {

    throw new Error(
      'Tarikh tidak sah.'
    );

  }


  /*
   * ==========================================================
   * VALIDATION JENIS
   * ==========================================================
   */

  if (
    ![
      'income',
      'expense'
    ].includes(type)
  ) {

    throw new Error(
      'Jenis transaksi tidak sah.'
    );

  }


  /*
   * ==========================================================
   * VALIDATION JUMLAH
   * ==========================================================
   */

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    throw new Error(
      'Jumlah mestilah lebih daripada RM0.'
    );

  }


  /*
   * ==========================================================
   * VALIDATION CATATAN
   * ==========================================================
   */

  if (
    !ALLOWED_CATEGORIES
      .includes(category)
  ) {

    throw new Error(
      'Catatan tidak sah.'
    );

  }


  /*
   * ==========================================================
   * LAIN-LAIN WAJIB ADA CATATAN TAMBAHAN
   * ==========================================================
   */

  if (
    category === 'Lain-lain' &&
    !extra
  ) {

    throw new Error(
      'Catatan tambahan wajib diisi untuk Lain-lain.'
    );

  }


  /*
   * Had panjang catatan tambahan.
   */

  if (
    extra.length > 120
  ) {

    throw new Error(
      'Catatan tambahan terlalu panjang.'
    );

  }


  const sheet =
    getSheet_();


  const now =
    new Date();


  /*
   * Convert YYYY-MM-DD
   * kepada Date object.
   */

  const transactionDate =
    parseDate_(date);


  /*
   * ==========================================================
   * EDIT REKOD
   * ==========================================================
   */

  if (id) {

    const row =
      findRowById_(
        sheet,
        id
      );


    if (!row) {

      throw new Error(
        'Rekod yang hendak diedit tidak dijumpai.'
      );

    }


    /*
     * Ambil timestamp asal.
     */

    const created =
      sheet
        .getRange(
          row,
          7
        )
        .getValue()
      || now;


    sheet
      .getRange(
        row,
        1,
        1,
        HEADERS.length
      )
      .setValues([
        [
          id,
          transactionDate,
          type,
          amount,
          category,
          extra,
          created,
          now
        ]
      ]);


    return {

      success: true,

      action:
        'updated',

      id:
        id,

      message:
        'Rekod berjaya dikemas kini.'

    };

  }


  /*
   * ==========================================================
   * TAMBAH REKOD BARU
   * ==========================================================
   */

  const newId =
    Utilities.getUuid();


  sheet.appendRow([

    newId,

    transactionDate,

    type,

    amount,

    category,

    extra,

    now,

    now

  ]);


  return {

    success: true,

    action:
      'created',

    id:
      newId,

    message:
      'Rekod berjaya disimpan.'

  };

}


/**
 * ============================================================
 * PADAM TRANSAKSI
 * ============================================================
 */

function deleteTransaction(id) {

  id =
    String(
      id || ''
    ).trim();


  if (!id) {

    throw new Error(
      'ID rekod tidak sah.'
    );

  }


  const sheet =
    getSheet_();


  const row =
    findRowById_(
      sheet,
      id
    );


  if (!row) {

    throw new Error(
      'Rekod tidak dijumpai.'
    );

  }


  sheet.deleteRow(row);


  return {

    success: true,

    id:
      id,

    message:
      'Rekod berjaya dipadam.'

  };

}


/**
 * ============================================================
 * CARI ROW BERDASARKAN ID
 * ============================================================
 */

function findRowById_(
  sheet,
  id
) {

  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {

    return null;

  }


  const ids =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        1
      )
      .getValues();


  for (
    let i = 0;
    i < ids.length;
    i++
  ) {

    if (
      String(ids[i][0]) ===
      String(id)
    ) {

      /*
       * +2 kerana:
       *
       * array bermula 0
       * row pertama ialah header
       */

      return i + 2;

    }

  }


  return null;
}


/**
 * ============================================================
 * PARSE TARIKH
 * ============================================================
 */

function parseDate_(
  dateString
) {

  const parts =
    dateString.split('-');


  if (
    parts.length !== 3
  ) {

    throw new Error(
      'Format tarikh tidak sah.'
    );

  }


  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);


  const date =
    new Date(
      year,
      month - 1,
      day
    );


  /*
   * Semak tarikh sebenar.
   *
   * Contoh:
   * 2026-02-31
   * tidak dibenarkan.
   */

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {

    throw new Error(
      'Tarikh tidak sah.'
    );

  }


  return date;
}


/**
 * ============================================================
 * FORMAT DATETIME
 * ============================================================
 */

function formatDateTime_(
  value
) {

  if (!value) {

    return '';

  }


  if (
    value instanceof Date
  ) {

    return Utilities.formatDate(

      value,

      Session.getScriptTimeZone(),

      'yyyy-MM-dd HH:mm:ss'

    );

  }


  return String(value);
}


/**
 * ============================================================
 * OPTIONAL:
 * NORMALISASI DATA LAMA
 * ============================================================
 *
 * Fungsi ini TIDAK berjalan secara automatik.
 *
 * Jika Google Sheet mempunyai rekod lama:
 *
 * KADKREDIT MC
 *
 * fungsi ini boleh digunakan sekali
 * untuk menukarnya kepada:
 *
 * KAD KREDIT MC
 */

function normalizeOldCategories() {

  const sheet =
    getSheet_();


  const lastRow =
    sheet.getLastRow();


  if (lastRow < 2) {

    return {
      success:true,
      updated:0
    };

  }


  const range =
    sheet.getRange(
      2,
      5,
      lastRow - 1,
      1
    );


  const values =
    range.getValues();


  let updated = 0;


  values.forEach(
    row => {

      if (
        String(row[0]).trim()
        === 'KADKREDIT MC'
      ) {

        row[0] =
          'KAD KREDIT MC';

        updated++;

      }

    }
  );


  if (updated > 0) {

    range.setValues(values);

  }


  return {

    success:true,

    updated:updated,

    message:
      updated +
      ' rekod lama dikemas kini.'

  };

}