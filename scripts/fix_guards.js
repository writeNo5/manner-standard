const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const targetStr = `const currentCard = demoCards[currentIndex];`;
const injectionStr = `
  if (isAdminMode) {
    if (cards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>데이터를 불러오는 중입니다...</div>;
    return <AdminDashboard allCards={cards} setAllCards={setCards} />;
  }

  if (demoCards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center', fontFamily: 'Pretendard'}}>매너 데이터를 불러오는 중입니다...</div>;

  const currentCard = demoCards[currentIndex] || demoCards[0];
`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, injectionStr);
  // Also remove the old isAdminMode return block since it's now handled above
  code = code.replace(/if \(isAdminMode\) \{\s*return <AdminDashboard allCards=\{cards\} setAllCards=\{setCards\} \/>;\s*\}/, '');
  fs.writeFileSync('frontend/src/App.jsx', code);
  console.log("Fixed guards successfully.");
} else {
  console.log("Could not find target string.");
}
