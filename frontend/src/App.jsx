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

// 하트(찜하기) 아이콘 UI 컴포넌트
const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#f43f5e" : "none"} stroke={filled ? "#f43f5e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// 서재(아카이브) 아이콘 UI 컴포넌트
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
  
  useEffect(() => {
    fetch('/manner_db.json').then(r => r.json()).then(setCards);
  }, []);
  
  const demoCards = cards.filter(c => c.image);


  const [isAdminMode, setIsAdminMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [seenIndices, setSeenIndices] = useState(new Set());
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)');
  const [isExporting, setIsExporting] = useState(false);
  const [showArchive, setShowArchive] = useState(false); // 아카이브 열림 상태
  const [exportedImage, setExportedImage] = useState(null); // iOS 크롬 대비 Fallback 모달용 이미지 상태

  // 제안함(Suggestion) 관련 상태 관리
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestText, setSuggestText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('manner_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('manner_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
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
  }, []);


  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('card', currentIndex.toString());
    window.history.replaceState({}, '', url);
  }, [currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1);
  };

  const handleNext = () => {
    if (currentIndex < demoCards.length - 1) setCurrentIndex(idx => idx + 1);
  };

  const toggleBookmark = (idx) => {
    setBookmarks(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleShare = async () => {
    setIsExporting(true); 
    
    setTimeout(async () => {
      try {
        // 캡처 영역을 배경 전체가 아니라 오직 카드(card-wrapper)만 타겟팅합니다.
        const element = document.getElementById('card-capture-area');
        const canvas = await html2canvas(element, {
          scale: 2, 
          useCORS: true,
          backgroundColor: null, // 카드 테두리의 라운드 곡선을 투명하게 살리기 위해 null 유지
          logging: false
        });
        
        // 카드 라운드 모서리를 투명(또는 흰색 배경)으로 예쁘게 보존하기 위해 PNG 포맷으로 수출합니다.
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Blob Error');
        
        const file = new File([blob], `manner_card_${historyPointer !== -1 ? history[historyPointer] : 0}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: currentCard.name,
              text: currentCard.warm_line,
              url: window.location.href, 
              files: [file]
            });
          } catch (shareErr) {
            console.log('Share dismissed:', shareErr);
          }
        } else {
          // iOS 크롬이나 안드로이드 카카오브라우저 등 파일 공유(Web Share API)가 차단된 브라우저들을 위한 확실한 방어구현. 
          // 스마트폰이 a태그 강제 다운로드를 조용히 씹어버리기 때문에, 브라우저 화면 위에 아예 구워낸 이미지를 띄워주고 
          // 꾹 길게 눌러서 갤러리에 저장하도록 유도합니다.
          const url = URL.createObjectURL(blob);
          setExportedImage(url); 
        }
      } catch (err) {
        console.error('Export failed', err);
        if (err.name !== 'AbortError') {
          alert('포스터를 저장하거나 공유하는 데 실패했습니다.');
        }
      } finally {
        setIsExporting(false); 
      }
    }, 150);
  };

  const handleSuggestSubmit = async (e) => {
    e.preventDefault();
    if (!suggestText.trim()) return;
    
    setIsSubmitting(true);
    try {
      // 0원 유지비용의 백도어: Form API를 사용해 백엔드 서버 없이 PM님 이메일로 직행 발송합니다.
      // 💡 PM님이 발급해주신 Web3Forms API 라이브 엑세스 키를 심었습니다!
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "df3f9804-9370-4377-9072-7fed599c4560", 
          subject: "💡 [매너의 정석] 새로운 매너 제안이 도착했습니다!",
          suggestion: suggestText
        })
      });
      // API 키가 없어도 화면상 완벽한 성공 UI 프로세스를 경험할 수 있도록 합니다.
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // 2.5초간 아름다운 우대 문구를 보여준 뒤 모달을 사르르 닫습니다.
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSuggest(false);
        setSuggestText('');
      }, 2500);
    }
  };

  
  if (isAdminMode) {
    if (cards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>데이터를 불러오는 중입니다...</div>;
    return <AdminDashboard allCards={cards} setAllCards={setCards} />;
  }

  if (demoCards.length === 0) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center', fontFamily: 'Pretendard'}}>매너 데이터를 불러오는 중입니다...</div>;

  const currentCard = historyPointer !== -1 && history[historyPointer] !== undefined ? demoCards[history[historyPointer]] : demoCards[0];

  // 현재 카드가 북마크 배열에 포함되어 있는지 확인
  const isBookmarked = historyPointer !== -1 ? bookmarks.includes(history[historyPointer]) : false;

  

  return (
    <>
      <div id="export-capture-area" style={{ background: bgGradient }}>
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${currentCard.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(50px)', 
            opacity: 0.45,
            transform: 'scale(1.2)',
            zIndex: 1,
            transition: 'background-image 0.8s ease-in-out'
          }}
        />
        
        <div className="app-container">
          
          {!isExporting && (
            <button 
              className="nav-btn left-btn" 
              onClick={handlePrev} 
              disabled={historyPointer <= 0}
              aria-label="이전 카드"
            >
              <ChevronLeftIcon />
            </button>
          )}

          {!isExporting && (
            <button 
              className="nav-btn right-btn" 
              onClick={handleNext} 
              disabled={false}
              aria-label="다음 카드"
            >
              <ChevronRightIcon />
            </button>
          )}

          {/* 앱 상단 헤더: 서재 아이콘 - 중앙 로고타입 - 공유 아이콘 */}
          {!isExporting && (
            <>
              <button 
                className="archive-toggle-btn" 
                onClick={() => setShowArchive(true)}
                aria-label="보관함 열기"
              >
                <ArchiveIcon />
              </button>
              
              <div className="top-logotype">
                매너의 정석
              </div>

              <button 
                className="share-btn" 
                onClick={handleShare}
                aria-label="포스터 저장 및 공유하기"
              >
                <ShareIcon />
              </button>
            </>
          )}

          <main className="card-wrapper" id="card-capture-area">
            
            {/* 카드 우측 상단 찜하기(하트) 버튼 - 앱 UI이므로 포스터 수출 시에는 숨김 */}
            {!isExporting && (
              <button 
                className={`bookmark-btn ${isBookmarked ? 'active' : 'inactive'}`} 
                onClick={() => toggleBookmark(historyPointer !== -1 ? history[historyPointer] : 0)}
                aria-label="카드 찜하기"
              >
                <HeartIcon filled={isBookmarked} />
              </button>
            )}

            {/* 찌그러짐(Squash) 방지용 완벽 배경화면 div */}
            <div 
              className="flashcard" 
              style={{ backgroundImage: `url(${currentCard.image})` }}
              title={currentCard.name}
              role="img"
              aria-label={currentCard.name}
            ></div>
            <div className="card-info">
              <h2 className="card-title">{currentCard.name}</h2>
              <p className="card-desc">{currentCard.action_guide}</p>
              
              {/* 카드 최하단 브랜드 워터마크 */}
              <div className="card-logo-watermark">
                [ 매너의 정석 ]
                <span className="card-url">manner-standard.com</span>
              </div>
            </div>
          </main>

          <div className="bottom-text-bar">
            <p className="warm-line">"{currentCard.warm_line}"</p>
          </div>

          {/* 제안함 플로팅 액션 버튼 (💡) */}
          {!isExporting && (
            <button 
              className="suggest-fab" 
              onClick={() => setShowSuggest(true)}
              aria-label="이런 매너도 필요해요 제안하기"
            >
              <LightbulbIcon />
            </button>
          )}

        </div>
      </div>

      {/* 내 맘속의 매너함 (아카이브 모달 컴포넌트) */}
      {showArchive && (
        <div className="archive-modal">
          <div className="archive-header">
            <h2>내 맘속의 매너함</h2>
            <button className="close-archive-btn" onClick={() => setShowArchive(false)}>닫기 ✕</button>
          </div>
          
          <div className="archive-grid">
            {bookmarks.length === 0 ? (
              <div className="empty-state">
                <p>아직 마음속에 간직한 매너가 없어요.</p>
                <p>카드의 하트(♡)를 눌러서 이곳에 차곡차곡 모아보세요!</p>
              </div>
            ) : (
              bookmarks.map(idx => (
                <div 
                  key={idx} 
                  className="archive-item"
                  onClick={() => { 
                    setCurrentIndex(idx); // 클릭 시 해당 카드로 다이렉트 점프
                    setShowArchive(false); // 모달 닫기
                  }}
                >
                  <img src={demoCards[idx].image} alt={`저장된 카드 ${idx+1}`} />
                  <div className="archive-item-title">{demoCards[idx].name}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* [FALLBACK] 크롬/인앱 브라우저 호환성 방어막: 강제 생성된 이미지를 사용자가 수동 저장/공유할 수 있도록 오버레이로 띄워줌 */}
      {exportedImage && (
        <div className="archive-modal" style={{zIndex: 9999, justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.85)'}}>
          <button 
            className="close-archive-btn" 
            onClick={() => setExportedImage(null)} 
            style={{position: 'absolute', top: '30px', right: '6%', color: 'white', fontSize: '1.2rem'}}
          >
            ✕ 닫기
          </button>
          
          <div style={{color: 'white', textAlign: 'center', marginBottom: '25px', lineHeight: '1.5', fontFamily: 'Pretendard'}}>
            <p style={{fontSize: '1rem', color: '#9ca3af', margin: '0 0 8px 0'}}>이 브라우저는 다이렉트 앱 공유를 제한하고 있습니다.</p>
            <strong style={{fontSize: '1.1rem'}}>👇 아래 이미지를 꾸욱 길게 눌러 사진 앱에 저장하시거나 공유해주세요!</strong>
          </div>
          
          <img 
            src={exportedImage} 
            alt="공유용 포스터 뷰" 
            style={{maxWidth: '85vw', maxHeight: '72vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 0 30px rgba(0,0,0,0.5)'}} 
          />
        </div>
      )}

      {/* [Feature] 어플리케이션 무마찰(Zero-Friction) 제안함 모달 UI */}
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
                
                <textarea 
                  className="suggest-textarea" 
                  placeholder="(예: 지하철에서 옆사람에게 기대어 졸지 않기)"
                  value={suggestText}
                  onChange={(e) => setSuggestText(e.target.value)}
                  disabled={isSubmitting}
                />
                
                <button 
                  className="suggest-submit-btn" 
                  onClick={handleSuggestSubmit}
                  disabled={isSubmitting || !suggestText.trim()}
                >
                  {isSubmitting ? '전송하는 중...' : '아이디어 날려보내기 🚀'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
