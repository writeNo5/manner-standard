const ACCESS_TOKEN = "EAANg9TNOgUwBRLJP7Ha04ZBYbtS8yXO5zGJIUkpBDFdlwWQkW4GMPVp4UEGKvxH2ZBIVfqrsyzixEWZAOPoQnwoFrEQkquFJdLVLHKuw6tvSeOqruKcK3KaeMxlGpaA0cZCwVoW2E73SY9FC0lrPmVnFHiBKqE91UbHv46bZBBUSCZBvArMZBd8rNZA8iVEgbLvmDgZDZD";
const PAGE_ID = "987190604485260";
const IG_ID = "1784143985483127";

async function verify() {
  console.log("Checking Page linked Instagram:");
  const pageRes = await fetch(`https://graph.facebook.com/v20.0/${PAGE_ID}?fields=instagram_business_account,connected_instagram_account&access_token=${ACCESS_TOKEN}`).then(r => r.json());
  console.log(JSON.stringify(pageRes, null, 2));
}

verify();
