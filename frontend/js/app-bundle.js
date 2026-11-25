/**
 * 國立暨南國際大學 管理學院空間查詢模組
 * 前端整合執行腳本 (自包含獨立運行版，相容 file:// 協議與 http:// 協議)
 * 教室資料來源: https://www.ibs.ncnu.edu.tw/index.php/resources/space-classroom
 */

(function () {
  'use strict';

  // 1. 依據國立暨南國際大學國際企業學系官網之真實教室資料集
  const OFFICIAL_CLASSROOMS = [
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
      map_coord_x: 16.0,
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
      map_coord_x: 26.0,
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
      map_coord_x: 36.0,
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
      map_coord_x: 46.0,
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
      map_coord_x: 56.0,
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
      map_coord_x: 66.0,
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
      map_coord_x: 76.0,
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
      map_coord_y: 38.0,
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
      map_coord_x: 50.0,
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
      map_coord_x: 36.0,
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
      map_coord_x: 50.0,
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
      map_coord_x: 64.0,
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
      map_coord_x: 78.0,
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
      map_coord_x: 35.0,
      map_coord_y: 40.0,
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
      map_coord_x: 65.0,
      map_coord_y: 40.0,
      panorama_url: 'https://pannellum.org/images/cerro-toco-0.jpg',
      description: '教育學院1樓大型國際階梯講堂，容納200人。適合全校性大型講座、學術研討大會。',
      borrow_info: '教育學院支援教室，借用須提早送單申請。',
      facilities: ['高高畫質投影機', '雙電動投影布幕', '專業舞台音響', '冷氣與循環電扇']
    }
  ];

  const FLOORS = [
    { code: 'ALL', name: '全部教室' },
    { code: '1F', name: '管院 1F' },
    { code: '2F', name: '管院 2F' },
    { code: '3F', name: '管院 3F' },
    { code: '4F', name: '管院 4F' },
    { code: '教院', name: '教育學院' }
  ];

  // 2. 資料庫本機儲存控制器
  const DB = {
    key: 'ncnu_official_space_v2',
    getAll: function () {
      try {
        const stored = localStorage.getItem(this.key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('LocalStorage read error, use memory', e);
      }
      this.save(OFFICIAL_CLASSROOMS);
      return [...OFFICIAL_CLASSROOMS];
    },
    save: function (data) {
      try {
        localStorage.setItem(this.key, JSON.stringify(data));
      } catch (e) {}
    },
    add: function (item) {
      const list = this.getAll();
      const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;
      const newItem = { ...item, id: newId };
      list.push(newItem);
      this.save(list);
      return newItem;
    },
    update: function (id, data) {
      const list = this.getAll();
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) return null;
      list[idx] = { ...list[idx], ...data, id: id };
      this.save(list);
      return list[idx];
    },
    delete: function (id) {
      let list = this.getAll();
      list = list.filter(c => c.id !== id);
      this.save(list);
      return true;
    }
  };

  // 3. 內嵌向量平面圖模板 (徹底避免 file:// 協議下 fetch() 的 CORS 阻擋)
  function getFloorSvgTemplate(floorCode) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="100%" height="100%" class="select-none">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
        </defs>
        <!-- 外牆與建築本體 -->
        <rect x="20" y="20" width="960" height="520" rx="16" fill="url(#bgGrad)" stroke="#334155" stroke-width="2" />
        
        <!-- 中央通透中庭 -->
        <rect x="360" y="190" width="280" height="180" rx="10" fill="#0369a1" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4" />
        <text x="500" y="285" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">
          🌿 ${floorCode === '教院' ? '教育學院大樓採光中庭' : '暨大管院大樓中央中庭'}
        </text>

        <!-- 走廊與通道 -->
        <rect x="120" y="150" width="760" height="30" fill="#334155" fill-opacity="0.4" />
        <rect x="120" y="380" width="760" height="30" fill="#334155" fill-opacity="0.4" />
        <rect x="120" y="150" width="30" height="260" fill="#334155" fill-opacity="0.4" />
        <rect x="850" y="150" width="30" height="260" fill="#334155" fill-opacity="0.4" />

        <!-- 樓層示意標記 -->
        <rect x="50" y="50" width="140" height="40" rx="8" fill="#1e293b" stroke="#475569" />
        <text x="120" y="75" fill="#f8fafc" font-size="14" font-weight="bold" text-anchor="middle">
          📍 ${floorCode === 'ALL' ? '全棟樓層導覽' : floorCode + ' 平面圖'}
        </text>

        <!-- 出入口與安全梯 -->
        <text x="135" y="440" fill="#ef4444" font-size="12" font-weight="bold">🛗 西側梯/電梯</text>
        <text x="760" y="440" fill="#ef4444" font-size="12" font-weight="bold">🛗 東側梯/電梯</text>
        <text x="500" y="475" fill="#22c55e" font-size="13" font-weight="bold" text-anchor="middle">🚪 空間通道主出入口</text>
      </svg>
    `;
  }

  // 4. 主應用類別
  class SpaceApp {
    constructor() {
      this.currentFloor = 'ALL';
      this.selectedClassroom = null;
      this.filterType = '';
      this.filterKeyword = '';
      this.filterCapacity = 0;
      this.isAdmin = !!localStorage.getItem('ncnu_admin_logged_in');
      this.editingId = null;
      this.isPickingCoord = false;
      this.pannellumViewer = null;

      this.init();
    }

    init() {
      this.bindDOMEvents();
      this.renderFloorTabs();
      this.renderClassroomList();
      this.renderFloorMap();
      this.updateAdminState();

      // 剛進去時，立即預設選取第一個教室並加載全景與詳細資訊
      const list = this.getFilteredClassrooms();
      if (list.length > 0) {
        this.selectClassroom(list[0], false);
      }
    }

    bindDOMEvents() {
      // 搜尋與篩選
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.filterKeyword = e.target.value.trim().toLowerCase();
          this.renderClassroomList();
        });
      }

      const typeFilter = document.getElementById('filter-room-type');
      if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
          this.filterType = e.target.value;
          this.renderClassroomList();
        });
      }

      const slider = document.getElementById('filter-capacity-slider');
      const sliderVal = document.getElementById('filter-capacity-val');
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.filterCapacity = parseInt(e.target.value, 10);
          if (sliderVal) {
            sliderVal.textContent = this.filterCapacity === 0 ? '不限' : `${this.filterCapacity} 人以上`;
          }
          this.renderClassroomList();
        });
      }

      // 360 控制按鈕
      const btnRotate = document.getElementById('btn-autorotate');
      if (btnRotate) {
        btnRotate.addEventListener('click', () => {
          if (!this.pannellumViewer) return;
          if (this.isRotating) {
            this.pannellumViewer.stopAutoRotate();
            this.isRotating = false;
            btnRotate.innerHTML = '<i class="fas fa-play mr-1"></i>自動旋轉';
          } else {
            this.pannellumViewer.startAutoRotate(-2);
            this.isRotating = true;
            btnRotate.innerHTML = '<i class="fas fa-pause mr-1"></i>暫停旋轉';
          }
        });
      }

      const btnReset = document.getElementById('btn-reset-view');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (this.pannellumViewer) {
            this.pannellumViewer.setYaw(0);
            this.pannellumViewer.setPitch(0);
            this.pannellumViewer.setHfov(100);
          }
        });
      }

      const btnFull = document.getElementById('btn-fullscreen');
      if (btnFull) {
        btnFull.addEventListener('click', () => {
          if (this.pannellumViewer) {
            this.pannellumViewer.toggleFullscreen();
          }
        });
      }

      // 管理員登入按鈕
      const btnAdminAuth = document.getElementById('btn-admin-auth');
      const loginModal = document.getElementById('admin-login-modal');
      const btnCloseLogin = document.getElementById('btn-close-login');
      const loginForm = document.getElementById('admin-login-form');

      if (btnAdminAuth) {
        btnAdminAuth.onclick = () => {
          if (this.isAdmin) {
            if (confirm('確定要登出管理員身份嗎？')) {
              this.isAdmin = false;
              localStorage.removeItem('ncnu_admin_logged_in');
              this.updateAdminState();
              this.renderClassroomList();
            }
          } else {
            if (loginModal) loginModal.classList.remove('hidden');
          }
        };
      }

      if (btnCloseLogin && loginModal) {
        btnCloseLogin.onclick = () => loginModal.classList.add('hidden');
      }

      if (loginForm) {
        loginForm.onsubmit = (e) => {
          e.preventDefault();
          const u = document.getElementById('login-username').value.trim();
          const p = document.getElementById('login-password').value.trim();

          if (u === 'admin' && (p === 'admin123' || p === 'admin')) {
            this.isAdmin = true;
            localStorage.setItem('ncnu_admin_logged_in', 'true');
            if (loginModal) loginModal.classList.add('hidden');
            this.updateAdminState();
            this.renderClassroomList();
            alert('管理員登入成功！您現在可以新增、修改、刪除教室資料。');
          } else {
            alert('帳號或密碼錯誤 (預設帳號: admin, 密碼: admin123)');
          }
        };
      }

      // 新增教室按鈕
      const btnAddClassroom = document.getElementById('btn-add-classroom');
      if (btnAddClassroom) {
        btnAddClassroom.onclick = () => this.openEditModal(null);
      }

      // 編輯/新增 Modal 關閉
      const btnCloseEdit = document.getElementById('btn-close-edit');
      const editModal = document.getElementById('classroom-edit-modal');
      if (btnCloseEdit && editModal) {
        btnCloseEdit.onclick = () => {
          editModal.classList.add('hidden');
          this.setPickingMode(false);
        };
      }

      // 編輯 Form 提交
      const form = document.getElementById('classroom-form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const payload = {
            room_code: document.getElementById('form-room-code').value.trim(),
            name: document.getElementById('form-name').value.trim(),
            floor_code: document.getElementById('form-floor').value,
            room_type: document.getElementById('form-type').value,
            capacity: parseInt(document.getElementById('form-capacity').value, 10) || 50,
            map_coord_x: parseFloat(document.getElementById('form-coord-x').value) || 50.0,
            map_coord_y: parseFloat(document.getElementById('form-coord-y').value) || 35.0,
            panorama_url: document.getElementById('form-panorama').value.trim() || 'https://pannellum.org/images/cerro-toco-0.jpg',
            facilities: document.getElementById('form-facilities').value.split(',').map(s => s.trim()).filter(Boolean),
            description: document.getElementById('form-description').value,
            borrow_info: document.getElementById('form-borrow').value
          };

          if (this.editingId) {
            DB.update(this.editingId, payload);
          } else {
            DB.add(payload);
          }

          if (editModal) editModal.classList.add('hidden');
          this.setPickingMode(false);
          this.renderClassroomList();
          this.renderFloorMap();
          alert('教室資料儲存成功！');
        };
      }

      // 拾取座標按鈕
      const btnPickCoord = document.getElementById('btn-pick-coord');
      if (btnPickCoord) {
        btnPickCoord.onclick = () => {
          this.setPickingMode(true);
          alert('【座標拾取模式已啟動】請直接在右側平面圖上點選教室位置，系統將自動捕獲 (X, Y) 百分比！');
        };
      }
    }

    setPickingMode(enabled) {
      this.isPickingCoord = enabled;
      const mapWrapper = document.getElementById('floor-map-container');
      if (mapWrapper) {
        if (enabled) {
          mapWrapper.classList.add('ring-4', 'ring-emerald-500', 'cursor-crosshair');
        } else {
          mapWrapper.classList.remove('ring-4', 'ring-emerald-500', 'cursor-crosshair');
        }
      }
    }

    updateAdminState() {
      const btn = document.getElementById('btn-admin-auth');
      const bar = document.getElementById('admin-actions-bar');

      if (this.isAdmin) {
        if (btn) {
          btn.innerHTML = '<i class="fas fa-user-shield text-emerald-400"></i> <span class="hidden sm:inline">管理員已登入 (登出)</span>';
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm';
        }
        if (bar) bar.classList.remove('hidden');
      } else {
        if (btn) {
          btn.innerHTML = '<i class="fas fa-lock"></i> <span class="hidden sm:inline">管理員登入</span>';
          btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm';
        }
        if (bar) bar.classList.add('hidden');
      }
    }

    renderFloorTabs() {
      const container = document.getElementById('floor-tabs');
      if (!container) return;

      container.innerHTML = FLOORS.map(f => `
        <button data-floor="${f.code}" class="floor-tab-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          f.code === this.currentFloor 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }">
          ${f.name}
        </button>
      `).join('');

      container.querySelectorAll('.floor-tab-btn').forEach(btn => {
        btn.onclick = () => {
          this.currentFloor = btn.dataset.floor;
          this.renderFloorTabs();
          this.renderClassroomList();
          this.renderFloorMap();
        };
      });
    }

    getFilteredClassrooms() {
      const all = DB.getAll();
      return all.filter(c => {
        if (this.currentFloor !== 'ALL' && c.floor_code !== this.currentFloor) return false;
        if (this.filterType && c.room_type !== this.filterType) return false;
        if (this.filterCapacity > 0 && c.capacity < this.filterCapacity) return false;
        if (this.filterKeyword) {
          const text = `${c.room_code} ${c.name} ${c.description || ''}`.toLowerCase();
          if (!text.includes(this.filterKeyword)) return false;
        }
        return true;
      });
    }

    renderClassroomList() {
      const container = document.getElementById('classroom-list-container');
      const badge = document.getElementById('classroom-count-badge');
      if (!container) return;

      const list = this.getFilteredClassrooms();
      if (badge) badge.textContent = `${list.length} 間教室`;

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <i class="fas fa-search text-3xl mb-3 text-slate-600"></i>
            <p class="text-sm font-medium">查無相符之教室空間</p>
            <p class="text-xs text-slate-500 mt-1">請嘗試調整容納人數滑桿或切換至其他樓層</p>
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(c => {
        const isSelected = this.selectedClassroom && this.selectedClassroom.id === c.id;

        return `
          <div data-id="${c.id}" class="classroom-card p-3.5 rounded-xl cursor-pointer transition-all border ${
            isSelected 
              ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30' 
              : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
          }">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-white text-base">${c.room_code}</span>
                  <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ${c.name}
                  </span>
                  <span class="text-xs text-slate-400">
                    <i class="fas fa-layer-group text-slate-500 text-[10px] mr-0.5"></i>${c.floor_code}
                  </span>
                </div>
                <div class="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                  <span class="text-sky-300 font-bold"><i class="fas fa-users mr-1"></i>容納 ${c.capacity} 人</span>
                  <span class="text-slate-400">${c.room_type}</span>
                </div>
              </div>

              ${this.isAdmin ? `
                <div class="flex items-center gap-1">
                  <button class="btn-edit-room p-1.5 text-xs text-slate-400 hover:text-amber-300 transition" title="修改教室">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-delete-room p-1.5 text-xs text-slate-400 hover:text-red-400 transition" title="刪除教室">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              ` : ''}
            </div>

            <div class="mt-2.5 flex flex-wrap gap-1.5">
              ${(c.facilities || []).slice(0, 3).map(f => `
                <span class="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700/60">
                  ${f}
                </span>
              `).join('')}
              ${(c.facilities || []).length > 3 ? `<span class="text-[10px] text-slate-400 self-center">+${c.facilities.length - 3}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');

      // 綁定卡片點擊
      container.querySelectorAll('.classroom-card').forEach(card => {
        card.onclick = (e) => {
          const id = parseInt(card.dataset.id, 10);
          const classroom = DB.getAll().find(item => item.id === id);
          if (!classroom) return;

          if (e.target.closest('.btn-edit-room')) {
            e.stopPropagation();
            this.openEditModal(classroom);
            return;
          }
          if (e.target.closest('.btn-delete-room')) {
            e.stopPropagation();
            if (confirm(`確定要刪除教室【${classroom.room_code}】嗎？`)) {
              DB.delete(classroom.id);
              this.renderClassroomList();
              this.renderFloorMap();
            }
            return;
          }

          this.selectClassroom(classroom, true);
        };
      });
    }

    renderFloorMap() {
      const container = document.getElementById('floor-map-container');
      if (!container) return;

      const currentClassrooms = this.getFilteredClassrooms();
      const svgMarkup = getFloorSvgTemplate(this.currentFloor);

      container.innerHTML = `
        <div class="relative w-full min-h-[380px] flex items-center justify-center overflow-hidden">
          <div class="w-full h-full select-none">
            ${svgMarkup}
          </div>
          <div id="pins-layer" class="absolute inset-0 pointer-events-none"></div>
        </div>
      `;

      // 座標點擊監聽 (管理員拾取模式)
      container.onclick = (e) => {
        if (!this.isPickingCoord) return;

        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const pctX = ((clickX / rect.width) * 100).toFixed(1);
        const pctY = ((clickY / rect.height) * 100).toFixed(1);

        document.getElementById('form-coord-x').value = pctX;
        document.getElementById('form-coord-y').value = pctY;
        this.setPickingMode(false);
        alert(`已成功設定平面圖標註座標: X=${pctX}%, Y=${pctY}%`);
      };

      // 繪製 Pins
      const pinsLayer = container.querySelector('#pins-layer');
      if (!pinsLayer) return;

      currentClassrooms.forEach(c => {
        const isSelected = this.selectedClassroom && this.selectedClassroom.id === c.id;

        const pin = document.createElement('div');
        pin.className = 'absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 group';
        pin.style.left = `${c.map_coord_x}%`;
        pin.style.top = `${c.map_coord_y}%`;

        pin.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${isSelected ? '<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>' : ''}
            
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 font-bold text-xs transition-transform transform group-hover:scale-125 ${
              isSelected 
                ? 'bg-blue-600 text-white border-white scale-125 ring-4 ring-blue-300' 
                : 'bg-white text-slate-800 border-blue-500 hover:bg-blue-50'
            }">
              <i class="fas fa-map-marker-alt"></i>
            </div>

            <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
              <div class="bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 whitespace-nowrap shadow-xl border border-slate-700">
                <span class="font-bold text-sky-400">${c.room_code}</span> · ${c.name}
                <div class="text-[10px] text-slate-300 font-normal">容納 ${c.capacity} 人 | 點擊切換全景</div>
              </div>
              <div class="w-2 h-2 bg-slate-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        `;

        pin.onclick = (e) => {
          e.stopPropagation();
          this.selectClassroom(c, false);
        };

        pinsLayer.appendChild(pin);
      });
    }

    selectClassroom(classroom, updateMap = true) {
      this.selectedClassroom = classroom;

      // 1. 高亮左側卡片
      this.renderClassroomList();

      // 2. 重新繪製平面圖 Pin 標記選取態
      if (updateMap) {
        this.renderFloorMap();
      }

      // 3. 載入 360 度全景相片
      this.loadPanorama(classroom.panorama_url);

      // 4. 渲染空間詳細資訊卡
      this.renderDetailCard(classroom);
    }

    loadPanorama(url) {
      const container = document.getElementById('panorama-viewer-container');
      if (!container) return;

      try {
        if (this.pannellumViewer) {
          this.pannellumViewer.destroy();
          this.pannellumViewer = null;
        }
      } catch (e) {}

      container.innerHTML = '';

      if (typeof window.pannellum !== 'undefined') {
        try {
          this.pannellumViewer = window.pannellum.viewer('panorama-viewer-container', {
            type: 'equirectangular',
            panorama: url || 'https://pannellum.org/images/alma.jpg',
            autoLoad: true,
            autoRotate: -2,
            compass: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
            strings: {
              loadingLabel: '正在載入教室 360° 全景環境...',
              loadButtonLabel: '點擊載入全景'
            }
          });
          this.isRotating = true;
          const btn = document.getElementById('btn-autorotate');
          if (btn) btn.innerHTML = '<i class="fas fa-pause mr-1"></i>暫停旋轉';
        } catch (err) {
          console.error('Pannellum init error', err);
          container.innerHTML = `<div class="p-6 text-center text-red-400">全景圖片載入失敗: ${err.message}</div>`;
        }
      } else {
        container.innerHTML = `
          <div class="flex items-center justify-center h-full bg-slate-900 text-slate-400 text-sm">
            <span>正在載入 360° WebGL 環景組件...</span>
          </div>
        `;
      }
    }

    renderDetailCard(c) {
      const pane = document.getElementById('classroom-detail-pane');
      if (!pane) return;

      pane.innerHTML = `
        <div class="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
                <span class="text-sky-400">${c.room_code}</span> <span>${c.name}</span>
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                國立暨南國際大學 · ${c.floor_code} · ${c.room_type}
              </p>
            </div>
            <div class="text-right bg-blue-950/60 border border-blue-500/30 px-3.5 py-1.5 rounded-xl">
              <div class="text-2xl font-black text-blue-400 leading-none">${c.capacity}</div>
              <div class="text-[10px] text-blue-300 font-semibold uppercase tracking-wider mt-0.5">容納人數</div>
            </div>
          </div>

          <div class="py-3">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">空間格局與教學特色</h4>
            <p class="text-sm text-slate-200 leading-relaxed font-normal">
              ${c.description || '提供教學與學術研討之標準空間。'}
            </p>
          </div>

          <div class="py-3 border-t border-slate-800/80">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">配備主要設施與教學輔助</h4>
            <div class="flex flex-wrap gap-2">
              ${(c.facilities || []).map(f => `
                <span class="inline-flex items-center gap-1.5 text-xs bg-slate-800/80 text-sky-200 px-3 py-1.5 rounded-lg border border-slate-700">
                  <i class="fas fa-check-circle text-sky-400 text-[10px]"></i> ${f}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-amber-200/90 bg-amber-950/30 p-3 rounded-xl border border-amber-500/20">
            <i class="fas fa-info-circle text-amber-400 text-sm mt-0.5"></i>
            <div>
              <span class="font-bold text-amber-300">借用注意事項與規範：</span>
              ${c.borrow_info || '依管理學院相關借用辦法辦理。'}
            </div>
          </div>
        </div>
      `;
    }

    openEditModal(classroom = null) {
      const modal = document.getElementById('classroom-edit-modal');
      const title = document.getElementById('modal-edit-title');
      if (!modal) return;

      if (classroom) {
        this.editingId = classroom.id;
        if (title) title.textContent = `修改教室資料 - ${classroom.room_code}`;
        document.getElementById('form-room-code').value = classroom.room_code;
        document.getElementById('form-name').value = classroom.name;
        document.getElementById('form-floor').value = classroom.floor_code;
        document.getElementById('form-type').value = classroom.room_type;
        document.getElementById('form-capacity').value = classroom.capacity;
        document.getElementById('form-coord-x').value = classroom.map_coord_x;
        document.getElementById('form-coord-y').value = classroom.map_coord_y;
        document.getElementById('form-panorama').value = classroom.panorama_url;
        document.getElementById('form-facilities').value = (classroom.facilities || []).join(', ');
        document.getElementById('form-description').value = classroom.description || '';
        document.getElementById('form-borrow').value = classroom.borrow_info || '';
      } else {
        this.editingId = null;
        if (title) title.textContent = '新增管院教室空間';
        document.getElementById('classroom-form').reset();
        document.getElementById('form-floor').value = this.currentFloor === 'ALL' ? '1F' : this.currentFloor;
        document.getElementById('form-coord-x').value = 50.0;
        document.getElementById('form-coord-y').value = 35.0;
        document.getElementById('form-panorama').value = 'https://pannellum.org/images/alma.jpg';
      }

      modal.classList.remove('hidden');
    }
  }

  // 頁面載入後自動啟動
  window.addEventListener('DOMContentLoaded', () => {
    window.ncnuSpaceApp = new SpaceApp();
  });
})();
