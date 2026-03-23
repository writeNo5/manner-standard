const ACCESS_TOKEN = "EAANg9TNOgUwBRLJP7Ha04ZBYbtS8yXO5zGJIUkpBDFdlwWQkW4GMPVp4UEGKvxH2ZBIVfqrsyzixEWZAOPoQnwoFrEQkquFJdLVLHKuw6tvSeOqruKcK3KaeMxlGpaA0cZCwVoW2E73SY9FC0lrPmVnFHiBKqE91UbHv46bZBBUSCZBvArMZBd8rNZA8iVEgbLvmDgZDZD";

async function verify() {
  const ig = await fetch(`https://graph.facebook.com/v20.0/1784143985483127?fields=id,username&access_token=${ACCESS_TOKEN}`).then(r => r.json());
  console.log("Instagram Info:", JSON.stringify(ig, null, 2));
}

verify();
