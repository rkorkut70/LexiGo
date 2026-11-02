const fs = require('fs');
const XLSX = require('xlsx');

console.log('1. Reading words_data.js...');
const content = fs.readFileSync('c:/anti-gravity/kelime/words_data.js', 'utf8');
const rawWords = new Function(content + '; return WORDS_DATA;')();
console.log('Total words loaded:', rawWords.length);

function formatRow(w) {
  return {
    'ID': w.id || '',
    'Dil': w.dil || '',
    'Seviye': w.seviye || '',
    'Kitap': w.kitap || '',
    'Ünite No': w.unite_no != null ? w.unite_no : '',
    'Ünite Adı': w.unite_adi || '',
    'Yabancı Kelime': w.kelime || '',
    'Telaffuz (IPA)': w.telaffuz || '',
    'Sözcük Türü': w.tur || '',
    'Türkçe Anlamı': (w['anlamı'] || w.anlami || w.anlam || '').trim(),
    'Örnek Cümle': (w.ornek_cumle || w['örnek_cumle'] || w.ornek || '').trim(),
    'Cümle Çevirisi': (w.cumle_ceviri || w.ornek_anlam || '').trim()
  };
}

console.log('2. Formatting data rows...');
const allRows = rawWords.map(formatRow);
const enRows = rawWords.filter(w => w.dil === 'EN-TR').map(formatRow);
const deRows = rawWords.filter(w => w.dil === 'DE-TR').map(formatRow);
const frRows = rawWords.filter(w => w.dil === 'FR-TR').map(formatRow);

// İstatistik ve Özet
const stats = [
  { 'Kategori': 'Genel Toplam', 'Açıklama': 'Tüm Diller ve Seviyeler', 'Kelime Sayısı': rawWords.length },
  { 'Kategori': 'İngilizce (EN-TR)', 'Açıklama': 'A1, A2, B1, B2 Gateway to the World', 'Kelime Sayısı': enRows.length },
  { 'Kategori': 'Almanca (DE-TR)', 'Açıklama': 'A1.1 - B2.2 Mesleki & Genel Almanca', 'Kelime Sayısı': deRows.length },
  { 'Kategori': 'Fransızca (FR-TR)', 'Açıklama': 'A1.1 - B2.2 Mesleki & Genel Fransızca', 'Kelime Sayısı': frRows.length }
];

const levelMap = {};
rawWords.forEach(w => {
  const key = (w.dil || 'Bilinmiyor') + ' - ' + (w.seviye || 'Bilinmiyor');
  levelMap[key] = (levelMap[key] || 0) + 1;
});
Object.keys(levelMap).sort().forEach(k => {
  stats.push({ 'Kategori': 'Dil & Seviye Dağılımı', 'Açıklama': k, 'Kelime Sayısı': levelMap[k] });
});

console.log('3. Creating Excel workbook...');
const wb = XLSX.utils.book_new();

const colWidths = [
  { wch: 8 },   // ID
  { wch: 10 },  // Dil
  { wch: 10 },  // Seviye
  { wch: 28 },  // Kitap
  { wch: 10 },  // Ünite No
  { wch: 24 },  // Ünite Adı
  { wch: 25 },  // Yabancı Kelime
  { wch: 18 },  // Telaffuz
  { wch: 14 },  // Tür
  { wch: 35 },  // Anlamı
  { wch: 60 },  // Örnek Cümle
  { wch: 60 }   // Cümle Çevirisi
];

const statColWidths = [
  { wch: 26 },
  { wch: 45 },
  { wch: 16 }
];

function addSheet(name, data, widths) {
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = widths;
  XLSX.utils.book_append_sheet(wb, ws, name);
}

addSheet('Özet ve İstatistik', stats, statColWidths);
addSheet('Tüm Kelimeler (11519)', allRows, colWidths);
addSheet('İngilizce (EN-TR)', enRows, colWidths);
addSheet('Almanca (DE-TR)', deRows, colWidths);
addSheet('Fransızca (FR-TR)', frRows, colWidths);

const outMain = 'c:/anti-gravity/kelime/LexiGo_Kelime_Veritabani.xlsx';
const outBackupDir = 'c:/anti-gravity/yedekler/kelime';
const outBackup = outBackupDir + '/LexiGo_Kelime_Veritabani.xlsx';
const outAdmin = 'c:/anti-gravity/lexiq-admin/LexiGo_Kelime_Veritabani.xlsx';

console.log('4. Writing Excel file:', outMain);
XLSX.writeFile(wb, outMain);

if (!fs.existsSync(outBackupDir)) {
  fs.mkdirSync(outBackupDir, { recursive: true });
}
console.log('5. Copying to backup folder:', outBackup);
fs.copyFileSync(outMain, outBackup);

if (fs.existsSync('c:/anti-gravity/lexiq-admin')) {
  console.log('6. Copying to admin folder:', outAdmin);
  fs.copyFileSync(outMain, outAdmin);
}

const sizeMb = (fs.statSync(outMain).size / 1024 / 1024).toFixed(2);
console.log('DONE! File created successfully. Size:', sizeMb, 'MB');
