# 旅遊手帳 · Netlify 版

一個可以持續編輯、雲端自動同步的旅遊手帳網站。資料存在 Netlify Blobs
(Netlify 內建的儲存服務),不需要另外接資料庫,也不用手動匯出/匯入 —
任何裝置打開同一個網址,看到的就是最新內容。

## 檔案結構

```
travel-journal-netlify/
├── public/
│   └── index.html          ← 手帳網頁本體(前端)
├── netlify/
│   └── functions/
│       └── trip.js         ← 讀寫資料的 Function(後端)
├── netlify.toml             ← Netlify 建置設定
├── package.json              ← 宣告 @netlify/blobs 相依套件
└── README.md
```

## 部署方式(推薦：接 GitHub)

1. 把整個資料夾推到一個新的 GitHub repo。
2. 到 [app.netlify.com](https://app.netlify.com) → **Add new site → Import an
   existing project**,選剛剛的 repo。
3. Build 設定會自動讀到 `netlify.toml`:
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
   不需要設定 Build command(留空即可)。
4. 按 **Deploy**。第一次部署 Netlify 會自動安裝 `@netlify/blobs`
   並啟用 Blobs 儲存,不用另外申請資料庫或 API key。
5. 部署完成後打開網址,右上角會看到「☁️ 已同步」,就代表 Function 和
   Blobs 都正常運作了。

## 部署方式(不想用 GitHub：Netlify CLI)

在這個資料夾裡執行:

```bash
npm install -g netlify-cli   # 第一次安裝
netlify login
netlify init                 # 依指示建立/連結一個 Netlify 網站
netlify deploy --prod        # 正式部署
```

## 新功能(v3)

- **可安裝到手機主畫面(PWA)**:iPhone 用 Safari 打開網址 → 分享 → 加入主畫面;
  Android 用 Chrome 打開會自動跳出「安裝應用程式」提示,或選單裡的
  「安裝應用程式 / 加到主畫面」。安裝後會有獨立圖示、全螢幕開啟,
  資料還是即時連線 Netlify Blobs,不是離線 App。
- **分享給朋友**:按「🔗 分享手札連結」,手機會跳出系統分享選單
  (或桌機會複製連結),傳給朋友,他們打開同一個網址就能一起看、
  一起編輯(目前沒有帳號區分,大家看到、改到的是同一份)。
- **背景同步**:打開手札後每 20 秒會自動偷偷檢查一次有沒有新版本
  (只有在「非編輯模式」而且沒有正在輸入文字時才會更新畫面,不會
  打斷你打字),右上角「📚 手札列表」旁按「🔄 刷新最新內容」可以
  立刻手動抓最新版。
- **匯出遊記 PDF**:按「🖨️ 匯出遊記 PDF」會叫出瀏覽器的列印功能,
  選「另存為 PDF」就能存成 PDF 檔——只會印出封面、逐日行程、
  小貼士、地圖連結(旅遊日記本身),預算/記帳/分帳這些財務資料
  不會印進去,財務資料請用「📊 匯出成 Excel」。



## 之後怎麼用

- 打開部署好的網址(不帶任何參數)會先看到「手札列表」畫面。
- 按「＋ 建立新的手札」會產生一份全新空白的手札,網址會變成
  `你的網址?trip=一串亂碼`,這就是這份手札專屬的網址。
- 每份手札的編輯、記帳、預算都是各自獨立的,存檔只會存到目前
  這份,不會動到其他份。
- 打開手札後按右上角「✏️ 編輯內容」就能直接改標題、行程、
  預算、匯率、記帳、打包清單、貼士、地圖連結。
- 每次編輯完(欄位失焦、或新增/刪除項目)會自動存檔,右上角會
  顯示「儲存中…」→「☁️ 已同步」。
- 按右上角「📚 手札列表」可以隨時回到列表,開啟其他份手札、
  或建立下一份不同的手札;列表裡每張卡片也能直接刪除。
- 想把目前這份清空重寫,按最下面「↺ 重設為範例內容」(只會
  影響目前這份,不影響其他手札)。

## 注意事項

- 這個網址目前**沒有登入保護**,只要有連結就能開啟、編輯、甚至
  刪除手札 — 適合家人朋友共用,但不要把網址公開分享給不相關的人。
  如果需要密碼保護,可以在 Netlify 的 Site settings →
  **Visitor access** 開啟 Password protection(付費方案功能)。
- 所有手札摘要(標題/日期/更新時間)會另外存一筆 `index` 索引,
  刪除手札時會一併從索引移除;如果直接在 Netlify 後台手動刪掉
  某份手札的資料,記得也要處理 `index`,不然列表會出現空卡片。
- 每個 Netlify 網站(site)是各自獨立的儲存空間;同一個網站底下
  的所有手札、所有訪客共用同一份列表,不是「每人一組帳號」。
