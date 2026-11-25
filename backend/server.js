/**
 * 國立暨南國際大學 管理學院空間查詢模組
 * 後端核心伺服器 (Express RESTful API Entrypoint)
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { 
  getClassrooms, 
  getClassroomById, 
  createClassroom, 
  updateClassroom, 
  deleteClassroom 
} from './controllers/classroomController.js';
import { loginAdmin, getAdminProfile } from './controllers/authController.js';
import { authenticateToken } from './middleware/authGuard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態資源路由 (平面圖、360全景圖)
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../frontend')));

// ==============================================================================
// 1. 公開路由 (Public Endpoints - 免登入)
// ==============================================================================
app.get('/api/v1/classrooms', getClassrooms);
app.get('/api/v1/classrooms/:id', getClassroomById);

// 樓層清單
app.get('/api/v1/floors', (req, res) => {
  res.json({
    success: true,
    data: [
      { floor_code: 'B1', floor_name: '地下各專業講堂與實驗室', svg_map_path: '/assets/maps/floor-b1.svg' },
      { floor_code: '1F', floor_name: '一樓主門廳與創業育成空間', svg_map_path: '/assets/maps/floor-1f.svg' },
      { floor_code: '2F', floor_name: '二樓主要教學區與演講廳', svg_map_path: '/assets/maps/floor-2f.svg' },
      { floor_code: '3F', floor_name: '三樓綜合教室與大型會議廳', svg_map_path: '/assets/maps/floor-3f.svg' },
      { floor_code: '4F', floor_name: '四樓系所辦公室與專題研討室', svg_map_path: '/assets/maps/floor-4f.svg' }
    ]
  });
});

// ==============================================================================
// 2. 認證路由 (Auth)
// ==============================================================================
app.post('/api/v1/auth/login', loginAdmin);
app.get('/api/v1/auth/me', authenticateToken, getAdminProfile);

// ==============================================================================
// 3. 管理員維護路由 (Admin Endpoints - 需 JWT 驗證)
// ==============================================================================
app.post('/api/v1/classrooms', authenticateToken, createClassroom);
app.put('/api/v1/classrooms/:id', authenticateToken, updateClassroom);
app.delete('/api/v1/classrooms/:id', authenticateToken, deleteClassroom);

// 404 與錯誤處理
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[NCNU Space Query API] 服務已在 http://localhost:${PORT} 啟動`);
  });
}

export default app;
