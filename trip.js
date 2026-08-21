// Netlify Function：讀取 / 儲存 / 列出 / 刪除旅遊手札
// 每份手札用網址上的 ?id=xxx 區分,存在 Netlify Blobs 裡各自獨立的一筆資料,
// 另外用一筆 "index" 記錄所有手札的摘要(標題/日期/更新時間),給列表畫面用。
//
// GET  /api/trip?list=1     → 回傳所有手札摘要(陣列)
// GET  /api/trip?id=xxx     → 回傳該手札的 { trip, expenses },不存在回傳 null
// POST /api/trip?id=xxx     → 儲存該手札(body 需含 { trip, expenses }),並更新 index
// DELETE /api/trip?id=xxx   → 刪除該手札,並從 index 移除
import { getStore } from "@netlify/blobs";

const tripKey = (id) => `trip:${id}`;

export default async (req) => {
  const store = getStore("travel-journal");
  const url = new URL(req.url);

  if (req.method === "GET") {
    if (url.searchParams.get("list") === "1") {
      const index = (await store.get("index", { type: "json" })) || [];
      index.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
      return Response.json(index);
    }
    const id = url.searchParams.get("id");
    if (!id) return new Response("Missing id", { status: 400 });
    const data = await store.get(tripKey(id), { type: "json" });
    return Response.json(data || null);
  }

  if (req.method === "POST") {
    const id = url.searchParams.get("id");
    if (!id) return new Response("Missing id", { status: 400 });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }
    if (!body || typeof body !== "object" || !body.trip) {
      return new Response("Missing trip data", { status: 400 });
    }

    await store.setJSON(tripKey(id), body);

    // 更新摘要索引
    let index = (await store.get("index", { type: "json" })) || [];
    const summary = {
      id,
      title: body.trip.title || "未命名手札",
      dateRangeText: body.trip.dateRangeText || "",
      emoji: body.trip.emoji || "🧳",
      updatedAt: new Date().toISOString(),
    };
    const i = index.findIndex((x) => x.id === id);
    if (i >= 0) index[i] = summary;
    else index.push(summary);
    await store.setJSON("index", index);

    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) return new Response("Missing id", { status: 400 });

    await store.delete(tripKey(id));
    let index = (await store.get("index", { type: "json" })) || [];
    index = index.filter((x) => x.id !== id);
    await store.setJSON("index", index);

    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = {
  path: "/api/trip",
};
