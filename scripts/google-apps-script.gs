/**
 * Backend Google Sheets untuk undangan (RSVP, Ucapan & Doa, Check-in tamu).
 *
 * CARA PASANG (sekali saja, gratis):
 * 1. Buat Google Sheets baru -> menu Extensions -> Apps Script.
 * 2. Hapus isi Code.gs, tempel seluruh file ini, lalu Save.
 * 3. Deploy -> New deployment -> type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 *    -> Deploy -> izinkan akses -> salin "Web app URL" (berakhiran /exec).
 * 4. Tempel URL itu di src/config/wedding.config.ts -> googleSheets.url
 *
 * Tab "Ucapan", "RSVP" dan "CheckIn" dibuat otomatis saat data pertama masuk.
 * Kalau script ini diubah, lakukan Deploy -> Manage deployments -> Edit -> Version: New version.
 */

var SHEETS = {
  wish: { name: 'Ucapan', header: ['Waktu', 'Nama', 'Ucapan'] },
  rsvp: { name: 'RSVP', header: ['Waktu', 'Nama', 'Kehadiran', 'Jumlah', 'Pesan'] },
  checkin: { name: 'CheckIn', header: ['Waktu', 'Nama', 'Sesi/Meja', 'Petugas'] },
};

function sheet_(kind) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var def = SHEETS[kind];
  var sh = ss.getSheetByName(def.name);
  if (!sh) {
    sh = ss.insertSheet(def.name);
    sh.appendRow(def.header);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, def.header.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max) {
  // Cegah formula injection (=, +, -, @) dan batasi panjang
  var s = String(v == null ? '' : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** GET ?action=wishes&offset=0&limit=8  -> ucapan terbaru dulu */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'wishes') {
    var sh = sheet_('wish');
    var total = Math.max(0, sh.getLastRow() - 1);
    var offset = Math.max(0, parseInt(p.offset || '0', 10));
    var limit = Math.min(50, Math.max(1, parseInt(p.limit || '8', 10)));
    var items = [];
    // Baris terbaru ada di bawah: ambil dari bawah ke atas
    var end = total - offset; // jumlah baris data yang tersisa
    var start = Math.max(1, end - limit + 1);
    if (end >= 1) {
      var rows = sh.getRange(start + 1, 1, end - start + 1, 3).getValues();
      for (var i = rows.length - 1; i >= 0; i--) {
        items.push({ id: start + i, created_at: new Date(rows[i][0]).toISOString(), name: String(rows[i][1]).replace(/^'/, ''), message: String(rows[i][2]).replace(/^'/, '') });
      }
    }
    return json_({ ok: true, total: total, items: items });
  }
  if (p.action === 'checkins') {
    var c = sheet_('checkin');
    return json_({ ok: true, total: Math.max(0, c.getLastRow() - 1) });
  }
  return json_({ ok: true, message: 'Backend undangan aktif' });
}

/** POST body (text/plain JSON): { action: 'wish' | 'rsvp' | 'checkin', ... } */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var now = new Date();
    if (d.action === 'wish') {
      var name = clean_(d.name, 60), message = clean_(d.message, 500);
      if (!name || !message) return json_({ ok: false, error: 'Nama dan ucapan wajib diisi' });
      var sh = sheet_('wish');
      sh.appendRow([now, name, message]);
      return json_({ ok: true, item: { id: sh.getLastRow() - 1, created_at: now.toISOString(), name: d.name, message: d.message } });
    }
    if (d.action === 'rsvp') {
      sheet_('rsvp').appendRow([now, clean_(d.name, 60), clean_(d.attendance, 20), Number(d.count) || 0, clean_(d.note, 300)]);
      return json_({ ok: true });
    }
    if (d.action === 'checkin') {
      sheet_('checkin').appendRow([now, clean_(d.name, 80), clean_(d.session, 40), clean_(d.staff, 40)]);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'Aksi tidak dikenal' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
