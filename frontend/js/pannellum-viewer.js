/**
 * Pannellum 360 度全景檢視模組 (Pannellum Panorama Viewer Controller)
 * 封裝 Pannellum WebGL 引擎與互動控制
 */

export class PanoramaController {
  constructor(containerId) {
    this.containerId = containerId;
    this.viewer = null;
    this.currentPanoramaUrl = null;
    this.isAutoRotating = true;
  }

  /**
   * 載入特定教室之 360 度全景照片
   */
  loadPanorama(panoramaUrl, options = {}) {
    if (!panoramaUrl) return;

    const defaultOptions = {
      type: 'equirectangular',
      panorama: panoramaUrl,
      autoLoad: true,
      autoRotate: -2,
      compass: true,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      yaw: options.yaw || 0,
      pitch: options.pitch || 0,
      hfov: options.hfov || 100,
      strings: {
        loadingLabel: '正在載入教室 360° 全景環境...',
        loadButtonLabel: '點擊載入全景'
      }
    };

    const container = document.getElementById(this.containerId);
    if (!container) return;

    // 清空舊實例或重新掛載
    try {
      if (this.viewer) {
        this.viewer.destroy();
        this.viewer = null;
      }
    } catch (e) {
      console.warn('Destroy previous pannellum viewer', e);
    }

    container.innerHTML = '';

    // 檢查 window.pannellum 是否已由 CDN 載入
    if (typeof window.pannellum !== 'undefined') {
      try {
        this.viewer = window.pannellum.viewer(this.containerId, defaultOptions);
        this.currentPanoramaUrl = panoramaUrl;
        this.isAutoRotating = true;
      } catch (err) {
        console.error('Pannellum init error', err);
        container.innerHTML = `<div class="p-6 text-center text-red-500">全景影像載入失敗: ${err.message}</div>`;
      }
    } else {
      container.innerHTML = `
        <div class="flex items-center justify-center h-full bg-slate-900 text-slate-300">
          <p>⚠️ 正在下載 360° 全景渲染庫，請稍候...</p>
        </div>
      `;
    }
  }

  /**
   * 切換自動環景旋轉
   */
  toggleAutoRotate() {
    if (!this.viewer) return;
    if (this.isAutoRotating) {
      this.viewer.stopAutoRotate();
      this.isAutoRotating = false;
    } else {
      this.viewer.startAutoRotate(-2);
      this.isAutoRotating = true;
    }
    return this.isAutoRotating;
  }

  /**
   * 重設視野與視角中心
   */
  resetView() {
    if (!this.viewer) return;
    this.viewer.setYaw(0);
    this.viewer.setPitch(0);
    this.viewer.setHfov(100);
  }

  /**
   * 進入全螢幕
   */
  toggleFullscreen() {
    if (!this.viewer) return;
    this.viewer.toggleFullscreen();
  }
}
