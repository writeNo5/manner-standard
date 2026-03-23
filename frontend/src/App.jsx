import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import html2canvas from 'html2canvas';

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#f43f5e" : "none"} stroke={filled ? "#f43f5e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ArchiveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#FCD34D', fill: 'rgba(252, 211, 77, 0.2)'}}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

function App() {
  const [cards, setCards] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // 무제한 랜덤 탐색 시스템 상태
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [seenIndices, setSeenIndices] = useState(new Set());
  
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)');
  const [isExporting, setIsExporting] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [exportedImage, setExportedImage] = useState(null);

  // 제안함 관련 상태
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestText, setSuggestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('manner_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('/manner_db.json').then(r => r.json()).then(setCards);
  }, []);

  const demoCards = cards.filter(c => c.image);

  useEffect(() => {
    localStorage.setItem('manner_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 히스토리 초기화
  useEffect(() => {
    if (demoCards.length === 0 || historyPointer !== -1) return;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdminMode(true);
      return; 
    }

    let startIdx = -1;
    const cardParam = params.get('card');
    if (cardParam !== null) {
      const parsed = parseInt(cardParam, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < demoCards.length) {
        startIdx = parsed;
      }
    }

    if (startIdx === -1) {
      startIdx = Math.floor(Math.random() * demoCards.length);
    }
    
    setHistory([startIdx]);
    setHistoryPointer(0);
    setSeenIndices(new Set([startIdx]));
  }, [demoCards.length, historyPointer]);

  // URL 동기화
  useEffect(() => {
    if (historyPointer === -1 || history[historyPointer] === undefined) return;
    const currentCardIdx = history[historyPointer];
    const url = new URL(window.location);
    url.searchParams.set('card', currentCardIdx.toString());
    window.history.replaceState({}, '', url);
  }, [history, historyPointer]);

  const handlePrev = () => {
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
        const otherCards = demoCards.map((_, i) => i).filter(i => i !== history[historyPointer]);
        nextIdx = otherCards[Math.floor(Math.random() * otherCards.length)];
        setSeenIndices(new Set([history[historyPointer], nextIdx]));
      } else {
        nextIdx = available[Math.floor(Math.random() * available.length)];
        setSeenIndices(prev => new Set(prev).add(nextIdx));
      }
      
      setHistory(prev => [...prev, nextIdx]);
      setHistoryPointer(p => p + 1);
    }
  };

  const toggleBookmark = (idx) => {
    setBookmarks(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const currentCard = historyPointer !== -1 && history[historyPointer] !== undefined ? demoCards[history[historyPointer]] : demoCards[0];
  const isBookmarked = historyPointer !== -1 ? bookmarks.includes(history[historyPointer]) : false;

  const handleShare = async () => {
    setIsExporting(true); 
    setTimeout(async () => {
      try {
        const element = document.getElementById('card-capture-area');
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Blob Error');
        const file = new File([blob], `manner_card_${history[historyPointer]}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: currentCard.name, text: currentCard.warm_line, url: window.location.href, files: [file] });
        } else {
          const url = URL.createObjectURL(blob);
          setExportedImage(url); 
        }
      } catch (err) {
        console.error('Export failed', err);
        if (err.name !== 'AbortError') alert('포스터를 저장하거나 공유하는 데 실패했습니다.');
      } finally { setIsExporting(false); }
    }, 150);
  };

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    if (!suggestText.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "df3f9804-9370-4377-9072-7fed599c4560", 
          subject: "💡 [매너의 정석] 새로운 매너 제안이 도착했습니다!",
          suggestion: suggestText
        })
      });
    } catch(err) { console.error(err); }
    finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => { setSubmitSuccess(false); setShowSuggest(false); setSuggestText(''); }, 2500);
    }
  };

  if (isAdminMode) {
    if (cards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>데이터를 불러오는 중입니다...</div>;
    return <AdminDashboard allCards={cards} setAllCards={setCards} />;
  }

  if (demoCards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center', fontFamily: 'Pretendard'}}>매너 데이터를 불러오는 중입니다...</div>;

  return (
    <>
      <div id="export-capture-area" style={{ background: bgGradient }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${currentCard.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(50px)', opacity: 0.45, transform: 'scale(1.2)', zIndex: 1, transition: 'background-image 0.8s ease-in-out'
        }} />
        
        <div className="app-container">
          {!isExporting && (
            <>
              <button className="nav-btn left-btn" onClick={handlePrev} disabled={historyPointer <= 0} aria-label="이전 카드"><ChevronLeftIcon /></button>
              <button className="nav-btn right-btn" onClick={handleNext} aria-label="다음 카드"><ChevronRightIcon /></button>
              <button className="archive-toggle-btn" onClick={() => setShowArchive(true)} aria-label="보관함 열기"><ArchiveIcon /></button>
              <div className="top-logotype">매너의 정석</div>
              <button className="share-btn" onClick={handleShare} aria-label="포스터 저장 및 공유하기"><ShareIcon /></button>
            </>
          )}

          <main className="card-wrapper" id="card-capture-area">
            {!isExporting && (
              <button className={`bookmark-btn ${isBookmarked ? 'active' : 'inactive'}`} onClick={() => toggleBookmark(history[historyPointer])} aria-label="카드 찜하기">
                <HeartIcon filled={isBookmarked} />
              </button>
            )}
            <div className="flashcard" style={{ backgroundImage: `url(${currentCard.image})` }} role="img" aria-label={currentCard.name}></div>
            <div className="card-info">
              <h2 className="card-title">{currentCard.name}</h2>
              <p className="card-desc">{currentCard.action_guide}</p>
              <div className="card-logo-watermark">[ 매너의 정석 ]<span className="card-url">manner-standard.com</span></div>
            </div>
          </main>

          <div className="bottom-text-bar">
            <p className="warm-line">"{currentCard.warm_line}"</p>
          </div>

          {!isExporting && (
            <button className="suggest-fab" onClick={() => setShowSuggest(true)} aria-label="이런 매너도 필요해요 제안하기"><LightbulbIcon /></button>
          )}
        </div>
      </div>

      {showArchive && (
        <div className="archive-modal">
          <div className="archive-header">
            <h2>내 맘속의 매너함</h2>
            <button className="close-archive-btn" onClick={() => setShowArchive(false)}>닫기 ✕</button>
          </div>
          <div className="archive-grid">
            {bookmarks.length === 0 ? (
              <div className="empty-state"><p>아직 마음속에 간직한 매너가 없어요.</p><p>카드의 하트(♡)를 눌러서 이곳에 차곡차곡 모아보세요!</p></div>
            ) : (
              bookmarks.map(idx => (
                <div key={idx} className="archive-item" onClick={() => { setHistory(prev => [...prev, idx]); setHistoryPointer(history.length); setShowArchive(false); }}>
                  <img src={demoCards[idx]?.image} alt={demoCards[idx]?.name} />
                  <div className="archive-item-title">{demoCards[idx]?.name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {exportedImage && (
        <div className="archive-modal" style={{zIndex: 9999, justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.85)'}}>
          <button className="close-archive-btn" onClick={() => setExportedImage(null)} style={{position: 'absolute', top: '30px', right: '6%', color: 'white', fontSize: '1.2rem'}}>✕ 닫기</button>
          <div style={{color: 'white', textAlign: 'center', marginBottom: '25px', lineHeight: '1.5', fontFamily: 'Pretendard'}}>
            <p style={{fontSize: '1rem', color: '#9ca3af', margin: '0 0 8px 0'}}>이 브라우저는 다이렉트 앱 공유를 제한하고 있습니다.</p>
            <strong style={{fontSize: '1.1rem'}}>👇 아래 이미지를 꾸욱 길게 눌러 사진 앱에 저장하시거나 공유해주세요!</strong>
          </div>
          <img src={exportedImage} alt="공유용 포스터 뷰" style={{maxWidth: '85vw', maxHeight: '72vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 0 30px rgba(0,0,0,0.5)'}} />
        </div>
      )}

      {showSuggest && (
        <div className="archive-modal suggest-modal-overlay">
          <div className="suggest-modal-content">
            <button className="suggest-close-icon" onClick={() => !isSubmitting && setShowSuggest(false)}>✕</button>
            {submitSuccess ? (
              <div className="suggest-success-message">
                <h3>💡 제안 접수 완료!</h3>
                <p>보내주신 따뜻한 시선과 다정한 제안에 깊이 감사드립니다.<br/>더 나은 일상을 위해 꼭 반영하겠습니다. ✨</p>
              </div>
            ) : (
              <>
                <div className="suggest-modal-header">
                  <h2 className="suggest-modal-title">이런 매너도 필요해요!</h2>
                  <p className="suggest-modal-desc">여러분의 재치 있는 아이디어가 다음 일러스트 카드로 예쁘게 탄생합니다.</p>
                </div>
                <textarea className="suggest-textarea" placeholder="(예: 지하철에서 옆사람에게 기대어 졸지 않기)" value={suggestText} onChange={(e) => setSuggestText(e.target.value)} disabled={isSubmitting} />
                <button className="suggest-submit-btn" onClick={handleSuggestSubmit} disabled={isSubmitting || !suggestText.trim()}>{isSubmitting ? '전송하는 중...' : '아이디어 날려보내기 🚀'}</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
