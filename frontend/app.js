const API_BASE = "http://127.0.0.1:8000/api/auth";

function switchTab(mode) {
  const loginForm = document.getElementById("login-form");
  const regForm = document.getElementById("register-form");
  const tabLogin = document.getElementById("tab-login");
  const tabReg = document.getElementById("tab-register");
  clearMessage();

  if (mode === "login") {
    loginForm.classList.remove("hidden");
    regForm.classList.add("hidden");
    tabLogin.classList.add("active");
    tabReg.classList.remove("active");
  } else {
    loginForm.classList.add("hidden");
    regForm.classList.remove("hidden");
    tabLogin.classList.remove("active");
    tabReg.classList.add("active");
  }
}

function showMessage(text, isSuccess) {
  const msgBox = document.getElementById("message");
  msgBox.textContent = text;
  msgBox.className = isSuccess ? "msg-ok" : "msg-err";
}

function clearMessage() {
  const msgBox = document.getElementById("message");
  msgBox.style.display = "none";
  msgBox.className = "";
}

// 處理註冊送出
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    username: document.getElementById("reg-username").value.trim(),
    name: document.getElementById("reg-name").value.trim(),
    email: document.getElementById("reg-email").value.trim(),
    password: document.getElementById("reg-password").value,
    role: document.getElementById("reg-role").value,
  };

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.detail || "註冊失敗", false);
      return;
    }
    showMessage(`${data.message}（使用者編號：${data.user_id}）`, true);
    e.target.reset();
  } catch (err) {
    showMessage("無法連線至後端伺服器，請確認 FastAPI 是否已啟動", false);
  }
});

// 處理登入送出
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    username: document.getElementById("login-username").value.trim(),
    password: document.getElementById("login-password").value,
  };

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.detail || "登入失敗", false);
      return;
    }
    // 將登入資訊暫存於瀏覽器，供後續排課或預約頁面讀取角色權限
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    showMessage(`歡迎回來，${data.user.name}（身分：${data.user.role}）！即將進入排課系統...`, true);
    setTimeout(() => {
      window.location.href = "schedule.html";
    }, 800);
  } catch (err) {
    showMessage("無法連線至後端伺服器，請確認 FastAPI 是否已啟動", false);
  }
});