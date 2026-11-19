# 週末頻道

可加到手機主畫面的音樂網頁 App。「換一批歌曲」會從 36 首精選中挑出 20 首，並優先補入上一批未出現的歌曲。歌單儲存在目前的瀏覽器。搜尋只篩選這批歌曲。

- iPhone 使用 Safari 的「分享 → 加入主畫面」。
- Android 使用 Chrome 選單中的「安裝應用程式」或「加到主畫面」。

影片透過 YouTube 內嵌播放器播放，鎖屏背景播放取決於 YouTube 官方服務。如需使用 YouTube 官方 App，請點播放器下方的「在 YouTube 觀看」。

## 部署

在 GitHub 儲存庫的 Settings → Pages 將 Source 選為 GitHub Actions。推送到 main 時會部署，也可以從 Actions 手動執行部署。

本機預覽可執行 `python3 -m http.server 8000 --directory site`。
