# 週末頻道

透過 YouTube 的內嵌播放器免費聆聽。網站提供四套精選歌單，每套 9 首，每週一 09:00（台灣時間）輪替。點選「全部精選」可瀏覽與搜尋所有 36 首。播放時可能顯示 YouTube 廣告。遇到地區限制或影片無法內嵌，可使用播放器下方的 YouTube 連結。

## 部署到 GitHub Pages

1. 建立新的公開儲存庫，把本專案的檔案上傳到 `main` 分支。保留 `.github/workflows/pages.yml`。
2. 在儲存庫的 **Settings → Pages** 將 **Source** 選為 **GitHub Actions**。
3. 開啟 **Actions → 更新歌單並部署 GitHub Pages → Run workflow**，選擇 `main`。成功後，可在工作流程的部署連結開啟網站。
4. GitHub Actions 之後會在每週一台灣時間 09:00 排程更新並部署。GitHub 可能延後執行排程。

## 選用 YouTube 熱門影片

在 Google Cloud 啟用 YouTube Data API v3。將 API 金鑰加到 GitHub 儲存庫的 **Settings → Secrets and variables → Actions → New repository secret**，名稱填 `YOUTUBE_API_KEY`。選填此項後，部署流程會從 YouTube 取得最多 12 部台灣地區的公開、可內嵌音樂熱門影片。熱門資料取不到時，網頁會顯示當週精選。

## 本機預覽

在專案根目錄執行 `python3 -m http.server 8000 --directory site`，然後開啟 `http://localhost:8000`。如需本機產生歌單資料，可先用 Node.js 22 執行 `node scripts/refresh.mjs`。
