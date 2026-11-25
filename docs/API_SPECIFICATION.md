# 國立暨南國際大學 管理學院空間查詢模組
## RESTful API 規格詳細規格書 (API Specification)

- **Base URL**: `/api/v1`
- **內容格式 (Content-Type)**: `application/json; charset=utf-8`
- **身份驗證機制 (Authentication)**: 
  - 公開查詢端點：免驗證 (無須 Bearer Token)
  - 管理端點：`Authorization: Bearer <JWT_TOKEN>`

---

## 1. 空間查詢與公開模組 (Public Endpoints)

### 1.1 查詢教室空間列表
- **端點**: `GET /api/v1/classrooms`
- **權限**: 公開 (免登入)
- **Query 參數**:
  - `floor` *(選填, string)*: 樓層代碼 (例: `1F`, `2F`, `3F`, `4F`, `B1`)
  - `type` *(選填, string)*: 空間性質 (例: `一般教室`, `個案教室`, `階梯教室`, `會議廳`, `研討室`)
  - `min_capacity` *(選填, integer)*: 最小容納人數
  - `keyword` *(選填, string)*: 關鍵字比對 (教室編號、名稱或描述)
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "room_code": "管112",
      "name": "一般教學教室",
      "floor_code": "1F",
      "room_type": "一般教室",
      "capacity": 50,
      "map_coord_x": 28.5,
      "map_coord_y": 36.2,
      "panorama_url": "/assets/panoramas/room-112.jpg",
      "facilities": [
        "高高畫質投影機",
        "電動投影布幕",
        "無線高速網路 (Wi-Fi 6)",
        "教學專面白板",
        "冷氣與循環電扇"
      ]
    },
    {
      "id": 5,
      "room_code": "管213",
      "name": "哈佛式個案討論教室",
      "floor_code": "2F",
      "room_type": "個案教室",
      "capacity": 50,
      "map_coord_x": 48.0,
      "map_coord_y": 45.8,
      "panorama_url": "/assets/panoramas/room-213.jpg",
      "facilities": [
        "智慧數位教學講桌",
        "有線/無線麥克風音響",
        "環形階梯討論座位"
      ]
    }
  ]
}
```

### 1.2 取得單一教室詳細資料 (含 360 視角與借用規範)
- **端點**: `GET /api/v1/classrooms/:id`
- **權限**: 公開 (免登入)
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "room_code": "管213",
    "name": "哈佛式個案討論教室",
    "floor_code": "2F",
    "room_type": "個案教室",
    "capacity": 50,
    "map_coord_x": 48.0,
    "map_coord_y": 45.8,
    "panorama_url": "/assets/panoramas/room-213.jpg",
    "default_yaw": 10.5,
    "default_pitch": -5.0,
    "default_hfov": 100.0,
    "description": "比照哈佛大學商學院個案教學規格設計之環形教室，強化師生雙向思辨。",
    "borrow_info": "個案討論、EMBA課程、國際企業專題優先借用。借用手續請洽管院二樓辦公室。",
    "facilities": [
      { "id": 1, "name": "高高畫質投影機", "category": "影音設備" },
      { "id": 7, "name": "智慧數位教學講桌", "category": "教學輔助" },
      { "id": 8, "name": "環形階梯討論座位", "category": "教學輔助" }
    ],
    "created_at": "2026-11-20T10:00:00Z",
    "updated_at": "2026-11-25T08:30:00Z"
  }
}
```

### 1.3 取得樓層與平面圖配置
- **端點**: `GET /api/v1/floors`
- **權限**: 公開 (免登入)
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "floor_code": "B1",
      "floor_name": "地下各專業講堂與實驗室",
      "svg_map_path": "/assets/maps/floor-b1.svg",
      "classroom_count": 4
    },
    {
      "floor_code": "1F",
      "floor_name": "一樓主門廳與創業育成空間",
      "svg_map_path": "/assets/maps/floor-1f.svg",
      "classroom_count": 6
    },
    {
      "floor_code": "2F",
      "floor_name": "二樓主要教學區與演講廳",
      "svg_map_path": "/assets/maps/floor-2f.svg",
      "classroom_count": 8
    }
  ]
}
```

---

## 2. 管理員維護模組 (Admin Protected Endpoints)

### 2.1 管理員登入
- **端點**: `POST /api/v1/auth/login`
- **權限**: 公開
- **請求格式 (JSON)**:
```json
{
  "username": "admin",
  "password": "adminPassword123"
}
```
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "display_name": "管院空間系統管理員",
    "role": "superadmin"
  }
}
```

### 2.2 新增教室資料 (Create)
- **端點**: `POST /api/v1/classrooms`
- **權限**: 管理員 (Header: `Authorization: Bearer <token>`)
- **請求格式 (JSON)**:
```json
{
  "room_code": "管228",
  "name": "個案階梯教室(二)",
  "floor_code": "2F",
  "room_type": "階梯教室",
  "capacity": 80,
  "map_coord_x": 75.2,
  "map_coord_y": 45.8,
  "panorama_url": "/assets/panoramas/room-228.jpg",
  "default_yaw": 0,
  "default_pitch": 0,
  "default_hfov": 100,
  "description": "二樓第二個案階梯教室，適合80人規模之大型個案與研討。",
  "borrow_info": "洽管院系所辦公室。",
  "facility_ids": [1, 2, 3, 5, 6]
}
```
- **回應範例 (201 Created)**:
```json
{
  "success": true,
  "message": "教室新增成功",
  "data": { "id": 16, "room_code": "管228" }
}
```

### 2.3 修改教室資料 (Update)
- **端點**: `PUT /api/v1/classrooms/:id`
- **權限**: 管理員 (Header: `Authorization: Bearer <token>`)
- **請求格式 (JSON)**:
```json
{
  "capacity": 85,
  "map_coord_x": 76.0,
  "map_coord_y": 46.2,
  "facility_ids": [1, 2, 3, 5, 6, 7]
}
```
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "message": "教室資料更新成功",
  "updated_fields": ["capacity", "map_coord_x", "map_coord_y", "facility_ids"]
}
```

### 2.4 刪除教室資料 (Delete)
- **端點**: `DELETE /api/v1/classrooms/:id`
- **權限**: 管理員 (Header: `Authorization: Bearer <token>`)
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "message": "教室資料已安全移除"
}
```

### 2.5 360 全景照片上傳端點
- **端點**: `POST /api/v1/upload/panorama`
- **權限**: 管理員 (Header: `Authorization: Bearer <token>`)
- **Content-Type**: `multipart/form-data`
- **請求欄位**: `file` (圖檔，支援 JPG/PNG，長寬比為 2:1 等距柱狀投影 equirectangular)
- **回應範例 (200 OK)**:
```json
{
  "success": true,
  "url": "/assets/panoramas/upload_1795576000.jpg",
  "width": 4096,
  "height": 2048,
  "aspect_ratio": "2:1"
}
```
