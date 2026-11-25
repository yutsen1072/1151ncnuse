# 1151 軟體工程學期專案 — 管院空間與排課整合系統架構書

## 1. 專案概述與模組分工
本系統旨在整合管理學院之空間資訊查詢、空間與物品預約借用，以及教師志願排課三大核心業務。全系統共用單一帳號驗證機制與關聯式資料庫，並支援從「基本款（獨立運作）」平滑升級至「完整款（跨模組狀態連動）」。

* **共用核心 (Core)**：帳號註冊、管理員帳號審核、登入/登出、角色權限控管 (RBAC)。
* **模組 A（組員 1）**：管院空間查詢模組（教室 CRUD、管院平面圖定位、360° 全景照片瀏覽）。
* **模組 B（組員 2）**：空間/物品預約借用模組（週曆狀態查詢、多重物品借用申請、管理員審核與領用/歸還核銷）。
* **模組 C（組員 3）**：志願排課模組（教師志願填報與課程 CRUD、管理員週日曆檢視、時間衝突偵測、滑鼠 Drag & Drop 調課）。

---

## 2. 系統整體分層架構 (3-Tier Architecture)

本系統採用前後端分離架構，透過標準 RESTful API 進行資料交換，確保三位組員能各自獨立開發前端頁面與對應路由，同時共用同一套驗證中介層與資料庫。

```text
+-----------------------------------------------------------------------+
|                        展示層 (Frontend / Client)                      |
|  [共用: 登入 / 註冊 / 權限動態導覽列]                                    |
|  ├── 模組 A：空間查詢頁面 (Pannellum 360度全景 + 管院互動式平面圖)        |
|  ├── 模組 B：空間/物品借用頁面 (週借用表、借用申請單、審核與領還管理)      |
|  └── 模組 C：志願排課頁面 (教師課程清單、週日曆檢視、Drag & Drop 排課)     |
+-----------------------------------------------------------------------+
                                    │  RESTful API (JSON / HTTPS)
                                    ▼
+-----------------------------------------------------------------------+
|                       應用邏輯層 (Backend / API)                       |
|  [共用中介軟體 Middleware：Session / JWT 驗證 & 角色權限控管 (RBAC)]      |
|  ├── Auth Service：註冊、管理員帳號審核、登入/登出                        |
|  ├── Space Service (模組 A)：教室 CRUD、平面圖座標管理、全景圖路徑        |
|  ├── Booking Service (模組 B)：借用申請、審核狀態機、領用/歸還核銷、衝突檢查|
|  └── Schedule Service (模組 C)：志願登記、教師課表 CRUD、排課時間衝突偵測  |
+-----------------------------------------------------------------------+
                                    │  ORM / SQL
                                    ▼
+-----------------------------------------------------------------------+
|                     資料持久層 (Shared Database)                       |
|  [統一關聯式資料庫：PostgreSQL / MySQL]                                  |
|  Users │ Classrooms │ Equipment │ Bookings │ Booking_Items │ Courses  |
+-----------------------------------------------------------------------+
```

---

## 3. 角色與權限矩陣 (RBAC Matrix)

系統區分四種存取身分，所有模組共用同一份 `users` 資料表進行權限驗證：

| 功能項目 | 訪客 (未登入) | 一般學生 / 借用者 | 教師 (Teacher) | 系統管理員 (Admin) |
| :--- | :---: | :---: | :---: | :---: |
| **帳號註冊 / 登入登出** | 註冊 / 登入 | 登出 / 個人資料 | 登出 / 個人資料 | **審核新註冊帳號** |
| **空間與 360 全景查詢** | 瀏覽 | 瀏覽 | 瀏覽 | 瀏覽 + **增刪修教室資料** |
| **空間 / 物品預約借用** | ✗ | 查詢週借用表、送出申請 | 查詢週借用表、送出申請 | **審核(過/退)、註記領用與歸還** |
| **志願排課與課表管理** | ✗ | ✗ | **增刪修個人課程**、填志願 | **增刪修全系課程、Drag&Drop調課、查衝突** |

---

## 4. 統一資料庫設計 (Shared ER Schema)

為達成「統一 DB」與「跨模組整合（完整款）」，資料庫設計如下：

### 4.1 共用帳號模組
* **`users` (使用者表)**
  * `id` (INT, PK, Auto Increment)
  * `username` (VARCHAR, Unique) — 學號或教職員編號
  * `password_hash` (VARCHAR) — 加密後的密碼
  * `name` (VARCHAR) — 真實姓名
  * `email` (VARCHAR) — 聯絡信箱
  * `role` (ENUM: `'student'`, `'teacher'`, `'admin'`) — 系統角色
  * `status` (ENUM: `'pending'`, `'active'`, `'rejected'`) — 帳號審核狀態（預設 `'pending'`，需管理員審核通過才可登入）

### 4.2 管院空間查詢模組 (模組 A)
* **`classrooms` (教室空間表)**
  * `id` (INT, PK, Auto Increment)
  * `room_code` (VARCHAR, Unique) — 空間編號（如：`管201`、`R102`）
  * `name` (VARCHAR) — 教室名稱（如：`電腦教室(一)`、`個案研討室`）
  * `floor` (VARCHAR) — 所在樓層（如：`1F`, `2F`）
  * `capacity` (INT) — 容納人數
  * `equipment_desc` (TEXT) — 教室固定設備說明（單槍、麥克風、冷氣數量等，參考暨大管院網站）
  * `panorama_url` (VARCHAR) — 360° 全景照片路徑（供 Pannellum.js 載入）
  * `map_x` (FLOAT) — 管院平面圖 X 軸相對百分比座標 (`0.0 ~ 100.0`)
  * `map_y` (FLOAT) — 管院平面圖 Y 軸相對百分比座標 (`0.0 ~ 100.0`)

### 4.3 空間 / 物品預約借用模組 (模組 B)
* **`equipment_items` (可借用物品主表)**
  * `id` (INT, PK, Auto Increment)
  * `name` (VARCHAR) — 物品名稱（如：`教室鑰匙`、`投影筆`、`公務筆電`、`延長線`）
  * `total_stock` (INT) — 庫存總數
* **`bookings` (空間借用申請單)**
  * `id` (INT, PK, Auto Increment)
  * `user_id` (INT, FK -> `users.id`) — 申請人
  * `classroom_id` (INT, FK -> `classrooms.id`) — 借用教室
  * `booking_date` (DATE) — 借用日期
  * `start_time` (TIME) — 開始時間
  * `end_time` (TIME) — 結束時間
  * `purpose` (TEXT) — 借用用途說明
  * `status` (ENUM: `'pending'`, `'approved'`, `'rejected'`, `'checked_out'`, `'returned'`) — 借用狀態機
  * `admin_comment` (TEXT, Nullable) — 管理員審核意見（退件或通過備註）
  * `checked_out_at` (DATETIME, Nullable) — 管理員註記領用時間
  * `returned_at` (DATETIME, Nullable) — 管理員註記歸還時間
* **`booking_items` (借用物品明細表 — 支援多選)**
  * `id` (INT, PK, Auto Increment)
  * `booking_id` (INT, FK -> `bookings.id`)
  * `item_id` (INT, FK -> `equipment_items.id`)
  * `quantity` (INT) — 借用數量（預設 `1`）

### 4.4 志願排課模組 (模組 C)
* **`courses` (課程與排課表)**
  * `id` (INT, PK, Auto Increment)
  * `course_code` (VARCHAR) — 課號
  * `course_name` (VARCHAR) — 課程名稱
  * `teacher_id` (INT, FK -> `users.id`) — 授課教師
  * `classroom_id` (INT, FK -> `classrooms.id`, Nullable) — 希望教室 / 實際分配教室
  * `day_of_week` (INT) — 星期幾 (`1` = 週一 ~ `7` = 週日)
  * `start_time` (TIME) — 上課開始時間
  * `end_time` (TIME) — 上課結束時間
  * `status` (ENUM: `'wish'`, `'confirmed'`) — `'wish'` 為教師志願登記，`'confirmed'` 為管理員確認排定

---

## 5. 「基本款」到「完整款」的跨模組整合機制

為爭取專案最高評價，系統在資料查詢與寫入時實作以下兩大跨模組連動邏輯：

1. **空間查詢 ⇄ 空間借用整合**
   * **前端連動**：在管院平面圖點擊教室標記或檢視 360° 全景圖時，介面提供「**預約此教室**」快捷按鈕，點擊後攜帶 `classroom_id` 參數直接導向借用模組並預選該教室。
   * **資料連動**：管理員在「空間查詢模組」新增或修改教室後，「預約借用模組」的下拉選單與週借用表立即同步更新，無需手動維護兩份教室清單。
2. **志願排課 ⇄ 空間借用整合（統一時段衝突檢查）**
   * **借用時檢查課表**：當使用者查詢某教室「當週借用狀況」或送出借用申請時，後端 `Booking Service` 同時查詢 `bookings`（已核准借用）與 `courses`（已排定課程）。若該時段已有正式課程，週借用表直接標示為「**固定排課占用**」並阻擋重複預約。
   * **排課時檢查借用**：當管理員在週日曆透過 **Drag & Drop** 拖曳調整課程時間或教室時，後端 `Schedule Service` 即時檢測三大衝突並回傳衝突清單：
     1. **教師衝堂**：同一位老師在同一時段有兩門課。
     2. **教室衝堂**：同一間教室在同一時段被安排兩門課。
     3. **借用衝突**：該教室在目標時段已有管理員核准的臨時借用單 (`bookings.status = 'approved'`)。

---

## 6. 核心 API 端點規劃 (RESTful API Endpoints)

| 模組 | Method | Endpoint | 說明 | 權限 |
| :--- | :--- | :--- | :--- | :--- |
| **共用** | `POST` | `/api/auth/register` | 提交帳號註冊申請 | 公開 |
| **共用** | `POST` | `/api/auth/login` | 帳號登入（驗證 `status == 'active'`） | 公開 |
| **共用** | `PATCH` | `/api/admin/users/{id}/approve` | 管理員審核通過或退回註冊帳號 | Admin |
| **模組 A** | `GET` | `/api/classrooms` | 取得所有教室基本資料、平面圖座標與 360 圖路徑 | 公開 |
| **模組 A** | `POST/PUT/DELETE` | `/api/classrooms/{id}` | 新增、修改、刪除教室資料 | Admin |
| **模組 B** | `GET` | `/api/bookings/weekly` | 依教室與週次查詢當週借用與排課占用狀況 | 已登入 |
| **模組 B** | `POST` | `/api/bookings` | 提交空間與多項物品借用申請（含衝突檢查） | 已登入 |
| **模組 B** | `PATCH` | `/api/bookings/{id}/status` | 管理員審核（通過/退件+意見）、註記領用、註記歸還 | Admin |
| **模組 C** | `GET` | `/api/courses` | 取得課程清單（教師僅看自己；管理員看全系） | Teacher/Admin |
| **模組 C** | `POST/PUT/DELETE` | `/api/courses/{id}` | 教師登記志願/修改個人課程；管理員增刪指派課程 | Teacher/Admin |
| **模組 C** | `PATCH` | `/api/courses/{id}/drag-drop` | 接收日曆拖曳後的星期/時間/教室並更新 | Admin |
| **模組 C** | `GET` | `/api/courses/conflicts` | 列出所有時間/教室衝突的課程清單 | Admin |

---

## 7. 推薦技術棧與 Git 協作規範

### 7.1 推薦開發套件
* **後端框架**：Python **FastAPI** 或 **Node.js (Express)**（自動產生 API 文件，方便前後端對接）。
* **資料庫**：**MySQL** 或 **PostgreSQL**（建議使用雲端免費 DB 服務如 Supabase / Aiven，讓三位組員連線至同一座資料庫）。
* **前端互動元件**：
  * **360° 全景檢視**：[Pannellum.js](https://pannellum.org/)
  * **週日曆與 Drag & Drop 排課**：[FullCalendar.js](https://fullcalendar.io/)（啟用 `timeGridWeek` 視圖與 `editable: true` 即可支援滑鼠拖曳調課與事件變更回呼）。

### 7.2 Git 分支管理策略
為確保「共用同一個 Git Repo」且「每位組員皆有合理 Commit 紀錄」，建議採用以下分支結構：
* `main`：最終 Demo 穩定版本（僅接受來自 `dev` 的 Merge）。
* `dev`：整合測試分支（各模組完成後合併至此進行跨模組測試）。
* `feat/core-and-space`：組員 A 開發分支（共用驗證 + 空間查詢與 360 全景）。
* `feat/booking`：組員 B 開發分支（空間/物品預約、審核與領還紀錄）。
* `feat/schedule`：組員 C 開發分支（志願排課、週日曆與 Drag & Drop）。