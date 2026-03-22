import { useState, useEffect } from 'react';
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

const demoCards = [
  {
    image: '/images/mvp_v2_student_latenight_1774139813708.png',
    title: '늦은 밤 알림 자제하기',
    desc: '모두가 잠든 시간이나 이른 아침에는 불필요한 톡을 멈춰주세요.',
    warm_line: '상대의 휴식을 지켜주는 침묵도 훌륭한 대화입니다.'
  },
  {
    image: '/images/mvp_v2_worker_pantry_1774139829211.png',
    title: '탕비실 제빙기 에티켓',
    desc: '마지막 얼음을 펐다면 잊지 말고 다음 사람을 위해 물을 채워두세요.',
    warm_line: '나의 작은 수고가 동료의 시원한 하루를 만듭니다.'
  },
  {
    image: '/images/mvp_v2_senior_subway_1774139847566.png',
    title: '임산부 배려석 비워두기',
    desc: '지금 빈자리라도 가급적 핑크색 임산부 배려석은 남겨주세요.',
    warm_line: '비워둔 그 자리가 누군가에겐 가장 따뜻한 품이 됩니다.'
  },
  {
    image: '/images/mvp_v2_worker_door_1774139861271.png',
    title: '출입문 잡아주기 매너',
    desc: '문을 나설 때 뒤따라오는 동료가 있다면 잠시만 손으로 잡아주세요.',
    warm_line: '잠시 멈춰선 3초가 다정한 하루의 시작을 엽니다.'
  },
  {
    image: '/images/mvp_v2_worker_restroom_1774139871825.png',
    title: '세면대 물기 닦아두기',
    desc: '손을 씻은 후 세면대 주변에 튄 물방울들을 휴지로 가볍게 닦아주세요.',
    warm_line: '바닥을 적시지 않는 깔끔함이 사무실을 쾌적하게 유지합니다.'
  },
  {
    image: '/images/mvp_v2_senior_messenger_1774139888872.png',
    title: '따뜻한 타이포 이모티콘',
    desc: '가족에게 짧은 단답형으로 보내기보다 귀여운 이모티콘으로 답장해 보세요.',
    warm_line: '당신의 작은 미소 이모티콘 하나가 메신저의 온도를 높여줍니다.'
  },
  {
    image: '/images/mvp_v2_student_class_phone_1774139904703.png',
    title: '수업 전 무음 설정',
    desc: '대학 강의가 시작되기 직전, 휴대전화는 무음이나 진동으로 바꿔주세요.',
    warm_line: '나의 고요함이 우리 모두의 배움에 깊이를 더합니다.'
  },
  {
    image: '/images/mvp_v2_student_teamwork_1774139919286.png',
    title: '조별 과제 책임감',
    desc: '팀원들과 약속된 기한을 지켜 원활한 협업에 기여해 주세요.',
    warm_line: '작은 책임을 다하는 당신이 팀의 가장 빛나는 에너지입니다.'
  },
  {
    image: '/images/mvp_v2_worker_meeting_1774139933767.png',
    title: '동료의 말 경청하기',
    desc: '회의 중 동료가 발언할 때 중간에 말을 끊지 말고 끝까지 들어주세요.',
    warm_line: '말을 끊지 않고 귀 기울여주는 태도가 회의의 품격을 높입니다.'
  },
  {
    image: '/images/mvp_v2_worker_email_1774139949890.png',
    title: '심야 메일 예약 전송',
    desc: '늦은 밤 떠오른 의견은 즉시 보내지 말고 다음 날 오전 예약 발송을 걸어주세요.',
    warm_line: '상대방의 저녁을 지켜주는 섬세함이야말로 진정한 프로의 예의입니다.'
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)');
  const [isExporting, setIsExporting] = useState(false);
  const [showArchive, setShowArchive] = useState(false); // 아카이브 열림 상태
  const [exportedImage, setExportedImage] = useState(null); // iOS 크롬 대비 Fallback 모달용 이미지 상태

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('manner_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('manner_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
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
        
        const file = new File([blob], `manner_card_${currentIndex}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: currentCard.title,
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

  const extractColor = (e) => {
    try {
      const imgEl = e.target;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = 10; 
      canvas.height = 10;
      ctx.drawImage(imgEl, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;
      
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i+1]; b += data[i+2];
      }
      const count = data.length / 4;
      
      const pr = Math.floor((Math.floor(r/count) + 255*1.2) / 2.2);
      const pg = Math.floor((Math.floor(g/count) + 255*1.2) / 2.2);
      const pb = Math.floor((Math.floor(b/count) + 255*1.2) / 2.2);
      
      setBgGradient(`linear-gradient(135deg, rgba(${pr},${pg},${pb},1) 0%, rgba(${Math.max(0, pr-20)},${Math.max(0, pg-10)},${Math.min(255, pb+20)},1) 100%)`);
    } catch(err) {
      console.log('Color extract failed', err);
    }
  };

  const currentCard = demoCards[currentIndex];
  // 현재 카드가 북마크 배열에 포함되어 있는지 확인
  const isBookmarked = bookmarks.includes(currentIndex);

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
              disabled={currentIndex === 0}
              aria-label="이전 카드"
            >
              <ChevronLeftIcon />
            </button>
          )}

          {!isExporting && (
            <button 
              className="nav-btn right-btn" 
              onClick={handleNext} 
              disabled={currentIndex === demoCards.length - 1}
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
                onClick={() => toggleBookmark(currentIndex)}
                aria-label="카드 찜하기"
              >
                <HeartIcon filled={isBookmarked} />
              </button>
            )}

            <img 
              src={currentCard.image} 
              alt={currentCard.title} 
              crossOrigin="anonymous"
              onLoad={extractColor}
              className="flashcard"
            />
            <div className="card-info">
              <h2 className="card-title">{currentCard.title}</h2>
              <p className="card-desc">{currentCard.desc}</p>
              
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
                  <div className="archive-item-title">{demoCards[idx].title}</div>
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
    </>
  );
}

export default App;
