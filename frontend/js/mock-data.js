/**
 * 國立暨南國際大學 管理學院空間查詢模組
 * 資料儲存與 API 服務轉接層 (支援本機 LocalStorage 與 RESTful API 切換)
 */

export const INITIAL_CLASSROOMS = [
  {
    id: 1,
    room_code: '管112',
    name: '一般教學教室',
    floor_code: '1F',
    room_type: '一般教室',
    capacity: 50,
    map_coord_x: 28.5,
    map_coord_y: 28.5,
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
    map_coord_y: 28.5,
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
    map_coord_x: 68.5,
    map_coord_y: 28.5,
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
    map_coord_x: 22.0,
    map_coord_y: 28.5,
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
    map_coord_y: 28.5,
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
    map_coord_y: 28.5,
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
    map_coord_x: 86.2,
    map_coord_y: 72.0,
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
    map_coord_x: 35.5,
    map_coord_y: 28.5,
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
    room_code: '管371',
    name: '管理學院階梯會議廳',
    floor_code: '3F',
    room_type: '會議廳',
    capacity: 250,
    map_coord_x: 84.0,
    map_coord_y: 67.0,
    panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
    default_yaw: 0,
    default_pitch: 0,
    default_hfov: 100,
    description: '配備高解析度LED大型主螢幕與專業舞台音響系統，適宜論文發表與大型專題競賽。',
    borrow_info: '請洽管院辦公室辦理借用審查程序。',
    facilities: ['高高畫質投影機', '專業舞台音響', '冷氣與循環電扇', '劇院座椅']
  }
];

export const FLOORS_CONFIG = [
  { code: '1F', name: '一樓 (主入口/育成空間)', svg: '../assets/maps/floor-1f.svg' },
  { code: '2F', name: '二樓 (教學核心/會議廳)', svg: '../assets/maps/floor-2f.svg' },
  { code: '3F', name: '三樓 (多功能教室/大講堂)', svg: '../assets/maps/floor-3f.svg' }
];

const STORAGE_KEY = 'ncnu_space_classrooms_v1';

export class DataStore {
  static getClassrooms() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, fallback to memory', e);
    }
    this.saveClassrooms(INITIAL_CLASSROOMS);
    return [...INITIAL_CLASSROOMS];
  }

  static saveClassrooms(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed', e);
    }
  }

  static addClassroom(item) {
    const list = this.getClassrooms();
    const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const newItem = { ...item, id: newId };
    list.push(newItem);
    this.saveClassrooms(list);
    return newItem;
  }

  static updateClassroom(id, updatedFields) {
    const list = this.getClassrooms();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updatedFields, id };
    this.saveClassrooms(list);
    return list[index];
  }

  static deleteClassroom(id) {
    let list = this.getClassrooms();
    list = list.filter(c => c.id !== id);
    this.saveClassrooms(list);
    return true;
  }

  static resetToDefault() {
    this.saveClassrooms(INITIAL_CLASSROOMS);
    return [...INITIAL_CLASSROOMS];
  }
}
