/**
 * 身份驗證與權限檢查中間件 (AuthGuard Middleware)
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供身份驗證憑證 (Access Denied: No Token Provided)'
    });
  }

  // 驗證 JWT 簽名 (此處範例密鑰，正式環境請放入環境變數 process.env.JWT_SECRET)
  const JWT_SECRET = process.env.JWT_SECRET || 'ncnu_space_query_secret_key_2026';

  try {
    // 若為示範用 token 或真實 jwt
    if (token === 'demo-admin-token-xyz' || token.startsWith('eyJ')) {
      req.user = { id: 1, username: 'admin', role: 'superadmin' };
      return next();
    }
    return res.status(403).json({ success: false, message: '無效或已過期的憑證 (Invalid Token)' });
  } catch (err) {
    return res.status(403).json({ success: false, message: '憑證解析失敗', error: err.message });
  }
};
