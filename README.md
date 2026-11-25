# 國立暨南國際大學 管理學院空間查詢模組 (NCNU College of Management Space Query Module)

本專案為**軟體工程（Software Engineering）專題實作**，針對「國立暨南國際大學管理學院空間查詢模組」之需求所規劃並實現的完整系統架構與前後端應用原型。

---

## 📌 系統功能亮點與需求達成

依據規格要求，本系統完整實現以下核心功能：

1. **訪客免登入空間查詢與導覽**
   - **多維度空間篩選**：支援樓層（1F、2F、3F 等）、空間型態（一般教室、個案教室、階梯教室、會議廳、研討室）、容納人數門檻與關鍵字快速搜尋。
   - **真實教室資訊整合**：教室欄位與設備規格完整對照 [暨大國企系教室資源](https://www.ibs.ncnu.edu.tw/index.php/resources/space-classroom)（包含管112、管113、管115、管206、管213哈佛個案、管226個案階梯、管268演講廳、管329智慧教室等），呈現容納人數、投影、智慧講桌、麥克風、空調及借用注意事項。
2. **360° 沉浸式全景照片瀏覽 (Pannellum 整合)**
   - 整合開源 WebGL 360 度環景引擎 [Pannellum 2.5.6](https://pannellum.org/)。
   - 支援自動環繞慢速旋轉漫遊、手勢/滑鼠 360 度自由旋轉、視角縮放 (Zoom In/Out)、羅盤方位指針與全螢幕沉浸體驗。
3. **管院互動式向量平面圖 (Interactive Floor Plan)**
   - 向量 SVG 樓層配置（精確呈現暨大管院中庭、東西翼長廊、出入口與電梯位置）。
   - **教室位置動態標記 (Pins/Hotspots)**：點擊列表教室即可聯動在平面圖上高亮標註點並發出脈衝波紋；反向點擊平面圖標註即可查看教室詳情與載入對應 360 度全景。
4. **管理員維護管理機制 (增、刪、改、查 CRUD)**
   - **權限隔離保護**：管理員登入（預設帳號: `admin`，密碼: `admin123`），支援 JWT 鑑權機制。
   - **教室資訊維護**：可新增教室空間、修改名稱/容納人數/設備項目/借用規範、刪除教室。
   - **平面圖座標互動拾取器**：管理員可直接在平面圖上點選任意位置，系統自動捕獲精準百分比座標（X%, Y%）並帶入表單。

---

## 📂 專案目錄結構 (Project Architecture)

```
1151ncnuse/
├── README.md                      # 專案總覽與使用說明
├── docs/                          # 軟工系統架構與設計文件庫
│   ├── SYSTEM_ARCHITECTURE.md     # 系統整體架構設計書 (架構圖/模組設計/資料流/軟工規格)
│   ├── DATABASE_SCHEMA.sql        # 資料庫結構腳本 (3NF DDL 與暨大管院真實 Seed Data)
│   └── API_SPECIFICATION.md       # RESTful API 詳細介面規格書
├── backend/                       # 後端 RESTful API 服務 (Node.js/Express)
│   ├── package.json               # 後端依賴配置
│   ├── server.js                  # 後端入口伺服器 (公開與管理員端點)
│   ├── controllers/
│   │   ├── classroomController.js # 教室 CRUD 與檢索過濾業務邏輯
│   │   └── authController.js      # JWT 認證與登入邏輯
│   └── middleware/
│       └── authGuard.js           # 管理員 JWT 權限檢查中間件
├── frontend/                      # 前端展示層 (單頁 SPA 應用)
│   ├── index.html                 # 主介面入口 (整合 Pannellum 與互動平面圖)
│   ├── css/
│   │   └── style.css              # 自訂視覺動效與深色主題樣式
│   └── js/
│       ├── app.js                 # 主調度器與事件控制中心
│       ├── mock-data.js           # 暨大管院真實教室種子資料庫 (支援 LocalStorage 持久化)
│       ├── pannellum-viewer.js    # Pannellum 360° 全景控制器
│       ├── floor-map.js           # 向量平面圖引擎與標記點聯動
│       └── admin.js               # 管理員權限與 CRUD 操作模組
└── assets/                        # 靜態多媒體資源庫
    ├── maps/                      # 管院各樓層互動向量平面圖 (SVG)
    └── panoramas/                 # 360° 全景等距長方投影影像資源
```

---

## 🚀 快速啟動與體驗方式 (Quick Start)

本系統採漸進式架構設計，支援 **「零安裝本機即開即用」** 與 **「全端 RESTful API 模式」** 兩種運行方式：

### 方式一：本機前端直接啟動 (推薦快速檢視與測試)
1. 直接使用現代瀏覽器（Chrome、Edge、Safari 或 Firefox）打開：
   ```
   frontend/index.html
   ```
2. 系統會自動以內建 LocalStorage 與 CDN 載入真實的暨大管院空間資料、SVG 平面圖與 Pannellum 360 全景視角！
3. 您可以：
   - 點擊左側列表的任一教室（例如「管 213 哈佛式個案討論教室」），中間平面圖將自動高亮其定位點，右側立即切換 360 度全景影像。
   - 點擊右上角「**管理員登入**」（帳號 `admin`，密碼 `admin123`），進入管理員維護模式，即可進行新增教室、修改教室與刪除教室。

### 方式二：全端 Node.js + Express RESTful API 模式
若要在本地以獨立後端伺服器運行：
```bash
# 1. 進入後端目錄並安裝依賴
cd backend
npm install

# 2. 啟動後端 API 服務
npm start
```
伺服器將在 `http://localhost:3000` 運行，提供完整的 `/api/v1/classrooms`、`/api/v1/auth/login` 等 RESTful 端點。

---

## 📑 系統設計規格文檔

詳細設計資料請參見 `docs/` 資料夾：
- [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)：包含完整系統架構圖 (Mermaid)、三層式架構設計、非功能性需求與安全性說明。
- [docs/DATABASE_SCHEMA.sql](docs/DATABASE_SCHEMA.sql)：提供 PostgreSQL / SQLite / MySQL 通用的 DDL 建表腳本、索引、外鍵與完整管院教室初始資料。
- [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md)：提供標準 OpenAPI / RESTful JSON 格式的 Request 與 Response 規格。
