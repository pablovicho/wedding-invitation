/** @OnlyCurrentDoc */
/**
 * Backend de Google Sheets para la invitación (RSVP, Libro de visitas, Check-in de invitados).
 *
 * CÓMO INSTALAR (una sola vez, gratis):
 * 1. Crea una Google Sheets nueva -> menú Extensions -> Apps Script.
 * 2. Borra el contenido de Code.gs, pega todo este archivo y luego Save.
 * 3. Deploy -> New deployment -> type "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 *    -> Deploy -> autoriza el acceso -> copia "Web app URL" (termina en /exec).
 * 4. Pega esa URL en src/config/wedding.config.ts -> googleSheets.url
 * 5. Recomendado: Project Settings -> Show "appsscript.json" manifest file in editor,
 *    y limita oauthScopes a:
 *      "https://www.googleapis.com/auth/spreadsheets.currentonly"
 *      "https://www.googleapis.com/auth/script.external_request"
 *    El script ya lleva @OnlyCurrentDoc, así que solo accede a esta hoja, no a todo Drive.
 *
 * PROTECCIÓN (Project Settings -> Script Properties):
 *   TURNSTILE_SECRET  -> secreto de Cloudflare Turnstile (obligatorio para wish/rsvp; fail-closed si falta)
 *   ALLOWED_HOSTNAME  -> hostname permitido para tokens Turnstile (ej. invitacion.ejemplo.com)
 *   GOOGLE_CLIENT_ID  -> OAuth Client ID de Google (activa login para /checkin/)
 *   ADMIN_EMAILS      -> correos autorizados separados por coma, ej. "tu@correo.com,staff@correo.com"
 *
<<<<<<< HEAD
 * Las pestañas "Libro de visitas", "RSVP" y "CheckIn" se crean automáticamente cuando llegan los primeros datos.
 * Si se modifica este script, haz Deploy -> Manage deployments -> Edit -> Version: New version.
=======
 * Notas:
 * - wish/rsvp rechazan si Turnstile no está configurado o la verificación falla.
 * - checkin exige token de admin válido y cuenta permitida cuando GOOGLE_CLIENT_ID/ADMIN_EMAILS están configurados.
 * - Las pestañas "Ucapan", "RSVP" y "CheckIn" se crean automáticamente cuando llegan los primeros datos.
 * - Si se modifica este script, haz Deploy -> Manage deployments -> Edit -> Version: New version.
 * - Tras desplegar, renombra manualmente encabezados antiguos en hojas existentes si aplica
 *   (p. ej. "Waktu", "Nama", "Ucapan" en pestañas ya creadas con nombres previos).
>>>>>>> ebb3287 (fix: harden Apps Script and resolve lint issues)
 */

var SHEETS = {
  wish: { name: 'Libro de visitas', header: ['Hora', 'Nombre', 'Libro de visitas'] },
  rsvp: { name: 'RSVP', header: ['Waktu', 'Nombre', 'Asistencia', 'Cantidad', 'Notas'] },
  checkin: { name: 'CheckIn', header: ['Waktu', 'Nombre', 'Sesión/Mesa', 'Personal'] },
};

// Límite máximo de invitados por RSVP (constante compartida del script).
var RSVP_MAX_GUESTS = 3;

function props_() {
  return PropertiesService.getScriptProperties();
}

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

function genericError_() {
  return json_({ ok: false, error: 'No se pudo procesar la solicitud' });
}

function clean_(v, max) {
  // Evitar la inyección de fórmulas (=, +, -, @) y limitar la longitud
  var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function hash_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(s))).slice(0, 40);
}

/** Límite de frecuencia del lado del servidor (CacheService es compartido entre ejecuciones). */
function rate_(key, limit, seconds) {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get(key) || 0);
  if (n >= limit) return false;
  cache.put(key, String(n + 1), seconds);
  return true;
}

/**
 * Verifica Turnstile (fail-closed). Requiere TURNSTILE_SECRET y ALLOWED_HOSTNAME.
 * Debe llamarse fuera del lock porque realiza una solicitud remota.
 */
function verifyTurnstile_(token) {
  var p = props_();
  var secret = p.getProperty('TURNSTILE_SECRET');
  var allowedHostname = String(p.getProperty('ALLOWED_HOSTNAME') || '').trim().toLowerCase();
  if (!secret || !allowedHostname) return false;
  if (!token) return false;
  try {
    var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: String(token) },
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) return false;
    var j = JSON.parse(res.getContentText());
    var hostname = String(j.hostname || '').toLowerCase();
    return j.success === true && hostname === allowedHostname;
  } catch (err) {
    return false;
  }
}

/**
 * Verifica el ID token de Google con rate limit en la verificación remota.
 * Debe llamarse fuera del lock porque puede realizar una solicitud remota.
 */
function verifyAdmin_(token) {
  var p = props_();
  var clientId = p.getProperty('GOOGLE_CLIENT_ID');
  var admins = p.getProperty('ADMIN_EMAILS');
  if (!clientId || !admins || !token) return false;

  var cache = CacheService.getScriptCache();
  var tokenHash = hash_(token);
  var cacheKey = 'a:' + tokenHash;
  if (cache.get(cacheKey) === '1') return true;

  // Limitar intentos de verificación remota por token para reducir abuso/cuota.
  if (!rate_('av:' + tokenHash, 10, 300)) return false;

  try {
    var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(token)), {
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() !== 200) return false;
    var j = JSON.parse(res.getContentText());
    var email = String(j.email || '').toLowerCase();
    var allowed = admins
      .split(',')
      .map(function (e) {
        return e.trim().toLowerCase();
      })
      .filter(Boolean);
    var ok =
      j.aud === clientId &&
      String(j.email_verified) === 'true' &&
      allowed.indexOf(email) > -1 &&
      Number(j.exp) * 1000 > Date.now();
    if (ok) cache.put(cacheKey, '1', 300);
    return ok;
  } catch (err) {
    return false;
  }
}

/** GET ?action=wishes&offset=0&limit=8  -> los mensajes más recientes primero */
function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.action === 'wishes') {
      var sh = sheet_('wish');
      var total = Math.max(0, sh.getLastRow() - 1);
      var offset = Math.max(0, parseInt(p.offset || '0', 10));
      var limit = Math.min(50, Math.max(1, parseInt(p.limit || '8', 10)));
      var items = [];
      // La fila más reciente está abajo: tomar de abajo hacia arriba
      var end = total - offset; // número de filas de datos restantes
      var start = Math.max(1, end - limit + 1);
      if (end >= 1) {
        var rows = sh.getRange(start + 1, 1, end - start + 1, 3).getValues();
        for (var i = rows.length - 1; i >= 0; i--) {
          items.push({
            id: start + i,
            created_at: new Date(rows[i][0]).toISOString(),
            name: String(rows[i][1]).replace(/^'/, ''),
            message: String(rows[i][2]).replace(/^'/, ''),
          });
        }
      }
      return json_({ ok: true, total: total, items: items });
    }
    if (p.action === 'checkins') {
      var c = sheet_('checkin');
      return json_({ ok: true, total: Math.max(0, c.getLastRow() - 1) });
    }
    return json_({ ok: true, message: 'OK' });
  } catch (err) {
    return genericError_();
  }
}

/** POST body (text/plain JSON): { action: 'wish' | 'rsvp' | 'checkin', ... } */
function doPost(e) {
  var d;
  try {
    d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Solicitud inválida' });
  }

  // Verificaciones remotas fuera del lock para reducir tiempo de bloqueo y evitar fetchs bajo lock.
  var turnstileOk = null;
  var adminOk = null;
  if (d.action === 'wish' || d.action === 'rsvp') {
    turnstileOk = verifyTurnstile_(d.turnstileToken);
  } else if (d.action === 'checkin') {
    adminOk = verifyAdmin_(d.adminToken);
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return json_({ ok: false, error: 'Intenta de nuevo más tarde' });
  }

  try {
    var now = new Date();

    if (d.action === 'wish') {
      if (!turnstileOk) {
        return json_({ ok: false, error: 'No se pudo verificar la solicitud' });
      }
      var name = clean_(d.name, 60);
      var message = clean_(d.message, 500);
      if (!name || !message) return json_({ ok: false, error: 'Datos incompletos' });
      if (!rate_('w:' + hash_(name.toLowerCase()), 2, 60) || !rate_('w:global', 120, 60)) {
        return json_({ ok: false, error: 'Intenta de nuevo más tarde' });
      }
      var sh = sheet_('wish');
      sh.appendRow([now, name, message]);
      return json_({ ok: true, item: { id: sh.getLastRow() - 1, created_at: now.toISOString(), name: name, message: message } });
    }

    if (d.action === 'rsvp') {
      if (!turnstileOk) {
        return json_({ ok: false, error: 'No se pudo verificar la solicitud' });
      }
      // Acepta tanto los nombres nuevos (español) como los antiguos (inglés).
      var nombre = clean_(d.nombre != null ? d.nombre : d.name, 60);
      var asistencia = clean_(d.asistencia != null ? d.asistencia : d.attendance, 20);
      if (!nombre) return json_({ ok: false, error: 'Datos incompletos' });
      if (['Asistir', 'No Asistir', 'Aún Duda'].indexOf(asistencia) === -1) asistencia = 'Aún Duda';
      var cantidad = Number(d.cantidad != null ? d.cantidad : d.count);
      if (!isFinite(cantidad)) cantidad = asistencia === 'Asistir' ? 1 : 0;
      cantidad = Math.round(cantidad);
      if (asistencia === 'Asistir') {
        cantidad = Math.max(1, Math.min(RSVP_MAX_GUESTS, cantidad));
      } else {
        cantidad = 0;
      }
      var notas = clean_(d.notas != null ? d.notas : d.note, 300);
      // Límite por nombre aumentado a 3 por ventana.
      if (!rate_('r:' + hash_(nombre.toLowerCase()), 3, 600) || !rate_('r:global', 30, 60)) {
        return json_({ ok: false, error: 'Intenta de nuevo más tarde' });
      }
      sheet_('rsvp').appendRow([now, nombre, asistencia, cantidad, notas]);
      return json_({ ok: true });
    }

    if (d.action === 'checkin') {
      if (!adminOk) {
        return json_({ ok: false, error: 'No autorizado' });
      }
      var guest = clean_(d.name, 80);
      var session = clean_(d.session, 40);
      var staff = clean_(d.staff, 40);
      if (!guest) return json_({ ok: false, error: 'Datos incompletos' });
      if (!rate_('c:' + hash_(guest.toLowerCase()), 1, 5)) {
        return json_({ ok: false, error: 'Intenta de nuevo más tarde' });
      }
      sheet_('checkin').appendRow([now, guest, session, staff]);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'Solicitud inválida' });
  } catch (err) {
    return genericError_();
  } finally {
    lock.releaseLock();
  }
}
