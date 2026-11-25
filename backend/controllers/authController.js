/**
 * 認證控制器 (Authentication Controller)
 */

export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  // 預設管理員帳號密碼檢核
  if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
    const demoToken = 'demo-admin-token-xyz';

    return res.json({
      success: true,
      message: '登入成功',
      token: demoToken,
      admin: {
        id: 1,
        username: 'admin',
        display_name: '管院空間系統管理員',
        role: 'superadmin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: '帳號或密碼錯誤 (預設帳號: admin, 密碼: admin123)'
  });
};

export const getAdminProfile = (req, res) => {
  res.json({
    success: true,
    admin: req.user
  });
};
