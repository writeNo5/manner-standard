const ACCESS_TOKEN = "EAANg9TNOgUwBRLJP7Ha04ZBYbtS8yXO5zGJIUkpBDFdlwWQkW4GMPVp4UEGKvxH2ZBIVfqrsyzixEWZAOPoQnwoFrEQkquFJdLVLHKuw6tvSeOqruKcK3KaeMxlGpaA0cZCwVoW2E73SY9FC0lrPmVnFHiBKqE91UbHv46bZBBUSCZBvArMZBd8rNZA8iVEgbLvmDgZDZD";

async function verify() {
  const accounts = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${ACCESS_TOKEN}`).then(r => r.json());
  console.log("Pages:", JSON.stringify(accounts, null, 2));

  if (accounts.data && accounts.data.length > 0) {
    const pageId = accounts.data[0].id;
    console.log("Page ID found:", pageId);
    
    // Check linked Instagram account explicitly
    const insta = await fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${ACCESS_TOKEN}`).then(r => r.json());
    console.log("Linked Instagram Account from Page:", JSON.stringify(insta, null, 2));
  }
}

verify();
