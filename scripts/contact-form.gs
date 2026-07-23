/*
 * MUSIC WEAGHK contact form receiver.
 *
 * Setup:
 * 1. Create a Google Apps Script project and paste this file.
 * 2. Set Script property CONTACT_TO to the recipient email address.
 * 3. Deploy as a web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Paste the deployed web app URL into CONTACT_ENDPOINT in contact.html.
 */

function doGet() {
  return ContentService
    .createTextOutput('MUSIC WEAGHK contact form receiver is ready.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var recipient = PropertiesService.getScriptProperties().getProperty('CONTACT_TO');
  if (!recipient) {
    return jsonResponse({ ok: false, error: 'CONTACT_TO is not configured' });
  }

  var data = parsePayload(e);
  if (data.website) {
    return jsonResponse({ ok: true });
  }

  var name = cleanText(data.name);
  var replyTo = cleanText(data.replyTo);
  var category = cleanText(data.category);
  var subject = cleanText(data.subject);
  var message = cleanText(data.message);
  var page = cleanText(data.page);
  var sentAt = cleanText(data.sentAt);

  if (!name || !subject || !message) {
    return jsonResponse({ ok: false, error: 'Missing required fields' });
  }

  var mailSubject = '[MUSIC WEAGHK] ' + subject;
  var body = [
    'お名前: ' + name,
    '返信先: ' + (replyTo || '(未入力)'),
    '種別: ' + (category || '(未選択)'),
    '送信元ページ: ' + (page || '(不明)'),
    '送信日時: ' + (sentAt || new Date().toISOString()),
    '',
    '本文:',
    message
  ].join('\n');

  var options = {
    to: recipient,
    subject: mailSubject,
    body: body,
    name: 'MUSIC WEAGHK Contact Form'
  };

  if (replyTo) {
    options.replyTo = replyTo;
  }

  MailApp.sendEmail(options);
  return jsonResponse({ ok: true });
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function cleanText(value) {
  return String(value || '').replace(/\r\n/g, '\n').trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
