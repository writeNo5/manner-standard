const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../frontend/public/manner_db.json');
const cardsPath = path.join(__dirname, 'cards_data.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

db.forEach(item => {
  // reset image in case run multiple times
  if (!item.image) {
    item.image = "";
  }
  
  // match by title (name) or description (action_guide) or warm_line
  const matchingCard = cards.find(c => c.title === item.name || c.desc === item.action_guide || c.warm_line === item.warm_line);
  if (matchingCard) {
    item.image = matchingCard.image;
    item.name = matchingCard.title; // sync title exactly
    item.action_guide = matchingCard.desc; // sync desc exactly
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 4));
console.log("Migration complete!");
