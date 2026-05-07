const API_KEY = "AIzaSyBwG4gIQ17kFaErEuqYbORUYodi9y38DJc";

async function testKey() {
  console.log("1. Testing API key by listing available models...\n");
  
  const listRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
  );
  const listData = await listRes.json();
  
  if (!listRes.ok) {
    console.error("❌ API key is invalid or has no access:", listData.error?.message);
    return;
  }
  
  const models = listData.models?.map(m => m.name) || [];
  console.log("✅ API key is valid! Available models:");
  models.forEach(m => console.log(" -", m));

  // Find a flash/pro model that supports generateContent
  const supportedModels = listData.models?.filter(m => 
    m.supportedGenerationMethods?.includes("generateContent")
  ).map(m => m.name) || [];

  console.log("\n2. Models that support generateContent:");
  supportedModels.forEach(m => console.log(" -", m));

  // Test the first available supported model
  const testModel = supportedModels.find(m => m.includes("flash") || m.includes("pro"));
  if (!testModel) {
    console.log("\n❌ No suitable model found for generateContent");
    return;
  }

  const modelId = testModel.replace("models/", "");
  console.log(`\n3. Testing generateContent with model: ${modelId}`);

  const genRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello in Arabic in 5 words" }] }]
      })
    }
  );

  const genData = await genRes.json();
  if (!genRes.ok) {
    console.error("❌ generateContent failed:", genData.error?.message);
  } else {
    const text = genData.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Response:", text);
    console.log(`\n✅ Use model "${modelId}" in your chat route!`);
  }
}

testKey().catch(console.error);
