/**
 * 管理員功能模組 (Admin Management Module)
 * 提供管理員登入認證、教室資料增刪改查 (CRUD) 與座標調整
 */

export class AdminController {
  constructor(dataStore, options = {}) {
    this.dataStore = dataStore;
    this.onDataChanged = options.onDataChanged || (() => {});
    this.onCoordinatePickRequest = options.onCoordinatePickRequest || (() => {});
    this.token = localStorage.getItem('ncnu_admin_token');
    this.isAdmin = !!this.token;

    this.initUI();
  }

  initUI() {
    this.updateAdminBadge();
  }

  isLoggedIn() {
    return this.isAdmin;
  }

  login(username, password) {
    // 預設密碼驗證
    if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
      this.token = 'demo-admin-jwt-token-ncnu';
      localStorage.setItem('ncnu_admin_token', this.token);
      this.isAdmin = true;
      this.updateAdminBadge();
      return { success: true };
    }
    return { success: false, message: '帳號或密碼錯誤 (預設帳號: admin, 密碼: admin123)' };
  }

  logout() {
    this.token = null;
    this.isAdmin = false;
    localStorage.removeItem('ncnu_admin_token');
    this.updateAdminBadge();
    this.onDataChanged();
  }

  updateAdminBadge() {
    const btn = document.getElementById('btn-admin-auth');
    const adminToolbar = document.getElementById('admin-actions-bar');
    if (!btn) return;

    if (this.isAdmin) {
      btn.innerHTML = `<i class="fas fa-user-shield text-emerald-400"></i> <span class="hidden sm:inline">管理員已登入 (登出)</span>`;
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-sm';
      if (adminToolbar) adminToolbar.classList.remove('hidden');
    } else {
      btn.innerHTML = `<i class="fas fa-lock"></i> <span class="hidden sm:inline">管理員登入</span>`;
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm';
      if (adminToolbar) adminToolbar.classList.add('hidden');
    }
  }

  /**
   * 提交新增或修改教室表單
   */
  handleClassroomSubmit(formData, editingId = null) {
    const facilitiesArray = formData.facilities
      ? formData.facilities.split(',').map(s => s.trim()).filter(Boolean)
      : ['高高畫質投影機', '冷氣與循環電扇', '無線高速網路 (Wi-Fi 6)'];

    const classroomPayload = {
      room_code: formData.room_code.trim(),
      name: formData.name.trim(),
      floor_code: formData.floor_code,
      room_type: formData.room_type,
      capacity: parseInt(formData.capacity, 10) || 50,
      map_coord_x: parseFloat(formData.map_coord_x) || 50.0,
      map_coord_y: parseFloat(formData.map_coord_y) || 50.0,
      panorama_url: formData.panorama_url.trim() || 'https://pannellum.org/images/cerro-toco-0.jpg',
      default_yaw: 0,
      default_pitch: 0,
      default_hfov: 100,
      description: formData.description || '',
      borrow_info: formData.borrow_info || '請洽管院辦公室。',
      facilities: facilitiesArray
    };

    if (editingId) {
      this.dataStore.updateClassroom(editingId, classroomPayload);
    } else {
      this.dataStore.addClassroom(classroomPayload);
    }

    this.onDataChanged();
    return { success: true };
  }

  deleteClassroom(id) {
    if (!confirm('確定要永久刪除此教室資料與全景關聯嗎？')) return;
    this.dataStore.deleteClassroom(id);
    this.onDataChanged();
  }
}
