-- ==============================================================================
-- 國立暨南國際大學 管理學院空間查詢模組 (NCNU Management College Space Query)
-- 資料庫結構腳本 (Database Schema & Seed Data)
-- 資料依據: 國立暨南國際大學國際企業學系教室資源
-- https://www.ibs.ncnu.edu.tw/index.php/resources/space-classroom
-- ==============================================================================

CREATE TABLE IF NOT EXISTS floors (
    floor_code VARCHAR(10) PRIMARY KEY,
    building VARCHAR(50) NOT NULL DEFAULT '管理學院大樓',
    floor_name VARCHAR(50) NOT NULL,
    svg_map_path VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classrooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_code VARCHAR(20) NOT NULL UNIQUE,    -- 教室代號 (如: 管112, 管213, 管432)
    name VARCHAR(100) NOT NULL,               -- 空間名稱 (如: 一般教室, 個案教室, 國企系會議室)
    floor_code VARCHAR(10) NOT NULL,          -- 所屬樓層
    room_type VARCHAR(50) NOT NULL,           -- 空間性質
    capacity INT NOT NULL,                    -- 容納人數 (依官網公佈標準)
    map_coord_x REAL NOT NULL DEFAULT 50.0,   -- 平面圖相對 X 座標比例 (0.00 ~ 100.00%)
    map_coord_y REAL NOT NULL DEFAULT 50.0,   -- 平面圖相對 Y 座標比例 (0.00 ~ 100.00%)
    panorama_url VARCHAR(500) NOT NULL,       -- 360 度全景等距長方投影照片
    default_yaw REAL DEFAULT 0.0,
    default_pitch REAL DEFAULT 0.0,
    default_hfov REAL DEFAULT 100.0,
    description TEXT,
    borrow_info TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_code) REFERENCES floors(floor_code) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    icon_class VARCHAR(50) DEFAULT 'fa-tv',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classroom_facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    classroom_id INT NOT NULL,
    facility_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    UNIQUE(classroom_id, facility_id)
);

CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 樓層資料
INSERT INTO floors (floor_code, building, floor_name, svg_map_path, sort_order) VALUES
('1F', '管理學院大樓', '一樓 (主門廳/一般教學教室)', '/assets/maps/floor-1f.svg', 1),
('2F', '管理學院大樓', '二樓 (個案教室/階梯教室/一般教室)', '/assets/maps/floor-2f.svg', 2),
('3F', '管理學院大樓', '三樓 (大型一般教室/綜合空間)', '/assets/maps/floor-3f.svg', 3),
('4F', '管理學院大樓', '四樓 (國企系會議室/研究生室/研討室)', '/assets/maps/floor-4f.svg', 4),
('教院', '教育學院大樓', '教育學院支援教室 (B1/1F)', '/assets/maps/floor-edu.svg', 5);

-- 預設管理員 (帳號: admin, 密碼: admin123)
INSERT INTO admins (username, password_hash, display_name, email, role) VALUES
('admin', '$2a$10$wTfk1j4sXk2MvV2oQ6x.2OUKzJkUlnFwI3K65m09g1rL6V4jM6p6e', '管院空間系統管理員', 'admin@ibs.ncnu.edu.tw', 'superadmin');

-- 依據國立暨南國際大學國企系官網精確匯入教室清單與容納人數
INSERT INTO classrooms (room_code, name, floor_code, room_type, capacity, map_coord_x, map_coord_y, panorama_url, description, borrow_info) VALUES
('管112', '一般教室', '1F', '一般教室', 50, 28.5, 30.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '管理學院一樓西側標準教學教室。配備投影機、布幕、白板、冷氣與電扇、無線網路。', '課程教學優先。借用請洽管院辦公室登記並借用鑰匙。'),
('管113', '一般教室', '1F', '一般教室', 50, 48.0, 30.0, 'https://pannellum.org/images/alma.jpg', '管理學院一樓中央標準教學空間。配備高流明投影設備、冷氣、白板、麥克風。', '課程教學優先。借用請洽管院辦公室。'),
('管204', '一般教室', '2F', '一般教室', 40, 18.0, 32.0, 'https://pannellum.org/images/bma-0.jpg', '二樓西翼多功能教學教室，容納40人，適合中小型必選修課程授課與分組研習。', '課程教學優先。借用請洽管院辦公室。'),
('管206', '一般教室', '2F', '一般教室', 40, 28.0, 32.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '二樓西側標準教室，容納40人。配備投影設備、白板、空調及無線網路。', '研討會議與教學優先。'),
('管207', '一般教室', '2F', '一般教室', 40, 38.0, 32.0, 'https://pannellum.org/images/alma.jpg', '二樓一般教室，容納40人。適合系所專案課程、選修課程教學。', '課程教學優先。'),
('管210', '一般教室', '2F', '一般教室', 40, 48.0, 32.0, 'https://pannellum.org/images/bma-0.jpg', '二樓標準教室，容納40人。配備智慧數位講桌與冷氣電扇。', '課程教學優先。'),
('管212', '一般教室', '2F', '一般教室', 40, 58.0, 32.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '二樓一般教室，容納40人。採光明亮，配備教學投影機與白板。', '課程教學優先。'),
('管213', '個案教室', '2F', '個案教室', 50, 68.0, 32.0, 'https://pannellum.org/images/alma.jpg', '哈佛式個案討論教室，容納50人。採半圓弧形座席，專為個案思辨、互動式討論設計。', '個案討論、EMBA課程、國際企業專題優先借用。'),
('管215', '個案階梯教室', '2F', '階梯教室', 100, 78.0, 32.0, 'https://pannellum.org/images/bma-0.jpg', '百人規模大型個案階梯教室，馬蹄型階梯座席，無死角音響視訊與錄播設施。', '管理學院大型必修、跨系演講優先。'),
('管226', '個案階梯教室', '2F', '階梯教室', 80, 86.0, 42.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '二樓東側個案階梯教室，容納80人。具備階梯式桌椅、高流明投影與擴音系統。', '個案分析與大堂授課優先。'),
('管228', '個案階梯教室', '2F', '階梯教室', 80, 86.0, 68.0, 'https://pannellum.org/images/alma.jpg', '二樓階梯教室，容納80人。適合演講論壇、全系大合班授課。', '洽管院辦公室辦理登記。'),
('管331', '一般教室', '3F', '一般教室', 100, 52.0, 32.0, 'https://pannellum.org/images/bma-0.jpg', '三樓百人大型標準教室，容納100人。配備雙投影布幕、中央空調、智慧講桌。', '院共同必修課程優先使用。'),
('管406', '國企系碩士生研究室(2)', '4F', '研究室', 12, 22.0, 32.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '國企系專屬研究生自習與論文研討空間，容納12人，配備門禁與個人研究桌位。', '國企系碩士生專屬研究室，門禁管制。'),
('管432', '國企系會議室', '4F', '會議室', 20, 35.0, 32.0, 'https://pannellum.org/images/alma.jpg', '國企系會議室，容納20人。配備大型橢圓會議桌、視訊會議設備、投影幕。', '國企系辦公室專管空間，系務會議與學術接待優先。'),
('管443', '一般教室', '4F', '一般教室', 50, 48.0, 32.0, 'https://pannellum.org/images/bma-0.jpg', '四樓一般教室，容納50人。適合專案研習、研究所課程與各項教學活動。', '國企系及管院教學優先。'),
('管451', '研討室', '4F', '研討室', 20, 62.0, 32.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '四樓專業小型研討室，容納20人。適宜專題審查、論文口試、小組專題探討。', '研討會議與口試優先借用。'),
('管457', '一般教室', '4F', '一般教室', 60, 75.0, 32.0, 'https://pannellum.org/images/alma.jpg', '四樓一般教室，容納60人。空間寬敞通風，配備標準教學投影與活動白板。', '課程教學優先。借用洽管院辦公室。'),
('教A001', '一般教室', '教院', '一般教室', 120, 50.0, 35.0, 'https://pannellum.org/images/bma-0.jpg', '教育學院地下1樓大階梯教室，容納120人。配備高階音響與DVD播放教學系統。', '教育學院支援教室，借用依教務處及教院規範。'),
('教A100', '一般教室', '教院', '一般教室', 200, 50.0, 65.0, 'https://pannellum.org/images/cerro-toco-0.jpg', '教育學院1樓大型國際階梯講堂，容納200人。適合全校性大型講座、學術研討大會。', '教育學院支援教室，借用須提早送單申請。');
