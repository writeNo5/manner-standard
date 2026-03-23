const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../frontend/public/manner_db.json');
const cardsPath = path.join(__dirname, 'cards_data.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

// 1. Reset all images
db.forEach(item => item.image = "");

// 2. Map using the URL filename which contains the ID!
let matchCount = 0;
cards.forEach(c => {
  // example: "/images/card_43_student_kindwords_1774184729451.png"
  // mvp examples: "/images/mvp_v2_student_latenight_1774139813708.png"
  let matchId = null;
  
  const idMatch = c.image.match(/card_(\d+)_/);
  if (idMatch && idMatch[1]) {
    matchId = parseInt(idMatch[1], 10);
  } else {
    // If it's a MVP v2 image, we have to match by string similarity
    // Let's just find the closest title match for MVP ones
    const possible = db.find(d => d.name.includes(c.title.split(' ')[0]) || c.title.includes(d.name.split(' ')[0]));
    if (possible) matchId = possible.id;
  }
  
  if (matchId) {
    const target = db.find(d => d.id === matchId);
    if (target) {
      target.image = c.image;
      target.name = c.title; // overwrite with the polished title
      target.action_guide = c.desc;
      target.warm_line = c.warm_line;
      matchCount++;
      return;
    }
  }
  
  // If still no match, just put it at the very top of the DB as a new entry
  console.log("No ID match found for:", c.image, "- Prepending as ID 100" + matchCount);
  matchCount++;
  db.unshift({
    id: 1000 + matchCount,
    persona: c.image.includes('worker') ? 'worker' : 'student',
    theme: "MVP 스페셜 카드",
    situation: "공통",
    name: c.title,
    action_guide: c.desc,
    warm_line: c.warm_line,
    image: c.image,
    is_mvp: true,
    publish_date: ""
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
console.log(`Migration override complete. Matched/Inserted ${matchCount} out of ${cards.length} cards.`);
