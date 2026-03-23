const fs = require('fs');

let appSrc = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add AdminDashboard import
if (!appSrc.includes('import AdminDashboard')) {
  appSrc = appSrc.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport AdminDashboard from './AdminDashboard';");
}

// 2. Remove demoCards and original AdminDashboard
const demoCardsStart = appSrc.indexOf('const demoCards = [');
const appStart = appSrc.indexOf('function App() {');
if (demoCardsStart !== -1 && appStart !== -1) {
  appSrc = appSrc.substring(0, demoCardsStart) + appSrc.substring(appStart);
}

// 3. Inject State and Fetching into App()
if (!appSrc.includes('const [cards, setCards] = useState([]);')) {
  appSrc = appSrc.replace(/function App\(\) \{\s*const \[isAdminMode/, `function App() {\n  const [cards, setCards] = useState([]);\n  \n  useEffect(() => {\n    fetch('/manner_db.json').then(r => r.json()).then(setCards);\n  }, []);\n  \n  const demoCards = cards.filter(c => c.image);\n\n  if (cards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>데이터를 불러오는 중입니다...</div>;\n\n  const [isAdminMode`);
}

// 4. Update AdminDashboard props
appSrc = appSrc.replace('<AdminDashboard cards={demoCards} />', '<AdminDashboard allCards={cards} setAllCards={setCards} />');

// 5. Update object keys mapping (title -> name, desc -> action_guide)
// Note: We only replace 'currentCard' and 'c' usages inside the UI loops.
appSrc = appSrc.replace(/\.title/g, '.name');
appSrc = appSrc.replace(/\.desc/g, '.action_guide');

fs.writeFileSync('frontend/src/App.jsx', appSrc);
console.log("AST-like refactor complete.");
