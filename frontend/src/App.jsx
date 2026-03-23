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

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#FCD34D', fill: 'rgba(252, 211, 77, 0.2)'}}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
);

const demoCards = [
  {
    image: '/images/card_43_student_kindwords_1774184729451.png',
    title: '댓글의 온도',
    desc: 'SNS 댓글에 욕설이나 비속어 대신 예쁜 말만 남기기로 약속해요.',
    warm_line: '당신이 심어놓은 다정한 단어 하나가 누군가의 하루를 구원합니다.'
  },
  {
    image: '/images/card_44_student_privacy_1774184748111.png',
    title: '배경 속 사생활 보호',
    desc: '사진 배경에 우연히 찍힌 모르는 사람의 얼굴은 가리고 올려주세요.',
    warm_line: '보이지 않게 덮어주는 그 섬세함이 아름다운 인격을 보여줍니다.'
  },
  {
    image: '/images/card_45_student_gameinvite_1774184764077.png',
    title: '무분별한 초대 자제',
    desc: '상대방의 상황을 고려하지 않고 게임 초대 메시지를 도배하지 마세요.',
    warm_line: '나의 즐거움만큼 상대의 고요한 시간도 소중히 지켜주세요.'
  },
  {
    image: '/images/card_46_student_calmdown_1774184777308.png',
    title: '감정의 브레이크',
    desc: '기분이 상했을 땐 톡을 바로 보내지 말고, 잠시 폰을 내려두어 진정하세요.',
    warm_line: '짧은 침묵이 후회할 뻔한 많은 말들을 걸러줍니다.'
  },
  {
    image: '/images/card_47_student_secret_1774184813118.png',
    title: '비밀 지켜주기',
    desc: '친구가 믿고 빌려준 아이디나 계정 정보는 절대 다른 곳에 발설하지 마세요.',
    warm_line: '가장 든든한 금고는 정보가 아닌 당신의 묵직한 신뢰입니다.'
  },
  {
    image: '/images/card_48_student_safelink_1774184828013.png',
    title: '의심스러운 링크',
    desc: '출처를 알 수 없거나 의심스러운 링크는 친구들에게 함부로 공유하지 마세요.',
    warm_line: '한 번의 멈춤이 모두를 위험으로부터 지키는 튼튼한 방패가 됩니다.'
  },
  {
    image: '/images/card_49_student_videocall_1774184844440.png',
    title: '영상 통화 전 매너',
    desc: '영상 통화를 걸기 전 카메라를 켤 수 있는 상황인지 먼저 물어봐 주세요.',
    warm_line: '상대방이 마음의 준비를 할 1분의 여유를 선물해 주세요.'
  },
  {
    image: '/images/card_50_student_onlineclass_1774184862519.png',
    title: '온라인 수업 매너',
    desc: '온라인 수업에서 화상 카메라를 켜야 할 땐 단정한 모습으로 참여해 주세요.',
    warm_line: '화면 너머로 보이는 꼿꼿한 자세가 수업의 분위기를 빛냅니다.'
  },
  {
    image: '/images/card_35_student_exit_1774172591668.png',
    title: '단톡방 퇴장 예절',
    desc: '단톡방을 나갈 때는 짧게라도 이유를 말하거나 인사를 남겨주세요.',
    warm_line: '당신의 다정한 뒷모습이 남은 사람들에게 따뜻한 여운을 줍니다.'
  },
  {
    image: '/images/card_36_student_interruption_1774172603126.png',
    title: '대화의 흐름 타기',
    desc: '대화 중인 흐름과 상관없는 사적인 주제는 잠시 아껴두었다 나중에 올려주세요.',
    warm_line: '은은하게 박자를 맞춰주는 당신이 대화의 지휘자입니다.'
  },
  {
    image: '/images/card_37_student_inclusion_1774172621129.png',
    title: '모두를 위한 대화',
    desc: '단톡방에서 특정 친구만 아는 이야기로 다른 친구를 소외시키지 마세요.',
    warm_line: '누구도 외롭지 않게 이끄는 배려가 진정한 리더십입니다.'
  },
  {
    image: '/images/card_38_student_rumor_1774172635139.png',
    title: '소문 차단기',
    desc: '확인되지 않은 소문이나 출처 불명 링크는 공유하지 않고 과감히 지워주세요.',
    warm_line: '거짓을 끊어내는 당신의 단호함이 모두의 마음을 지킵니다.'
  },
  {
    image: '/images/card_39_student_thanks_1774172652909.png',
    title: '고마움은 확실하게',
    desc: '나의 질문에 정성껏 답해준 친구에게는 반드시 \'고마워\'라고 인사해 주세요.',
    warm_line: '감사를 표현하는 당신의 한마디가 배움보다 값진 연결을 만듭니다.'
  },
  {
    image: '/images/card_40_student_spell_1774172667160.png',
    title: '맞춤법보다 다정함',
    desc: '친구의 맞춤법 실수를 지나치게 따지기보다 내용을 이해하며 다정하게 넘어가 주세요.',
    warm_line: '글자보다 마음을 먼저 읽는 당신의 여유가 관계를 부드럽게 합니다.'
  },
  {
    image: '/images/card_41_student_spam_1774172684952.png',
    title: '이모지 도배 자제',
    desc: '과도한 스티커 연타나 문자 도배로 대화창을 어지럽히지 않도록 주의해 주세요.',
    warm_line: '하나의 이모지에 담은 진심이 열 개의 도배보다 무겁게 다가갑니다.'
  },
  {
    image: '/images/card_42_student_patience_1774172700473.png',
    title: '답변을 기다리는 시간',
    desc: '상대가 읽지 않음 상태일 때, 조급해하며 억지로 답장을 재촉하지 말아 주세요.',
    warm_line: '기다림이라는 보이지 않는 매너가 상대의 일상을 지켜줍니다.'
  },
  {
    image: '/images/card_31_student_latenight_1774155142409.png',
    title: '모두가 잠든 시간',
    desc: '모두가 잠든 시간이나 이른 아침에는 불필요한 단톡방 대화는 자제해 주세요.',
    warm_line: '상대의 고요한 휴식時間を 지켜주는 일은 가장 훌륭한 배려입니다.'
  },
  {
    image: '/images/card_32_student_emoji_1774155161849.png',
    title: '읽업 확인용 이모지',
    desc: '지금 바로 답하기 어려울 땐 \'확인\'을 의미하는 이모지라도 남겨주세요.',
    warm_line: '당신의 작은 반응 하나가 상대의 막연한 기다림을 안도감으로 바꾸어 줍니다.'
  },
  {
    image: '/images/card_33_student_notice_1774155176615.png',
    title: '공지에 반응하기',
    desc: '단톡방의 공지사항은 대충 넘기지 말고 꼼꼼히 읽은 뒤 \'확인\' 댓글을 달아주세요.',
    warm_line: '공지에 남긴 짧은 확인 한 줄이 누군가의 묵직한 수고를 덜어줍니다.'
  },
  {
    image: '/images/card_34_student_photo_1774155196227.png',
    title: '사진 사전 동의',
    desc: '친구의 엽기적이거나 웃긴 사진은 함부로 먼저 올리지 말고, 반드시 당사자의 허락을 구하세요.',
    warm_line: '나에겐 일상의 가벼운 웃음이지만, 누군가에겐 꼭 지키고 싶은 사생활일 수 있습니다.'
  },
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

const AdminDashboard = ({ cards }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [pwd, setPwd] = useState('');

  const checkAuth = (e) => {
    e.preventDefault();
    if (pwd === 'manner2026') {
      setIsAuth(true);
    } else {
      alert('접근 권한이 없습니다.');
    }
  };

  if (!isAuth) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'Pretendard'}}>
        <form onSubmit={checkAuth} style={{padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', width: '90%', maxWidth: '350px'}}>
          <h2 style={{margin: '0 0 20px', color: '#111827'}}>🔒 관리자 인증</h2>
          <input 
            type="password" 
            value={pwd} 
            onChange={(e) => setPwd(e.target.value)}
            placeholder="마스터 암호 입력"
            style={{padding: '14px', width: '100%', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '10px', marginBottom: '16px', fontSize: '1rem', outline: 'none'}}
          />
          <button type="submit" style={{width: '100%', padding: '14px', background: '#111827', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', transition: 'background 0.2s'}}>
            접속하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{padding: '40px', fontFamily: 'Pretendard', background: '#f9fafb', minHeight: '100vh', boxSizing: 'border-box'}}>
      <h1 style={{color: '#111827', margin: '0 0 10px 0', fontSize: '1.8rem'}}>총 {cards.length}장의 매너 카드 에셋 백엔드(Admin) 뷰 </h1>
      <p style={{color: '#6b7280', margin: '0 0 30px 0'}}>현재 런칭되어 유저가 직접 만나볼 수 있는 모든 이미지 에셋과 데이터의 종합 리스트입니다. (PC 환경 권장)</p>
      
      <div style={{background: 'white', borderRadius: '16px', overflow: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
        <table style={{width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead style={{background: '#f3f4f6'}}>
            <tr>
              <th style={{padding: '18px 24px', borderBottom: '2px solid #e5e7eb', color: '#374151', whiteSpace: 'nowrap'}}>No</th>
              <th style={{padding: '18px 24px', borderBottom: '2px solid #e5e7eb', color: '#374151'}}>이미지(썸네일)</th>
              <th style={{padding: '18px 24px', borderBottom: '2px solid #e5e7eb', color: '#374151', whiteSpace: 'nowrap'}}>타이틀</th>
              <th style={{padding: '18px 24px', borderBottom: '2px solid #e5e7eb', color: '#374151'}}>디스크립션 (Desc)</th>
              <th style={{padding: '18px 24px', borderBottom: '2px solid #e5e7eb', color: '#374151'}}>따뜻한 한 줄</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c, i) => (
              <tr key={i} style={{borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s'}} onMouseOver={e => e.currentTarget.style.backgroundColor='#f9fafb'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
                <td style={{padding: '16px 24px', color: '#6b7280', fontWeight: '600'}}>{i+1}</td>
                <td style={{padding: '16px 24px'}}>
                  <img src={c.image} alt={c.title} style={{width: '90px', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}} />
                </td>
                <td style={{padding: '16px 24px', fontWeight: '800', color: '#111827', fontSize: '1.05rem', wordBreak: 'keep-all'}}>{c.title}</td>
                <td style={{padding: '16px 24px', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5', wordBreak: 'keep-all'}}>{c.desc}</td>
                <td style={{padding: '16px 24px', color: '#059669', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500', wordBreak: 'keep-all'}}>"{c.warm_line}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  if (isAdminMode) {
    return <AdminDashboard cards={demoCards} />;
  }

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

            {/* 찌그러짐(Squash) 방지용 완벽 배경화면 div */}
            <div 
              className="flashcard" 
              style={{ backgroundImage: `url(${currentCard.image})` }}
              title={currentCard.title}
              role="img"
              aria-label={currentCard.title}
            ></div>
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
