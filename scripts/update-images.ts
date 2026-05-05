/**
 * Update place images in mockPlaces.ts AND in Supabase.
 * Run: npx tsx scripts/update-images.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80`;

// Place ID → [primary, secondary] image URLs
const imageMap: Record<string, [string, string]> = {
  p001: [u('1577495508048-b635879837f1'), u('1611329857570-f02f340e7378')], // Kuwait Towers
  p002: [u('1518998053901-5348d3961a04'), u('1599008633840-052c7f756385')], // Grand Mosque
  p003: [u('1601814933824-fd0b574dd592'), u('1587474260584-136574528ed5')], // Mubarakiya Souq
  p004: [u('1559827260-dc66d52bef19'), u('1507525428034-b723cf961d3e')],     // Failaka Island
  p005: [u('1587474260584-136574528ed5'), u('1610631066894-62452ccb927c')], // Sheikh Abdullah Museum
  p006: [u('1517248135467-4c7edcad34c4'), u('1555939594-58d7cb561ad1')],     // Freej Sweileh
  p007: [u('1559339352-11d035aa65de'), u('1414235077428-338989a2e8c0')],     // Beit 7
  p008: [u('1568901346375-23c9450c58cd'), u('1414235077428-338989a2e8c0')], // Mahallat
  p009: [u('1565299624946-b28f40a0ae38'), u('1571091718767-18b5b1457add')], // Meez (burger)
  p010: [u('1414235077428-338989a2e8c0'), u('1559339352-11d035aa65de')],     // Sultan Al Bahar (seafood)
  p011: [u('1495474472287-4d71bcdd2085'), u('1554118811-1e0d58224f24')],     // Caribou Coffee
  p012: [u('1453614512568-c4024d13c247'), u('1505740420928-5e560c06d30e')], // % Arabica
  p013: [u('1559496417-e7f25cb247f3'), u('1453614512568-c4024d13c247')],     // TRUE Coffee
  p014: [u('1521017432531-fbd92d768814'), u('1559925393-8be0ec4767c8')],     // Memo Cafe
  p015: [u('1554118811-1e0d58224f24'), u('1559925393-8be0ec4767c8')],         // Elwood
  p016: [u('1604147495798-57beb5d6af73'), u('1530268729831-4b0b9e170218')], // Al Faris Laundry
  p017: [u('1583416750470-965b2707b355'), u('1521590832167-7bcbfaa6381f')], // Elite Salon
  p018: [u('1581094794329-c8112a89af12'), u('1530268729831-4b0b9e170218')], // Smart Auto
  p019: [u('1576091160399-112ba8d25d1d'), u('1530268729831-4b0b9e170218')], // Al Dawaa Pharmacy
  p020: [u('1519567241046-7f570eee3ce6'), u('1611162617213-7d7a39e9b1d7')], // Avenues Mall
  p021: [u('1555529669-e69e7aa0ba9a'), u('1542038784456-1ea8e935640e')],     // 360 Mall
  p022: [u('1611162617213-7d7a39e9b1d7'), u('1519567241046-7f570eee3ce6')], // Marina Mall
  p023: [u('1542038784456-1ea8e935640e'), u('1601814933824-fd0b574dd592')], // Al Kout Mall
  p024: [u('1611162617213-7d7a39e9b1d7'), u('1555529669-e69e7aa0ba9a')],     // Souq Sharq
  p025: [u('1551782450-a2132b4ba21d'), u('1577495508048-b635879837f1')],     // Burj Restaurant
};

// 1. Update lib/data/mockPlaces.ts
const mockFile = path.join(__dirname, '../lib/data/mockPlaces.ts');
let content = fs.readFileSync(mockFile, 'utf-8');

for (const [pid, [img1, img2]] of Object.entries(imageMap)) {
  const re = new RegExp(
    `(id:\\s*'${pid}'[\\s\\S]*?images:\\s*\\[)[^\\]]*?(\\s*\\])`,
    'g'
  );
  content = content.replace(re, (_m, before, after) => {
    return `${before}\n      '${img1}',\n      '${img2}',\n    ${after.trim()}`;
  });
}

fs.writeFileSync(mockFile, content);
console.log('✓ Updated lib/data/mockPlaces.ts');

// 2. Generate SQL for Supabase
const lines: string[] = [];
for (const [pid, [img1, img2]] of Object.entries(imageMap)) {
  const json = JSON.stringify([img1, img2]).replace(/'/g, "''");
  lines.push(`UPDATE places SET images = '${json}'::jsonb WHERE id = '${pid}';`);
}

const sqlFile = '/tmp/update-images.sql';
fs.writeFileSync(sqlFile, lines.join('\n'));
console.log(`✓ Wrote SQL to ${sqlFile} (${lines.length} updates)`);
console.log('\nNow apply via Supabase MCP execute_sql.');
