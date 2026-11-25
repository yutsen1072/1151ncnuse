/**
 * 教室空間業務邏輯控制器 (Classroom Controller)
 * 資料依據: 國立暨南國際大學國際企業學系教室資源
 * https://www.ibs.ncnu.edu.tw/index.php/resources/space-classroom
 */

let classroomsData = [
  {
    id: 1,
    room_code: '管112',
    name: '一般教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 28.5,
    map_coord_y: 30.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '管理學院一樓西側標準教學教室。配備投影機、布幕、白板、冷氣與電扇、無線網路。',
    borrow_info: '課程教學優先。借用請洽管院辦公室登記並借用鑰匙。',
    facilities: ['高高畫質投影機', '電動投影布幕', '教學專面白板', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)']
  },
  {
    id: 2,
    room_code: '管113',
    name: '一般教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 48.0,
    map_coord_y: 30.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '管理學院一樓中央標準教學空間。配備高流明投影設備、冷氣、白板、麥克風。',
    borrow_info: '課程教學優先。借用請洽管院辦公室。',
    facilities: ['高高畫質投影機', '冷氣與循環電扇', '教學專面白板', '有線/無線麥克風音響']
  },
  {
    id: 3,
    room_code: '管204',
    name: '一般教室',
    floor_code: '2F',
    room_type: '一般教室',
    capacity: 40,
    map_coord_x: 18.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '二樓西翼多功能教學教室，容納40人，適合中小型必選修課程授課與分組研習。',
    borrow_info: '課程教學優先。借用請洽管院辦公室。',
    facilities: ['高高畫質投影機', '冷氣與循環電扇', '教學專面白板']
  },
  {
    id: 4,
    room_code: '管206',
    name: '一般教室',
    floor_code: '2F',
    room_type: '一般教室',
    capacity: 40,
    map_coord_x: 28.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '二樓西側標準教室，容納40人。配備投影設備、白板、空調及無線網路。',
    borrow_info: '研討會議與教學優先。',
    facilities: ['高高畫質投影機', '教學專面白板', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)']
  },
  {
    id: 5,
    room_code: '管207',
    name: '一般教室',
    floor_code: '2F',
    room_type: '一般教室',
    capacity: 40,
    map_coord_x: 38.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '二樓一般教室，容納40人。適合系所專案課程、選修課程教學。',
    borrow_info: '課程教學優先。',
    facilities: ['高高畫質投影機', '冷氣與循環電扇', '教學專面白板']
  },
  {
    id: 6,
    room_code: '管210',
    name: '一般教室',
    floor_code: '2F',
    room_type: '一般教室',
    capacity: 40,
    map_coord_x: 48.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '二樓標準教室，容納40人。配備智慧數位講桌與冷氣電扇。',
    borrow_info: '課程教學優先。',
    facilities: ['高高畫質投影機', '智慧數位教學講桌', '冷氣與循環電扇']
  },
  {
    id: 7,
    room_code: '管212',
    name: '一般教室',
    floor_code: '2F',
    room_type: '一般教室',
    capacity: 40,
    map_coord_x: 58.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '二樓一般教室，容納40人。採光明亮，配備教學投影機與白板。',
    borrow_info: '課程教學優先。',
    facilities: ['高高畫質投影機', '冷氣與循環電扇', '教學專面白板']
  },
  {
    id: 8,
    room_code: '管213',
    name: '個案教室',
    floor_code: '2F',
    room_type: '個案教室',
    capacity: 50,
    map_coord_x: 68.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '哈佛式個案討論教室，容納50人。採半圓弧形座席，專為個案思辨、互動式討論設計。',
    borrow_info: '個案討論、EMBA課程、國際企業專題優先借用。',
    facilities: ['智慧數位教學講桌', '環形階梯討論座位', '高高畫質投影機', '有線/無線麥克風音響']
  },
  {
    id: 9,
    room_code: '管215',
    name: '個案階梯教室',
    floor_code: '2F',
    room_type: '階梯教室',
    capacity: 100,
    map_coord_x: 78.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '百人規模大型個案階梯教室，馬蹄型階梯座席，無死角音響視訊與錄播設施。',
    borrow_info: '管理學院大型必修、跨系演講優先。',
    facilities: ['高高畫質投影機', '環形階梯討論座位', '有線/無線麥克風音響', '冷氣與循環電扇']
  },
  {
    id: 10,
    room_code: '管226',
    name: '個案階梯教室',
    floor_code: '2F',
    room_type: '階梯教室',
    capacity: 80,
    map_coord_x: 86.0,
    map_coord_y: 42.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '二樓東側個案階梯教室，容納80人。具備階梯式桌椅、高流明投影與擴音系統。',
    borrow_info: '個案分析與大堂授課優先。',
    facilities: ['高高畫質投影機', '環形階梯討論座位', '冷氣與循環電扇', '有線/無線麥克風音響']
  },
  {
    id: 11,
    room_code: '管228',
    name: '個案階梯教室',
    floor_code: '2F',
    room_type: '階梯教室',
    capacity: 80,
    map_coord_x: 86.0,
    map_coord_y: 68.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '二樓階梯教室，容納80人。適合演講論壇、全系大合班授課。',
    borrow_info: '洽管院辦公室辦理登記。',
    facilities: ['高高畫質投影機', '環形階梯討論座位', '冷氣與循環電扇', '有線/無線麥克風音響']
  },
  {
    id: 12,
    room_code: '管331',
    name: '一般教室',
    floor_code: '3F',
    room_type: '一般教室',
    capacity: 100,
    map_coord_x: 52.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '三樓百人大型標準教室，容納100人。配備雙投影布幕、中央空調、智慧講桌。',
    borrow_info: '院共同必修課程優先使用。',
    facilities: ['高高畫質投影機', '電動投影布幕', '冷氣與循環電扇', '智慧數位教學講桌']
  },
  {
    id: 13,
    room_code: '管406',
    name: '國企系碩士生研究室(2)',
    floor_code: '4F',
    room_type: '研究室',
    capacity: 12,
    map_coord_x: 22.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '國企系專屬研究生自習與論文研討空間，容納12人，配備門禁與個人研究桌位。',
    borrow_info: '國企系碩士生專屬研究室，門禁管制。',
    facilities: ['冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)', '個人自習隔間']
  },
  {
    id: 14,
    room_code: '管432',
    name: '國企系會議室',
    floor_code: '4F',
    room_type: '會議室',
    capacity: 20,
    map_coord_x: 35.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '國企系會議室，容納20人。配備大型橢圓會議桌、視訊會議設備、投影幕。',
    borrow_info: '國企系辦公室專管空間，系務會議與學術接待優先。',
    facilities: ['高高畫質投影機', '視訊會議系統', '教學專面白板', '冷氣與循環電扇']
  },
  {
    id: 15,
    room_code: '管443',
    name: '一般教室',
    floor_code: '4F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 48.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '四樓一般教室，容納50人。適合專案研習、研究所課程與各項教學活動。',
    borrow_info: '國企系及管院教學優先。',
    facilities: ['高高畫質投影機', '教學專面白板', '冷氣與循環電扇']
  },
  {
    id: 16,
    room_code: '管451',
    name: '研討室',
    floor_code: '4F',
    room_type: '研討室',
    capacity: 20,
    map_coord_x: 62.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '四樓專業小型研討室，容納20人。適宜專題審查、論文口試、小組專題探討。',
    borrow_info: '研討會議與口試優先借用。',
    facilities: ['高高畫質投影機', '教學專面白板', '冷氣與循環電扇']
  },
  {
    id: 17,
    room_code: '管457',
    name: '一般教室',
    floor_code: '4F',
    room_type: '一般教室',
    capacity: 60,
    map_coord_x: 75.0,
    map_coord_y: 32.0,
    panorama_url: 'https://pannellum.org/images/alma.jpg',
    description: '四樓一般教室，容納60人。空間寬敞通風，配備標準教學投影與活動白板。',
    borrow_info: '課程教學優先。借用洽管院辦公室。',
    facilities: ['高高畫質投影機', '教學專面白板', '冷氣與循環電扇']
  },
  {
    id: 18,
    room_code: '教A001',
    name: '一般教室',
    floor_code: '教院',
    room_type: '一般教室',
    capacity: 120,
    map_coord_x: 50.0,
    map_coord_y: 35.0,
    panorama_url: 'https://pannellum.org/images/bma-0.jpg',
    description: '教育學院地下1樓大階梯教室，容納120人。配備高階音響與DVD播放教學系統。',
    borrow_info: '教育學院支援教室，借用依教務處及教院規範。',
    facilities: ['高高畫質投影機', '電動投影布幕', '有線/無線麥克風音響', '冷氣與循環電扇']
  },
  {
    id: 19,
    room_code: '教A100',
    name: '一般教室',
    floor_code: '教院',
    room_type: '一般教室',
    capacity: 200,
    map_coord_x: 50.0,
    map_coord_y: 65.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    description: '教育學院1樓大型國際階梯講堂，容納200人。適合全校性大型講座、學術研討大會。',
    borrow_info: '教育學院支援教室，借用須提早送單申請。',
    facilities: ['高高畫質投影機', '雙電動投影布幕', '專業舞台音響', '冷氣與循環電扇']
  }
];

let nextId = 20;

export const getClassrooms = (req, res) => {
  const { floor, type, min_capacity, keyword } = req.query;

  let results = [...classroomsData];

  if (floor && floor !== 'ALL') {
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
    id: current.id
  };

  classroomsData[index] = updated;

  res.json({
    success: true,
    message: '教室資料更新成功',
    data: updated
  });
};

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
