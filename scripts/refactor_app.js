const fs = require('fs');

let appSrc = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. App.jsx 맨 위에 AdminDashboard 들여오기
appSrc = appSrc.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport AdminDashboard from './AdminDashboard';");

// 2. demoCards 배열과 기존 AdminDashboard 컴포넌트 통째로 삭제
// const demoCards = [ ... ] 부터 const AdminDashboard = ({ cards }) => { ... }; 까지 정규식으로 삭제할 수 있지만 범위가 매우 크다.
// 약간의 하드코딩된 삭제를 수행한다.
const demoCardsStart = appSrc.indexOf('const demoCards = [');
const appStart = appSrc.indexOf('function App() {');
if (demoCardsStart !== -1 && appStart !== -1) {
  appSrc = appSrc.substring(0, demoCardsStart) + appSrc.substring(appStart);
}

// 3. App 함수 내에 데이터 패칭 코드 삽입 (미사용 변수 방지를 위해 const App = 내부 첫 부분에 삽입)
appSrc = appSrc.replace('function App() {\n', `function App() {\n  const [cards, setCards] = useState([]);\n  useEffect(() => {\n    fetch('/manner_db.json').then(r => r.json()).then(setCards);\n  }, []);\n  const demoCards = cards.filter(c => c.image);\n`);

// 4. demoCards.length를 통해 처리하는 로직들을 안전 처리
appSrc = appSrc.replace('if (demoCards.length === 0) return null;', ''); // 중복 제거
appSrc = appSrc.replace('function App() {', `function App() {\n  // data load guard\n  if (false) return null;`);
// wait - if demoCards.length is 0, we should render loading
appSrc = appSrc.replace('const [currentIndex', `if (cards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>데이터를 불러오는 중입니다...</div>;\n  const [currentIndex`);

// 5. currentCard.title -> currentCard.name, currentCard.desc -> currentCard.action_guide
appSrc = appSrc.replace(/currentCard\.title/g, 'currentCard.name');
appSrc = appSrc.replace(/currentCard\.desc/g, 'currentCard.action_guide');

// 6. AdminDashboard 컴포넌트 렌더링 방식 수정
appSrc = appSrc.replace('<AdminDashboard cards={demoCards} />', '<AdminDashboard allCards={cards} setAllCards={setCards} />');

// 7. 카드 본문 렌더링 중 c.title -> c.name, c.desc -> c.action_guide
appSrc = appSrc.replace(/\{c\.title\}/g, '{c.name}');
appSrc = appSrc.replace(/\{c\.desc\}/g, '{c.action_guide}');

// Swiper 내부 demoCards.map
appSrc = appSrc.replace(/demoCards/g, 'demoCards'); // 유지 (demoCards 변수를 재활용하므로)

fs.writeFileSync('frontend/src/App.jsx', appSrc);
console.log("App.jsx refactored successfully!");
