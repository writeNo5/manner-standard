const fs = require('fs');

const ACCESS_TOKEN = "EAANg9TNOgUwBRLJP7Ha04ZBYbtS8yXO5zGJIUkpBDFdlwWQkW4GMPVp4UEGKvxH2ZBIVfqrsyzixEWZAOPoQnwoFrEQkquFJdLVLHKuw6tvSeOqruKcK3KaeMxlGpaA0cZCwVoW2E73SY9FC0lrPmVnFHiBKqE91UbHv46bZBBUSCZBvArMZBd8rNZA8iVEgbLvmDgZDZD";
const ACCOUNT_ID = "1784143985483127";
const IMAGE_URL = "https://manner-standard.vercel.app/images/card_31_student_latenight_1774155142409.png";
const CAPTION = "[매너의 정석 베타 런칭 안내! 🎉]\n\n\"상대의 고요한 휴식 시간을 지켜주는 일은 가장 훌륭한 배려입니다.\"\n\n매일 따뜻한 일상을 만들어가는 100가지 매너 카드 프로젝트, 매너의 정석이 Vercel 서버 파이프라인을 타고 공식적으로 런칭되었습니다. \n\n단 한 번의 다운로드 없이, 웹에서 즉시 접속해 당신만의 카드를 수집해 보세요.\n👉 https://manner-standard.vercel.app\n\n#매너의정석 #선한영향력 #에티켓 #일상공감 #직장인공감 #도슨트다정";

async function postToInstagram() {
  try {
    console.log("Requesting Media Creation...");
    const mediaRes = await fetch(`https://graph.facebook.com/v20.0/${ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: IMAGE_URL,
        caption: CAPTION,
        access_token: ACCESS_TOKEN
      })
    }).then(r => r.json());

    if (mediaRes.error) throw new Error(mediaRes.error.message);
    const creationId = mediaRes.id;
    console.log(`Media Container Created: ${creationId}`);

    console.log("Waiting 6 seconds for Facebook Graph API processing...");
    await new Promise(r => setTimeout(r, 6000));

    console.log("Publishing Media...");
    const publishRes = await fetch(`https://graph.facebook.com/v20.0/${ACCOUNT_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: ACCESS_TOKEN
      })
    }).then(r => r.json());

    if (publishRes.error) throw new Error(publishRes.error.message);
    console.log(`✅ Successfully Published to Instagram! Post ID: ${publishRes.id}`);
    
  } catch (err) {
    console.error("❌ Error posting to Instagram:", err);
  }
}

postToInstagram();
