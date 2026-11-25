/**
 * 教室空間業務邏輯控制器 (Classroom Controller)
 */

// 預設資料集 (記憶體模擬，同時對應資料庫設計與真實暨大管院資料)
let classroomsData = [
  {
    id: 1,
    room_code: '管112',
    name: '一般教學教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 28.5,
    map_coord_y: 36.2,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '提供大學部與研究所常態性課程授課之標準教學空間，採光明亮、通風良好。',
    borrow_info: '課程教學優先。若需借用請至管理學院院辦公室登記並換領鑰匙。',
    facilities: ['高高畫質投影機', '電動投影布幕', '無線高速網路 (Wi-Fi 6)', '教學專面白板', '冷氣與循環電扇']
  },
  {
    id: 2,
    room_code: '管113',
    name: '多媒體數位教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 42.0,
    map_coord_y: 36.2,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    default_yaw: 15,
    default_pitch: -5,
    default_hfov: 100,
    description: '標準數位化教學教室，配備雙布幕與多媒體講桌。',
    borrow_info: '課程教學優先。借用請洽管院辦公室。',
    facilities: ['高高畫質投影機', '電動投影布幕', '無線高速網路 (Wi-Fi 6)', '智慧數位教學講桌', '冷氣與循環電扇']
  },
  {
    id: 3,
    room_code: '管115',
    name: '綜合教學教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 68.4,
    map_coord_y: 36.2,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '東側大型通風教室，適合各類專案分組與跨系選修課程。',
    borrow_info: '課程教學優先，課餘時間借用需系所行政核可。',
    facilities: ['高高畫質投影機', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)', '教學專面白板']
  },
  {
    id: 4,
    room_code: '管206',
    name: '專業研討教室',
    floor_code: '2F',
    room_type: '研討室',
    capacity: 40,
    map_coord_x: 22.1,
    map_coord_y: 45.8,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '活動式模組桌椅，可隨時依教學需求自由重組為小組討論或演講模式。',
    borrow_info: '研討會議優先借用。',
    facilities: ['高高畫質投影機', '教學專面白板', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)']
  },
  {
    id: 5,
    room_code: '管213',
    name: '哈佛式個案討論教室',
    floor_code: '2F',
    room_type: '個案教室',
    capacity: 50,
    map_coord_x: 48.0,
    map_coord_y: 45.8,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    default_yaw: 10,
    default_pitch: -5,
    default_hfov: 100,
    description: '比照哈佛大學商學院個案教學規格設計之環形教室，強化師生雙向思辨。',
    borrow_info: '個案討論、EMBA課程、國際企業專題優先借用。',
    facilities: ['智慧數位教學講桌', '有線/無線麥克風音響', '環形階梯討論座位', '高高畫質投影機']
  },
  {
    id: 6,
    room_code: '管226',
    name: '個案階梯教室',
    floor_code: '2F',
    room_type: '階梯教室',
    capacity: 80,
    map_coord_x: 72.5,
    map_coord_y: 45.8,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '階梯式馬蹄型座席，提供無死角視線與絕佳音響迴響效果。',
    borrow_info: '管理學院大堂課程、專題講座優先。',
    facilities: ['高高畫質投影機', '有線/無線麥克風音響', '冷氣與循環電扇', '環形階梯討論座位']
  },
  {
    id: 7,
    room_code: '管268',
    name: '大型學術演講廳',
    floor_code: '2F',
    room_type: '會議廳',
    capacity: 270,
    map_coord_x: 88.0,
    map_coord_y: 78.5,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    default_yaw: -30,
    default_pitch: 0,
    default_hfov: 105,
    description: '管院最大型階梯演講禮堂，適合大型國際研討會、全院週會、企業領袖講座。',
    borrow_info: '須於活動二週前向管院辦公室提出正式公文申請。',
    facilities: ['大型劇院座椅', '雙大螢幕投影', '專業有線/無線麥克風音響', '冷氣與循環電扇']
  },
  {
    id: 8,
    room_code: '管329',
    name: '智慧教學教室',
    floor_code: '3F',
    room_type: '一般教室',
    capacity: 60,
    map_coord_x: 35.0,
    map_coord_y: 52.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '設有數位互動觸控智慧黑板、高階智慧講桌與無線螢幕投影系統。',
    borrow_info: '智慧教學示範空間，依教務處核定專案優先。',
    facilities: ['智慧數位教學講桌', '高高畫質投影機', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)']
  },
  {
    id: 9,
    room_code: '管432',
    name: '國企系系會議室',
    floor_code: '4F',
    room_type: '會議室',
    capacity: 20,
    map_coord_x: 31.0,
    map_coord_y: 48.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '國企系系務會議、教師研討及外賓接見之專用空間。',
    borrow_info: '國企系辦公室專管空間，借用請洽國企系辦。',
    facilities: ['高畫質視訊錄播會議系統', '教學專面白板', '冷氣與循環電扇']
  }
];

let nextId = 10;

/**
 * 查詢教室列表 (公開免登入，支援多元過濾)
 */
export const getClassrooms = (req, res) => {
  const { floor, type, min_capacity, keyword } = req.query;

  let results = [...classroomsData];

  if (floor) {
    results = results.filter(c => c.floor_code.toUpperCase() === floor.toUpperCase());
  }
  if (type) {
    results = results.filter(c => c.room_type === type);
  }
  if (min_capacity) {
    results = results.filter(c => c.capacity >= parseInt(min_capacity, 10));
  }
  if (keyword) {
    const q = keyword.toLowerCase();
    results = results.filter(c => 
      c.room_code.toLowerCase().includes(q) || 
      c.name.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
};

/**
 * 取得單一教室詳細資料
 */
export const getClassroomById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const classroom = classroomsData.find(c => c.id === id);

  if (!classroom) {
    return res.status(404).json({ success: false, message: '查無該教室資料' });
  }

  res.json({
    success: true,
    data: classroom
  });
};

/**
 * 新增教室資料 (管理員)
 */
export const createClassroom = (req, res) => {
  const { room_code, name, floor_code, room_type, capacity, map_coord_x, map_coord_y, panorama_url, description, borrow_info, facilities } = req.body;

  if (!room_code || !name || !floor_code) {
    return res.status(400).json({ success: false, message: '教室代號、名稱與樓層為必填欄位' });
  }

  const existing = classroomsData.find(c => c.room_code.trim().toLowerCase() === room_code.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: `教室代號 ${room_code} 已存在` });
  }

  const newClassroom = {
    id: nextId++,
    room_code,
    name,
    floor_code,
    room_type: room_type || '一般教室',
    capacity: parseInt(capacity, 10) || 50,
    map_coord_x: parseFloat(map_coord_x) || 50.0,
    map_coord_y: parseFloat(map_coord_y) || 50.0,
    panorama_url: panorama_url || 'https://pannellum.org/images/cerro-toco-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: description || '',
    borrow_info: borrow_info || '依管理學院相關規定辦理借用。',
    facilities: Array.isArray(facilities) ? facilities : ['高高畫質投影機', '無線高速網路 (Wi-Fi 6)', '冷氣與循環電扇']
  };

  classroomsData.push(newClassroom);

  res.status(201).json({
    success: true,
    message: '教室新增成功',
    data: newClassroom
  });
};

/**
 * 修改教室資料 (管理員)
 */
export const updateClassroom = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = classroomsData.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: '查無欲修改之教室' });
  }

  const current = classroomsData[index];
  const updated = {
    ...current,
    ...req.body,
    id: current.id // 保護 ID 不可變更
  };

  classroomsData[index] = updated;

  res.json({
    success: true,
    message: '教室資料更新成功',
    data: updated
  });
};

/**
 * 刪除教室資料 (管理員)
 */
export const deleteClassroom = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = classroomsData.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: '查無欲刪除之教室' });
  }

  const deleted = classroomsData.splice(index, 1)[0];

  res.json({
    success: true,
    message: `教室 ${deleted.room_code} 已刪除`
  });
};
