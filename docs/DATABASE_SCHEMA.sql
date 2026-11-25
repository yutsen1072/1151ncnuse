-- ==============================================================================
-- 國立暨南國際大學 管理學院空間查詢模組 (NCNU Management College Space Query)
-- 資料庫結構腳本 (Database Schema & Seed Data)
-- 支援標準: PostgreSQL / SQLite / MySQL
-- ==============================================================================

-- 1. 樓層基本資料表 (floors)
CREATE TABLE IF NOT EXISTS floors (
    floor_code VARCHAR(10) PRIMARY KEY,       -- 樓層代碼 (例: 'B1', '1F', '2F', '3F', '4F', '5F')
    building VARCHAR(50) NOT NULL DEFAULT '管理學院大樓',
    floor_name VARCHAR(50) NOT NULL,          -- 樓層名稱 (例: '一樓 (主入口/EMBA/育成中心)')
    svg_map_path VARCHAR(255) NOT NULL,       -- 平面圖路徑 (SVG / 向量檔)
    plan_image_url VARCHAR(255),              -- 平面圖高解析度圖檔 (PNG/JPG)
    sort_order INT NOT NULL DEFAULT 0,        -- 樓層排序
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 教室空間基本資料表 (classrooms)
CREATE TABLE IF NOT EXISTS classrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,     -- 教室自動編號 (PostgreSQL 可改 SERIAL)
    room_code VARCHAR(20) NOT NULL UNIQUE,    -- 教室編號 (例: '管112', '管213', '管268')
    name VARCHAR(100) NOT NULL,               -- 空間名稱 (例: '一般教學教室', '個案階梯教室')
    floor_code VARCHAR(10) NOT NULL,          -- 所屬樓層
    room_type VARCHAR(50) NOT NULL,           -- 空間性質: '一般教室', '個案教室', '階梯教室', '會議廳', '研討室', '實驗室'
    capacity INT NOT NULL DEFAULT 50,         -- 容納人數 (人)
    map_coord_x REAL NOT NULL DEFAULT 50.0,   -- 平面圖相對 X 座標比例 (0.00 ~ 100.00%)
    map_coord_y REAL NOT NULL DEFAULT 50.0,   -- 平面圖相對 Y 座標比例 (0.00 ~ 100.00%)
    panorama_url VARCHAR(500) NOT NULL,       -- 360 度全景等距柱狀投影圖片路徑 (Equirectangular image)
    panorama_thumb_url VARCHAR(500),          -- 全景預覽縮圖
    default_yaw REAL DEFAULT 0.0,             -- 全景初始水平視角 (Yaw: -180 ~ 180)
    default_pitch REAL DEFAULT 0.0,           -- 全景初始垂直俯仰 (Pitch: -90 ~ 90)
    default_hfov REAL DEFAULT 100.0,          -- 全景初始視野寬度 (HFOV: 50 ~ 120)
    description TEXT,                         -- 教室空間介紹、格局與備註
    borrow_info TEXT,                         -- 空間借用辦法、優先順序與鑰匙借用說明
    is_active BOOLEAN NOT NULL DEFAULT TRUE,  -- 是否開放展示與借用
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_code) REFERENCES floors(floor_code) ON DELETE RESTRICT
);

-- 建立常用搜尋索引
CREATE INDEX IF NOT EXISTS idx_classrooms_floor ON classrooms(floor_code);
CREATE INDEX IF NOT EXISTS idx_classrooms_room_type ON classrooms(room_type);
CREATE INDEX IF NOT EXISTS idx_classrooms_capacity ON classrooms(capacity);

-- 3. 設備設施項目表 (facilities)
CREATE TABLE IF NOT EXISTS facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,         -- 設備名稱 (例: '投影機', '冷氣與電扇', '智慧講桌')
    category VARCHAR(30) NOT NULL,            -- 類別: '影音設備', '環境溫控', '教學輔助', '網路通訊'
    icon_class VARCHAR(50) DEFAULT 'fa-tv',   -- 前端顯示圖示標籤
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 教室與設備關聯表 (classroom_facilities - 多對多)
CREATE TABLE IF NOT EXISTS classroom_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_id INT NOT NULL,
    facility_id INT NOT NULL,
    quantity INT DEFAULT 1,                   -- 設備數量
    note VARCHAR(100),                        -- 規格或型號備註 (例: '高流明雙投影機')
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    UNIQUE(classroom_id, facility_id)
);

-- 5. 系統管理員帳號表 (admins)
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,     -- 登入帳號
    password_hash VARCHAR(255) NOT NULL,      -- 安全雜湊密碼 (bcrypt / argon2)
    display_name VARCHAR(50) NOT NULL,        -- 顯示暱稱 (例: '管院空間管理處')
    email VARCHAR(100),                       -- 聯絡 Email
    role VARCHAR(20) NOT NULL DEFAULT 'admin',-- 角色權限 ('admin', 'superadmin')
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 管理維護審計日誌表 (audit_logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INT,
    action VARCHAR(50) NOT NULL,              -- 動作: 'CREATE', 'UPDATE', 'DELETE'
    target_type VARCHAR(50) NOT NULL,         -- 對象: 'classroom', 'panorama', 'facility'
    target_id INT,
    changes_json TEXT,                        -- 變更詳細欄位 JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 國立暨南國際大學管理學院 真實種子資料 (Initial Seed Data)
-- ==============================================================================

-- 插入樓層資料
INSERT INTO floors (floor_code, building, floor_name, svg_map_path, sort_order) VALUES
('B1', '管理學院大樓', '地下各專業講堂與實驗室', '/assets/maps/floor-b1.svg', 1),
('1F', '管理學院大樓', '一樓主門廳與創業育成空間', '/assets/maps/floor-1f.svg', 2),
('2F', '管理學院大樓', '二樓主要教學區與演講廳', '/assets/maps/floor-2f.svg', 3),
('3F', '管理學院大樓', '三樓綜合教室與大型會議廳', '/assets/maps/floor-3f.svg', 4),
('4F', '管理學院大樓', '四樓系所辦公室與專題研討室', '/assets/maps/floor-4f.svg', 5);

-- 插入常用設備項目
INSERT INTO facilities (name, category, icon_class) VALUES
('高高畫質投影機', '影音設備', 'fa-desktop'),
('電動投影布幕', '影音設備', 'fa-expand'),
('無線高速網路 (Wi-Fi 6)', '網路通訊', 'fa-wifi'),
('教學專面白板', '教學輔助', 'fa-chalkboard'),
('冷氣與循環電扇', '環境溫控', 'fa-snowflake'),
('有線/無線麥克風音響', '影音設備', 'fa-microphone'),
('智慧數位教學講桌', '教學輔助', 'fa-laptop-code'),
('環形階梯討論座位', '教學輔助', 'fa-users'),
('高畫質視訊錄播會議系統', '影音設備', 'fa-video');

-- 插入預設管理員帳號 (預設密碼: admin123, 雜湊值示範)
INSERT INTO admins (username, password_hash, display_name, email, role) VALUES
('admin', '$2a$10$wTfk1j4sXk2MvV2oQ6x.2OUKzJkUlnFwI3K65m09g1rL6V4jM6p6e', '管院空間系統管理員', 'admin@ibs.ncnu.edu.tw', 'superadmin');

-- 插入暨大管理學院真實教室空間資料 (參考暨大國企系與管院公開資料)
INSERT INTO classrooms (room_code, name, floor_code, room_type, capacity, map_coord_x, map_coord_y, panorama_url, description, borrow_info) VALUES
('管112', '一般教學教室', '1F', '一般教室', 50, 28.5, 36.2, '/assets/panoramas/room-112.jpg', '提供大學部與研究所常態性課程授課之標準教學空間，採光明亮、通風良好。', '課程教學優先。若需借用請至管理學院院辦公室登記並換領鑰匙。'),
('管113', '一般教學教室', '1F', '一般教室', 50, 42.0, 36.2, '/assets/panoramas/room-113.jpg', '標準數位化教學教室，配備雙布幕與多媒體講桌。', '課程教學優先。借用請洽管院辦公室。'),
('管115', '一般教學教室', '1F', '一般教室', 50, 68.4, 36.2, '/assets/panoramas/room-115.jpg', '東側大型通風教室，適合各類專案分組與跨系選修課程。', '課程教學優先，課餘時間借用需系所行政核可。'),
('管206', '專業研討教室', '2F', '研討室', 40, 22.1, 45.8, '/assets/panoramas/room-206.jpg', '活動式模組桌椅，可隨時依教學需求自由重組為小組討論或演講模式。', '研討會議優先借用。'),
('管213', '哈佛式個案討論教室', '2F', '個案教室', 50, 48.0, 45.8, '/assets/panoramas/room-213.jpg', '比照哈佛大學商學院個案教學規格設計之環形教室，強化師生雙向思辨。', '個案討論、EMBA課程、國際企業專題優先借用。'),
('管226', '個案階梯教室', '2F', '階梯教室', 80, 72.5, 45.8, '/assets/panoramas/room-226.jpg', '階梯式馬蹄型座席，提供無死角視線與絕佳音響迴響效果。', '管理學院大堂課程、講座優先。'),
('管260', '國際學術會議廳', '2F', '會議廳', 120, 85.0, 62.0, '/assets/panoramas/hall-260.jpg', '標準國際會議規格，具備中型論壇發布空間與貴賓席。', '學術研討會專案申請借用。'),
('管268', '大型學術演講廳', '2F', '會議廳', 270, 88.0, 78.5, '/assets/panoramas/hall-268.jpg', '管院最大型階梯演講禮堂，適合大型國際研討會、全院週會、企業領袖講座。', '須於活動二週前向管院辦公室提出正式公文申請。'),
('管329', '智慧互動教學教室', '3F', '一般教室', 60, 35.0, 52.0, '/assets/panoramas/room-329.jpg', '設有數位互動觸控智慧黑板、高階講桌與無線螢幕投影系統。', '智慧教學示範空間，依教務處核定專案優先。'),
('管331', '中型綜合教學教室', '3F', '一般教室', 100, 58.0, 52.0, '/assets/panoramas/room-331.jpg', '百人規格寬敞空間，具備完善空調與高流明投影。', '院共同必修課程優先使用。'),
('管371', '管理學院階梯會議廳', '3F', '會議廳', 250, 82.0, 68.0, '/assets/panoramas/hall-371.jpg', '配備高解析度LED大型主螢幕與專業舞台音響系統，適宜論文發表與大型專題競賽。', '請洽管院辦公室辦理借用審查程序。'),
('管432', '國企系系專屬會議室', '4F', '會議室', 20, 31.0, 48.0, '/assets/panoramas/room-432.jpg', '國企系系務會議、教師研討及外賓接見之專用空間。', '國企系辦公室專管空間，借用請洽國企系辦。'),
('管443', '專案研習教室', '4F', '一般教室', 50, 52.0, 48.0, '/assets/panoramas/room-443.jpg', '提供系所專題製作與分組論文研討之教學研究空間。', '國企系及管院研究所教學優先。'),
('管451', '碩博士生專題研討室', '4F', '研討室', 20, 71.0, 48.0, '/assets/panoramas/room-451.jpg', '專為研究生小組論文發想、個案分析量身打造之靜態研討空間。', '管院研究生刷卡門禁管制。');

-- 關聯教室設備
INSERT INTO classroom_facilities (classroom_id, facility_id, quantity)
SELECT c.id, f.id, 1
FROM classrooms c, facilities f
WHERE f.name IN ('高高畫質投影機', '電動投影布幕', '無線高速網路 (Wi-Fi 6)', '冷氣與循環電扇');

-- 為特定教室增添專屬設備
INSERT INTO classroom_facilities (classroom_id, facility_id, quantity, note)
SELECT c.id, f.id, 1, '雙麥克風與專業音效控制'
FROM classrooms c, facilities f
WHERE c.room_code IN ('管213', '管226', '管268', '管371') AND f.name = '有線/無線麥克風音響';

INSERT INTO classroom_facilities (classroom_id, facility_id, quantity, note)
SELECT c.id, f.id, 1, '數位觸控整合控制台'
FROM classrooms c, facilities f
WHERE c.room_code IN ('管329', '管213') AND f.name = '智慧數位教學講桌';
