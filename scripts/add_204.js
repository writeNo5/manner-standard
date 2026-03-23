const fs = require('fs');
const dbPath = 'frontend/public/manner_db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const item = db.find(d => d.id === 204);
if (item) {
    item.image = '/images/card_204_worker_mic_mute.png';
    item.publish_date = new Date().toISOString().split('T')[0];
}
fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
console.log("Updated ID 204 successfully.");
