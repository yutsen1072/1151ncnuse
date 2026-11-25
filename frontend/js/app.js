/**
 * 前端核心應用控制器 (App Main Entry)
 */
import { DataStore, FLOORS_CONFIG } from './mock-data.js';
import { PanoramaController } from './pannellum-viewer.js';
import { FloorMapController } from './floor-map.js';
import { AdminController } from './admin.js';

class App {
  constructor() {
    this.currentFloor = '1F';
    this.selectedClassroom = null;
    this.filterType = '';
    this.filterKeyword = '';
    this.filterCapacity = 0;
    this.editingClassroomId = null;

    // 初始化各子模組
    this.panorama = new PanoramaController('panorama-viewer-container');
    
    this.floorMap = new FloorMapController('floor-map-container', {
      onSelectClassroom: (classroom) => this.selectClassroom(classroom, false),
      onCoordinatePicked: (x, y) => this.handleCoordinatePicked(x, y)
    });

    this.admin = new AdminController(DataStore, {
      onDataChanged: () => this.refreshData(),
      onCoordinatePickRequest: () => this.toggleCoordinatePickMode()
    });

    this.initDOM();
    this.refreshData();
  }

  initDOM() {
    // 樓層標籤按鈕點擊
    const floorTabsContainer = document.getElementById('floor-tabs');
    if (floorTabsContainer) {
      floorTabsContainer.innerHTML = FLOORS_CONFIG.map(f => `
        <button data-floor="${f.code}" class="floor-tab-btn px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
          f.code === this.currentFloor 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }">
          ${f.code}
        </button>
      `).join('');

      floorTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.floor-tab-btn');
        if (!btn) return;
        const floor = btn.dataset.floor;
        this.switchFloor(floor);
      });
    }

    // 搜尋與篩選事件
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

    const capacitySlider = document.getElementById('filter-capacity-slider');
    const capacityVal = document.getElementById('filter-capacity-val');
    if (capacitySlider) {
      capacitySlider.addEventListener('input', (e) => {
        this.filterCapacity = parseInt(e.target.value, 10);
        if (capacityVal) capacityVal.textContent = `${this.filterCapacity} 人以上`;
        this.renderClassroomList();
      });
    }

    // Pannellum 控制按鈕
    const btnAutoRotate = document.getElementById('btn-autorotate');
    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', () => {
        const isRotating = this.panorama.toggleAutoRotate();
        btnAutoRotate.innerHTML = isRotating 
          ? '<i class="fas fa-pause mr-1"></i>暫停旋轉' 
          : '<i class="fas fa-play mr-1"></i>自動旋轉';
      });
    }

    const btnResetView = document.getElementById('btn-reset-view');
    if (btnResetView) {
      btnResetView.addEventListener('click', () => this.panorama.resetView());
    }

    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.panorama.toggleFullscreen());
    }

    // 管理員登入按鈕與彈窗
    const btnAdminAuth = document.getElementById('btn-admin-auth');
    const loginModal = document.getElementById('admin-login-modal');
    const loginForm = document.getElementById('admin-login-form');
    const btnCloseLogin = document.getElementById('btn-close-login');

    if (btnAdminAuth) {
      btnAdminAuth.addEventListener('click', () => {
        if (this.admin.isLoggedIn()) {
          if (confirm('確定要登出管理員身分嗎？')) {
            this.admin.logout();
          }
        } else {
          loginModal.classList.remove('hidden');
        }
      });
    }

    if (btnCloseLogin) {
      btnCloseLogin.addEventListener('click', () => loginModal.classList.add('hidden'));
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;
        const res = this.admin.login(u, p);
        if (res.success) {
          loginModal.classList.add('hidden');
          this.refreshData();
        } else {
          alert(res.message);
        }
      });
    }

    // 新增教室按鈕
    const btnAddClassroom = document.getElementById('btn-add-classroom');
    const editModal = document.getElementById('classroom-edit-modal');
    const editForm = document.getElementById('classroom-form');
    const btnCloseEdit = document.getElementById('btn-close-edit');

    if (btnAddClassroom) {
      btnAddClassroom.addEventListener('click', () => {
        this.openClassroomModal(null);
      });
    }

    if (btnCloseEdit) {
      btnCloseEdit.addEventListener('click', () => {
        editModal.classList.add('hidden');
        this.floorMap.setCoordinatePickingMode(false);
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          room_code: document.getElementById('form-room-code').value,
          name: document.getElementById('form-name').value,
          floor_code: document.getElementById('form-floor').value,
          room_type: document.getElementById('form-type').value,
          capacity: document.getElementById('form-capacity').value,
          map_coord_x: document.getElementById('form-coord-x').value,
          map_coord_y: document.getElementById('form-coord-y').value,
          panorama_url: document.getElementById('form-panorama').value,
          facilities: document.getElementById('form-facilities').value,
          description: document.getElementById('form-description').value,
          borrow_info: document.getElementById('form-borrow').value
        };

        this.admin.handleClassroomSubmit(formData, this.editingClassroomId);
        editModal.classList.add('hidden');
        this.floorMap.setCoordinatePickingMode(false);
      });
    }

    // 拾取座標按鈕
    const btnPickCoord = document.getElementById('btn-pick-coord');
    if (btnPickCoord) {
      btnPickCoord.addEventListener('click', () => {
        this.floorMap.setCoordinatePickingMode(true);
        alert('請直接在右側平面圖上點選教室位置，系統將自動捕獲百分比座標！');
      });
    }
  }

  handleCoordinatePicked(x, y) {
    const inputX = document.getElementById('form-coord-x');
    const inputY = document.getElementById('form-coord-y');
    if (inputX && inputY) {
      inputX.value = x;
      inputY.value = y;
      alert(`已成功取得平面圖標註點：X=${x}%, Y=${y}%`);
      this.floorMap.setCoordinatePickingMode(false);
    }
  }

  openClassroomModal(classroom = null) {
    const modal = document.getElementById('classroom-edit-modal');
    const title = document.getElementById('modal-edit-title');
    if (!modal) return;

    if (classroom) {
      this.editingClassroomId = classroom.id;
      title.textContent = `修改教室資料 - ${classroom.room_code}`;
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
      this.editingClassroomId = null;
      title.textContent = '新增管院教室空間';
      document.getElementById('classroom-form').reset();
      document.getElementById('form-floor').value = this.currentFloor;
      document.getElementById('form-coord-x').value = 50.0;
      document.getElementById('form-coord-y').value = 35.0;
      document.getElementById('form-panorama').value = 'https://pannellum.org/images/alma.jpg';
    }

    modal.classList.remove('hidden');
  }

  switchFloor(floorCode) {
    this.currentFloor = floorCode;

    // 更新樓層按鈕外觀
    document.querySelectorAll('.floor-tab-btn').forEach(btn => {
      if (btn.dataset.floor === floorCode) {
        btn.className = 'floor-tab-btn px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-blue-600 text-white shadow-md';
      } else {
        btn.className = 'floor-tab-btn px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-slate-800 text-slate-300 hover:bg-slate-700';
      }
    });

    this.refreshFloorAndClassrooms();
  }

  refreshData() {
    this.refreshFloorAndClassrooms();
  }

  refreshFloorAndClassrooms() {
    const all = DataStore.getClassrooms();
    const floorClassrooms = all.filter(c => c.floor_code === this.currentFloor);

    // 載入該樓層平面圖與 Pins
    this.floorMap.loadFloor(this.currentFloor, floorClassrooms);

    // 渲染教室列表
    this.renderClassroomList();

    // 若尚未選取或目前選取不在該樓層，則預設選中該樓層第一個
    if (!this.selectedClassroom || this.selectedClassroom.floor_code !== this.currentFloor) {
      if (floorClassrooms.length > 0) {
        this.selectClassroom(floorClassrooms[0], false);
      }
    }
  }

  getFilteredClassrooms() {
    const all = DataStore.getClassrooms();
    return all.filter(c => {
      // 樓層過濾
      if (c.floor_code !== this.currentFloor) return false;
      // 空間類型過濾
      if (this.filterType && c.room_type !== this.filterType) return false;
      // 容納人數過濾
      if (this.filterCapacity > 0 && c.capacity < this.filterCapacity) return false;
      // 關鍵字搜尋
      if (this.filterKeyword) {
        const text = `${c.room_code} ${c.name} ${c.description || ''}`.toLowerCase();
        if (!text.includes(this.filterKeyword)) return false;
      }
      return true;
    });
  }

  renderClassroomList() {
    const listContainer = document.getElementById('classroom-list-container');
    const counterBadge = document.getElementById('classroom-count-badge');
    if (!listContainer) return;

    const list = this.getFilteredClassrooms();
    if (counterBadge) counterBadge.textContent = `${list.length} 間教室`;

    if (list.length === 0) {
      listContainer.innerHTML = `
        <div class="p-6 text-center text-slate-400 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <i class="fas fa-search text-2xl mb-2 text-slate-500"></i>
          <p class="text-sm">此樓層或篩選條件下無相符教室</p>
        </div>
      `;
      return;
    }

    const isAdmin = this.admin.isLoggedIn();

    listContainer.innerHTML = list.map(c => {
      const isSelected = this.selectedClassroom && this.selectedClassroom.id === c.id;

      return `
        <div data-id="${c.id}" class="classroom-card p-4 rounded-xl cursor-pointer transition-all border ${
          isSelected 
            ? 'bg-blue-900/40 border-blue-500 ring-2 ring-blue-500/30' 
            : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/60 hover:border-slate-600'
        }">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white text-base">${c.room_code}</span>
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ${c.room_type}
                </span>
                <span class="text-xs text-slate-400">
                  <i class="fas fa-users mr-1"></i>${c.capacity}人
                </span>
              </div>
              <p class="text-sm text-slate-300 font-medium mt-1">${c.name}</p>
            </div>
            
            ${isAdmin ? `
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
              <span class="text-[11px] px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                ${f}
              </span>
            `).join('')}
            ${(c.facilities || []).length > 3 ? `<span class="text-[11px] text-slate-400 self-center">+${c.facilities.length - 3}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // 綁定點選卡片事件
    listContainer.querySelectorAll('.classroom-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = parseInt(card.dataset.id, 10);
        const classroom = DataStore.getClassrooms().find(c => c.id === id);
        if (!classroom) return;

        // 若點擊編輯
        if (e.target.closest('.btn-edit-room')) {
          e.stopPropagation();
          this.openClassroomModal(classroom);
          return;
        }
        // 若點擊刪除
        if (e.target.closest('.btn-delete-room')) {
          e.stopPropagation();
          this.admin.deleteClassroom(classroom.id);
          return;
        }

        this.selectClassroom(classroom, true);
      });
    });
  }

  selectClassroom(classroom, updateMapPin = true) {
    this.selectedClassroom = classroom;

    // 1. 更新卡片選取外觀
    this.renderClassroomList();

    // 2. 聯動更新平面圖標註高亮
    if (updateMapPin) {
      this.floorMap.selectClassroom(classroom.id);
    }

    // 3. 載入 360 度全景影像
    this.panorama.loadPanorama(classroom.panorama_url, {
      yaw: classroom.default_yaw || 0,
      pitch: classroom.default_pitch || 0,
      hfov: classroom.default_hfov || 100
    });

    // 4. 更新詳細資訊卡
    this.renderClassroomDetail(classroom);
  }

  renderClassroomDetail(classroom) {
    const detailContainer = document.getElementById('classroom-detail-pane');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
      <div class="bg-slate-900/80 rounded-xl p-5 border border-slate-700/80 shadow-lg backdrop-blur">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="text-sky-400">${classroom.room_code}</span> ${classroom.name}
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              國立暨南國際大學 管理學院 · ${classroom.floor_code} · ${classroom.room_type}
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-extrabold text-blue-400 leading-none">${classroom.capacity}</div>
            <div class="text-[10px] text-slate-400 uppercase tracking-wider">容納人數</div>
          </div>
        </div>

        <!-- 空間特色描述 -->
        <div class="py-3">
          <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">空間特色與格局</h4>
          <p class="text-sm text-slate-300 leading-relaxed">
            ${classroom.description || '標準教學研究空間，採光明亮。'}
          </p>
        </div>

        <!-- 配備設施 -->
        <div class="py-3 border-t border-slate-800">
          <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">配備主要設施與教學輔助</h4>
          <div class="flex flex-wrap gap-2">
            ${(classroom.facilities || []).map(f => `
              <span class="inline-flex items-center gap-1.5 text-xs bg-slate-800 text-sky-200 px-3 py-1.5 rounded-lg border border-slate-700">
                <i class="fas fa-check-circle text-sky-400 text-[10px]"></i> ${f}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 借用須知與規範 -->
        <div class="pt-3 border-t border-slate-800 flex items-start gap-2 text-xs text-amber-200/90 bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
          <i class="fas fa-info-circle text-amber-400 mt-0.5"></i>
          <div>
            <span class="font-semibold text-amber-300">借用注意事項：</span>
            ${classroom.borrow_info || '課程教學優先。若需借用請至管理學院辦公室洽詢。'}
          </div>
        </div>
      </div>
    `;
  }
}

// 啟動主應用
window.addEventListener('DOMContentLoaded', () => {
  window.ncnuApp = new App();
});
