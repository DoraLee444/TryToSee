// Netlify Function:讀取 / 儲存「常用 Emoji」清單
// 這份清單是全站共用的(不分手札),存在 Netlify Blobs 的 "emoji-library" 這筆資料裡,
// 任何人打開 App 都會看到同一份、也都能一起編輯。
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("travel-journal");

  if (req.method === "GET") {
    const data = await store.get("emoji-library", { type: "json" });
    return Response.json(data || null);
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }
    if (!body || !Array.isArray(body.groups)) {
      return new Response("Missing groups", { status: 400 });
    }
    await store.setJSON("emoji-library", body);
    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = {
  path: "/api/emojis",
};
