const fs = require('fs');
const path = require('path');

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;
const BASE_URL = 'https://manner-standard.vercel.app';

if (!ACCESS_TOKEN || !ACCOUNT_ID) {
  console.error("Missing environment variables INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID!");
  process.exit(1);
}

const dataPath = path.join(__dirname, 'cards_data.json');
const statePath = path.join(__dirname, 'posted_state.json');

const cards = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
let state = { posted_indices: [] };

if (fs.existsSync(statePath)) {
  state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
}

// 추출 로직: 이미 올린 카드는 제외
let availableIndices = cards.map((_, i) => i).filter(i => !state.posted_indices.includes(i));

// PM님 추가 요청: 모든 카드를 한 바퀴 돌았다면 추출 조건을 리셋합니다.
if (availableIndices.length === 0) {
  console.log("All existing cards have been posted! Resetting the posted_indices cycle.");
  state.posted_indices = [];
  availableIndices = cards.map((_, i) => i);
}

// 랜덤으로 1장 픽
const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
const card = cards[randomIndex];

const postCaption = `📌 매너의 정석 - ${card.title} 💡\n\n"${card.warm_line}"\n\n👉 전 세계 하나뿐인 나만의 매너 카드 둘러보기\n(상단 프로필 링크를 클릭해 주세요! ✨)\n\n#직장인공감 #학생매너 #매너의정석 #에티켓 #일상동행 #배려 #도슨트다정`;

console.log(`🤖 Targeting Card ${randomIndex}: ${card.title}`);
console.log(`📷 Image URL: ${imageUrl}`);
console.log(`📝 Caption:\n${postCaption}`);

async function publishToInstagram() {
  try {
    // 1단계: 메타 서버에 이미지를 업로드하고 미디어 컨테이너 생성
    console.log("--> Requesting Media Creation from Meta Graph API...");
    const createReq = await fetch(`https://graph.facebook.com/v20.0/${ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: postCaption,
        access_token: ACCESS_TOKEN
      })
    });
    
    const mediaRes = await createReq.json();
    if (mediaRes.error) throw new Error(mediaRes.error.message);
    
    const creationId = mediaRes.id;
    console.log(`✅ Media Container Created Successfully: ${creationId}`);

    // 서버가 이미지를 다운받고 처리할 안전 시간을 보장 (딜레이)
    console.log("--> Waiting 8 seconds for Facebook processing completion...");
    await new Promise(r => setTimeout(r, 8000));

    // 2단계: 생성된 컨테이너를 바탕으로 실제 인스타그램 피드에 글을 발행 (Publish)
    console.log("--> Requesting Media Publish...");
    const publishReq = await fetch(`https://graph.facebook.com/v20.0/${ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: ACCESS_TOKEN
      })
    });

    const publishRes = await publishReq.json();
    if (publishRes.error) throw new Error(publishRes.error.message);

    console.log(`🚀 Successfully Published to Instagram! Post ID: ${publishRes.id}`);

    // 성공 시에만 state 기록 업데이트
    state.posted_indices.push(randomIndex);
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.log(`💾 State updated. Card ${randomIndex} marked as posted.`);

  } catch (error) {
    console.error("❌ Failed to Publish to Instagram:\n", error);
    process.exit(1); // 에러 발생 시 GitHub Action 실패 처리
  }
}

publishToInstagram();
