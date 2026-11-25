/**
 * 互動式管院平面圖引擎 (Interactive Floor Plan Engine)
 * 負責渲染 SVG 地圖、繪製教室動態標記 (Pins/Hotspots) 與雙向聯動
 */

export class FloorMapController {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.currentFloor = '1F';
    this.classrooms = [];
    this.selectedClassroomId = null;
    this.isCoordinatePickingMode = false;
    this.onSelectClassroom = options.onSelectClassroom || (() => {});
    this.onCoordinatePicked = options.onCoordinatePicked || (() => {});

    this.initEventListeners();
  }

  initEventListeners() {
    if (!this.container) return;

    // 點擊平面圖捕獲百分比座標 (供管理員設定教室位置)
    this.container.addEventListener('click', (e) => {
      if (!this.isCoordinatePickingMode) return;

      const rect = this.container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const pctX = ((clickX / rect.width) * 100).toFixed(1);
      const pctY = ((clickY / rect.height) * 100).toFixed(1);

      this.onCoordinatePicked(parseFloat(pctX), parseFloat(pctY));
    });
  }

  setCoordinatePickingMode(enabled) {
    this.isCoordinatePickingMode = enabled;
    if (enabled) {
      this.container.classList.add('cursor-crosshair');
    } else {
      this.container.classList.remove('cursor-crosshair');
    }
  }

  /**
   * 切換樓層並重新渲染平面圖與教室標記
   */
  async loadFloor(floorCode, classroomsForFloor) {
    this.currentFloor = floorCode;
    this.classrooms = classroomsForFloor;

    const svgUrl = `../assets/maps/floor-${floorCode.toLowerCase()}.svg`;

    try {
      const response = await fetch(svgUrl);
      if (!response.ok) throw new Error('SVG not found');
      const svgText = await response.text();
      
      this.renderMap(svgText);
    } catch (err) {
      console.warn('Load SVG failed, fallback to inline schematic view', err);
      this.renderFallbackSchematic();
    }
  }

  renderMap(svgText) {
    this.container.innerHTML = `
      <div class="relative w-full h-full min-h-[420px] select-none flex items-center justify-center overflow-hidden">
        <div class="floor-svg-wrapper w-full h-full">
          ${svgText}
        </div>
        <div id="map-pins-layer" class="absolute inset-0 pointer-events-none"></div>
      </div>
    `;

    this.renderClassroomPins();
  }

  renderFallbackSchematic() {
    this.container.innerHTML = `
      <div class="relative w-full h-full min-h-[420px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-8 flex flex-col justify-between select-none">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">管院大樓 ${this.currentFloor} 核心平面模擬圖</div>
        <div class="grid grid-cols-3 gap-4 h-64 my-4 opacity-75">
          <div class="border-2 border-slate-400 bg-white rounded p-3 text-center text-xs text-slate-600 font-semibold">西翼講堂空間</div>
          <div class="border-2 border-sky-400 bg-sky-50 rounded p-3 text-center text-xs text-sky-700 font-semibold">中央中庭透光空間</div>
          <div class="border-2 border-slate-400 bg-white rounded p-3 text-center text-xs text-slate-600 font-semibold">東翼研究空間</div>
        </div>
        <div id="map-pins-layer" class="absolute inset-0 pointer-events-none"></div>
      </div>
    `;
    this.renderClassroomPins();
  }

  /**
   * 繪製各教室位置標記 (Pins)
   */
  renderClassroomPins() {
    const pinsLayer = this.container.querySelector('#map-pins-layer');
    if (!pinsLayer) return;

    pinsLayer.innerHTML = '';

    this.classrooms.forEach(c => {
      const isSelected = c.id === this.selectedClassroomId;

      const pin = document.createElement('div');
      pin.className = `absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 group`;
      pin.style.left = `${c.map_coord_x}%`;
      pin.style.top = `${c.map_coord_y}%`;

      pin.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- 脈衝動畫效果 (選中時) -->
          ${isSelected ? '<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>' : ''}
          
          <!-- Pin 本體圖示 -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 font-bold text-xs transition-transform transform group-hover:scale-125 ${
            isSelected 
              ? 'bg-blue-600 text-white border-white scale-125 ring-4 ring-blue-300' 
              : 'bg-white text-slate-700 border-blue-500 hover:bg-blue-50'
          }">
            <i class="fas fa-map-marker-alt"></i>
          </div>

          <!-- 浮動 Tooltip 資訊卡 -->
          <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
            <div class="bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 whitespace-nowrap shadow-xl border border-slate-700">
              <span class="font-bold text-sky-400">${c.room_code}</span> · ${c.name}
              <div class="text-[10px] text-slate-300 font-normal">容納 ${c.capacity} 人 | 點擊切換全景</div>
            </div>
            <div class="w-2 h-2 bg-slate-900 transform rotate-45 -mt-1"></div>
          </div>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectClassroom(c.id);
        this.onSelectClassroom(c);
      });

      pinsLayer.appendChild(pin);
    });
  }

  selectClassroom(classroomId) {
    this.selectedClassroomId = classroomId;
    this.renderClassroomPins();
  }
}
