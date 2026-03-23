import { useState } from 'react';

const AdminDashboard = ({ allCards, setAllCards }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  
  // 상태: 필터 및 보기 방식
  const [filterPersona, setFilterPersona] = useState('all');
  const [filterHasImage, setFilterHasImage] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  
  // 수정 가능 모드
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  
  // 저장 중 상태
  const [isSaving, setIsSaving] = useState(false);

  // 로컬 체크박스 선택 (단순 상태 기억용)
  const [selectedIds, setSelectedIds] = useState([]);

  const checkAuth = (e) => {
    e.preventDefault();
    if (pwd === 'manner2026') setIsAuth(true);
    else alert('접근 권한이 없습니다.');
  };

  // 필터링 적용된 카드 리스트
  const filteredCards = allCards.filter(c => {
    if (filterPersona !== 'all' && c.persona !== filterPersona) return false;
    if (filterHasImage === 'yes' && !c.image) return false;
    if (filterHasImage === 'no' && c.image) return false;
    return true;
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCards.length) setSelectedIds([]);
    else setSelectedIds(filteredCards.map(c => c.id));
  };

  const handleEditClick = (card) => {
    setEditingId(card.id);
    setEditForm({ ...card });
  };

  const handleEditSave = async () => {
    const newCards = allCards.map(c => c.id === editingId ? editForm : c);
    setAllCards(newCards);
    setEditingId(null);
    setEditForm(null);

    // Vercel 서버가 아닌 로컬 개발 환경(npm run dev)일 때만 파일 업데이트 수행
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      setIsSaving(true);
      try {
        await fetch('/api/save_db', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newCards)
        });
      } catch (err) {
        console.error("Save Error:", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      alert('클라우드 환경(Vercel)에서는 실시간 파일 저장이 1회성 브라우저 화면에만 적용됩니다.\n영구 저장을 원하시면 로컬 컴퓨터에서 npm run dev 서버를 켜주세요!');
    }
  };

  if (!isAuth) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'Pretendard'}}>
        <form onSubmit={checkAuth} style={{padding: '40px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', width: '90%', maxWidth: '350px'}}>
          <h2 style={{margin: '0 0 20px', color: '#111827'}}>🔒 관리자 인증</h2>
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="비밀번호 입력" style={{width: '100%', padding: '12px', boxSizing: 'border-box', marginBottom: '16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem'}} />
          <button type="submit" style={{width: '100%', padding: '12px', background: '#111827', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'}}>접속하기</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{padding: '40px', fontFamily: 'Pretendard', background: '#f9fafb', height: '100vh', width: '100vw', boxSizing: 'border-box', overflowY: 'auto', position: 'absolute', top: 0, left: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px'}}>
        <div>
          <h1 style={{color: '#111827', margin: '0 0 10px 0', fontSize: '1.8rem'}}>매너 기획 에셋 (총 {allCards.length}개 중 {filteredCards.length}개 필터링 됨)</h1>
          <p style={{color: '#6b7280', margin: '0 0 10px 0'}}>수정 버튼을 누르면 문구를 변경할 수 있습니다. (PC 환경 권장)</p>
        </div>
        
        {/* 필터 및 모드 토글 */}
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <select value={filterHasImage} onChange={e => setFilterHasImage(e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}}>
            <option value="all">🖼️ 이미지 전체</option>
            <option value="yes">이미지 있음</option>
            <option value="no">이미지 없음</option>
          </select>
          <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db'}}>
            <option value="all">👥 타겟 전체</option>
            <option value="student">학생</option>
            <option value="worker">직장인 (예정)</option>
            <option value="senior">시니어 (예정)</option>
          </select>
          <div style={{background: '#e5e7eb', padding: '4px', borderRadius: '8px', display: 'flex'}}>
            <button onClick={() => setViewMode('list')} style={{border: 'none', padding: '8px 16px', background: viewMode === 'list' ? 'white' : 'transparent', borderRadius: '6px', fontWeight: viewMode === 'list' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}>리스트 뷰</button>
            <button onClick={() => setViewMode('grid')} style={{border: 'none', padding: '8px 16px', background: viewMode === 'grid' ? 'white' : 'transparent', borderRadius: '6px', fontWeight: viewMode === 'grid' ? 'bold' : 'normal', cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}>그리드 뷰</button>
          </div>
          {isSaving && <span style={{color: '#059669', fontWeight: 'bold'}}>저장 중...</span>}
        </div>
      </div>

      <div style={{background: 'white', borderRadius: '16px', overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: viewMode === 'list' ? 'block' : 'none'}}>
        <table style={{width: '100%', minWidth: '900px', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead style={{background: '#f3f4f6'}}>
            <tr>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', width: '40px', textAlign: 'center'}}>
                <input type="checkbox" checked={selectedIds.length === filteredCards.length && filteredCards.length > 0} onChange={toggleSelectAll} style={{cursor: 'pointer'}} />
              </th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563', letterSpacing: '-0.5px'}}>ID</th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563'}}>이미지</th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563'}}>타이틀(name)</th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563'}}>액션 가이드(디스크립션)</th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563'}}>따뜻한 한 줄</th>
              <th style={{padding: '16px 12px', borderBottom: '2px solid #e5e7eb', color: '#4b5563'}}>수정</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map((c) => (
              <tr key={c.id} style={{borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', background: selectedIds.includes(c.id) ? '#f0fdfa' : 'white'}}>
                <td style={{padding: '16px 12px', textAlign: 'center'}}>
                  <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} style={{cursor: 'pointer'}} />
                </td>
                <td style={{padding: '16px 12px', color: '#6b7280', fontWeight: '600'}}>{c.id}</td>
                <td style={{padding: '16px 12px'}}>
                  {c.image ? (
                    <img src={c.image} alt="card" style={{height: '120px', objectFit: 'contain', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px'}} />
                  ) : (
                    <div style={{height: '80px', width: '60px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#9ca3af'}}>미생성</div>
                  )}
                </td>
                
                {editingId === c.id ? (
                  <>
                    <td style={{padding: '16px 12px'}}><textarea style={{width: '100%', height: '80px', boxSizing: 'border-box'}} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                    <td style={{padding: '16px 12px'}}><textarea style={{width: '100%', height: '80px', boxSizing: 'border-box'}} value={editForm.action_guide} onChange={e => setEditForm({...editForm, action_guide: e.target.value})} /></td>
                    <td style={{padding: '16px 12px'}}><textarea style={{width: '100%', height: '80px', boxSizing: 'border-box'}} value={editForm.warm_line} onChange={e => setEditForm({...editForm, warm_line: e.target.value})} /></td>
                    <td style={{padding: '16px 12px'}}><button onClick={handleEditSave} style={{padding: '8px', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>저장</button></td>
                  </>
                ) : (
                  <>
                    <td style={{padding: '16px 12px', fontWeight: '800', color: '#111827', fontSize: '1.05rem', wordBreak: 'keep-all'}}>{c.name}</td>
                    <td style={{padding: '16px 12px', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5', wordBreak: 'keep-all'}}>{c.action_guide}</td>
                    <td style={{padding: '16px 12px', color: '#059669', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500', wordBreak: 'keep-all'}}>"{c.warm_line}"</td>
                    <td style={{padding: '16px 12px'}}><button onClick={() => handleEditClick(c)} style={{padding: '8px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer'}}>수정</button></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 그리드 뷰 모드 */}
      <div style={{display: viewMode === 'grid' ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
        {filteredCards.map((c) => (
          <div key={c.id} style={{background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative'}}>
            <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} style={{position: 'absolute', top: '10px', right: '10px', transform: 'scale(1.5)', cursor: 'pointer'}} />
            {c.image ? (
              <img src={c.image} alt="card" style={{width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '8px', marginBottom: '10px'}} />
            ) : (
              <div style={{aspectRatio: '9/16', background: '#f3f4f6', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: 'bold'}}>이미지 없음</div>
            )}
            <div style={{color: '#6b7280', fontSize: '0.8rem', marginBottom: '4px'}}>ID: {c.id} ({c.persona})</div>
            <div style={{fontWeight: '800', color: '#111827', fontSize: '1rem', marginBottom: '6px'}}>{c.name}</div>
            <div style={{color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '10px'}}>{c.action_guide}</div>
            <div style={{color: '#059669', fontSize: '0.85rem', fontStyle: 'italic'}}>{c.warm_line}</div>
          </div>
        ))}
      </div>
      {filteredCards.length === 0 && <div style={{textAlign: 'center', padding: '50px', color: '#6b7280', fontSize: '1.2rem'}}>조건에 맞는 카드가 없습니다.</div>}
    </div>
  );
};

export default AdminDashboard;
