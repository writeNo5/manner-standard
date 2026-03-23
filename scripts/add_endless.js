const fs = require('fs');

let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. 상태 선언
const stateTarget = `const [currentIndex, setCurrentIndex] = useState(0);`;
const stateReplace = `const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [seenIndices, setSeenIndices] = useState(new Set());`;
code = code.replace(stateTarget, stateReplace);

// 2. 옛날 첫 useEffect 제거
const u1Target = `  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // '?admin=true' 로 접속하면 즉시 관리자 모드를 활성화
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
      return;
    }

    const cardParam = params.get('card');
    if (cardParam !== null) {
      const idx = parseInt(cardParam, 10);
      if (!isNaN(idx) && idx >= 0 && idx < demoCards.length) {
        setCurrentIndex(idx);
      }
    }
  }, []);`;

const u1Replace = `  useEffect(() => {
    if (demoCards.length === 0 || historyPointer !== -1) return;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setIsAdminMode(true);

    let startIdx = 0;
    const cardParam = params.get('card');
    if (cardParam !== null) {
      const parsed = parseInt(cardParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < demoCards.length) {
        startIdx = parsed;
      } else {
        startIdx = Math.floor(Math.random() * demoCards.length);
      }
    } else {
      startIdx = Math.floor(Math.random() * demoCards.length);
    }
    
    setHistory([startIdx]);
    setHistoryPointer(0);
    setSeenIndices(new Set([startIdx]));
  }, [demoCards.length, historyPointer]);`;
code = code.replace(u1Target, u1Replace);

// 3. 옛날 URL 동기화 useEffect 제거
const u2Target = `  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('card', currentIndex.toString());
    window.history.replaceState({}, '', url);
  }, [currentIndex]);`;

const u2Replace = `  useEffect(() => {
    if (historyPointer === -1) return;
    const url = new URL(window.location);
    url.searchParams.set('card', history[historyPointer].toString());
    window.history.replaceState({}, '', url);
  }, [history, historyPointer]);`;
code = code.replace(u2Target, u2Replace);

// 4. 네비게이션
const handleTarget = `  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1);
  };

  const handleNext = () => {
    if (currentIndex < demoCards.length - 1) setCurrentIndex(idx => idx + 1);
  };`;

const handleReplace = `  const handlePrev = () => {
    if (historyPointer > 0) {
      setHistoryPointer(p => p - 1);
    }
  };

  const handleNext = () => {
    if (historyPointer < history.length - 1) {
      setHistoryPointer(p => p + 1);
    } else {
      const available = demoCards.map((_, i) => i).filter(i => !seenIndices.has(i));
      let nextIdx;
      if (available.length === 0) {
        // 모든 카드를 본 경우 안 본 카드처럼 다시 사이클 리셋
        const filtered = demoCards.map((_, i) => i).filter(i => i !== history[historyPointer]);
        nextIdx = filtered[Math.floor(Math.random() * filtered.length)];
        setSeenIndices(new Set([history[historyPointer], nextIdx]));
      } else {
        nextIdx = available[Math.floor(Math.random() * available.length)];
        setSeenIndices(prev => new Set(prev).add(nextIdx));
      }
      setHistory(prev => [...prev, nextIdx]);
      setHistoryPointer(p => p + 1);
    }
  };`;
code = code.replace(handleTarget, handleReplace);

// 5. 남은 변수 교체 (정확하게 매칭)
code = code.replace('const currentCard = demoCards[currentIndex];', 'const currentCard = historyPointer !== -1 ? demoCards[history[historyPointer]] : demoCards[0];');
code = code.replace('const isBookmarked = bookmarks.includes(currentIndex);', 'const isBookmarked = historyPointer !== -1 ? bookmarks.includes(history[historyPointer]) : false;');

// Export/Share 부분
code = code.replace('manner_card_${currentIndex}.png', 'manner_card_${historyPointer !== -1 ? history[historyPointer] : 0}.png');

// Disable Buttons
code = code.replace('disabled={currentIndex === 0}', 'disabled={historyPointer <= 0}');
code = code.replace('disabled={currentIndex === demoCards.length - 1}', 'disabled={false}'); // 이제 평생 안 끝남

// 북마크 클릭 핸들러
code = code.replace('onClick={() => toggleBookmark(currentIndex)}', 'onClick={() => toggleBookmark(historyPointer !== -1 ? history[historyPointer] : 0)}');

fs.writeFileSync('frontend/src/App.jsx', code);
console.log('App.jsx modified correctly for endless navigation!');
