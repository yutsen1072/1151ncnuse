const COURSE_API = "http://127.0.0.1:8000/api/courses";

// 讀取登入使用者資訊；若直接開啟頁面未登入，預設提供一組教師測試帳號方便檢視
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  id: 1,
  name: "測試教師",
  role: "teacher",
};

let calendar = null;

// 初始化頁面
document.addEventListener("DOMContentLoaded", () => {
  applyRoleUI();
  initCalendar();
  loadAllScheduleData();
});

// 顯示浮動提示訊息
function showToast(msg, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.background = isError ? "#b55d5d" : "#4f772d";
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}

// 依據登入身分調整畫面權限與欄位
function applyRoleUI() {
  document.getElementById("user-info").textContent = `${currentUser.name} (ID: ${currentUser.id})`;
  document.getElementById("user-role-badge").textContent = currentUser.role.toUpperCase();

  const isAdmin = currentUser.role === "admin";
  const isTeacher = currentUser.role === "teacher";

  // 學生僅能瀏覽日曆，隱藏新增表單與衝堂面板
  document.getElementById("form-card").classList.toggle("hidden", !isAdmin && !isTeacher);
  document.getElementById("conflict-panel").classList.toggle("hidden", !isAdmin);

  if (isTeacher) {
    document.getElementById("form-title").textContent = "教師登記排課志願";
    document.getElementById("submit-course-btn").textContent = "送出志願登記";
    document.getElementById("teacher-id").value = currentUser.id;
    document.getElementById("teacher-id").readOnly = true;
    document.getElementById("drag-hint").textContent = "（教師僅可檢視，管理員可拖曳調整時段）";
  } else if (isAdmin) {
    document.getElementById("form-title").textContent = "管理員直接指派排課";
    document.getElementById("submit-course-btn").textContent = "確認並排入課表";
    document.getElementById("teacher-id").readOnly = false;
    document.getElementById("drag-hint").textContent = "（支援滑鼠直接拖曳課程方塊調整日期與時間）";
  }
}

// 測試用：一鍵在教師與管理員之間切換，方便驗收不同權限功能
function switchDemoRole() {
  if (currentUser.role === "teacher") {
    currentUser = { ...currentUser, role: "admin", name: currentUser.name.replace(" (管理員)", "") + " (管理員)" };
  } else {
    currentUser = { ...currentUser, role: "teacher", name: currentUser.name.replace(" (管理員)", "") };
  }
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  applyRoleUI();
  if (calendar) {
    calendar.setOption("editable", currentUser.role === "admin");
  }
  loadAllScheduleData();
  showToast(`已切換為 ${currentUser.role} 身分檢視`);
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// 初始化 FullCalendar 週日曆
function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    locale: "zh-tw",
    slotMinTime: "08:00:00",
    slotMaxTime: "21:00:00",
    allDaySlot: false,
    height: "auto",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },
    // 僅管理員允許滑鼠拖曳調整時間
    editable: currentUser.role === "admin",
    eventDrop: async function (info) {
      await handleCalendarDrag(info);
    },
    eventResize: async function (info) {
      await handleCalendarDrag(info);
    },
  });
  calendar.render();
}

// 處理管理員滑鼠 Drag & Drop 拖曳更新時段 (呼叫 PATCH /api/courses/{id}/move)
async function handleCalendarDrag(info) {
  const event = info.event;
  const start = event.start;
  const end = event.end || new Date(start.getTime() + 60 * 60 * 1000);

  const courseDate = start.toISOString().split("T")[0];
  const startTime = start.toTimeString().slice(0, 8);
  const endTime = end.toTimeString().slice(0, 8);

  try {
    const res = await fetch(`${COURSE_API}/${event.id}/move`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course_date: courseDate,
        start_time: startTime,
        end_time: endTime,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.detail || "拖曳更新失敗", true);
      info.revert();
      return;
    }
    showToast(`已將「${event.title}」調整至 ${courseDate} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`);
    loadAllScheduleData();
  } catch (err) {
    showToast("連線後端失敗，已還原位置", true);
    info.revert();
  }
}

// 載入課程清單與衝突偵測資料
async function loadAllScheduleData() {
  try {
    // 老師登入時可選擇看全部課表或只看自己；此處撈全部課表方便參考空堂，並在操作鈕做權限控管
    const res = await fetch(COURSE_API);
    const courses = await res.json();

    // 更新日曆事件
    calendar.removeAllEvents();
    calendar.addEventSource(courses);

    // 更新下方表格
    renderCourseTable(courses);

    // 若為管理員，同步執行衝堂偵測
    if (currentUser.role === "admin") {
      await loadConflicts();
    }
  } catch (err) {
    showToast("無法讀取排課資料，請確認 FastAPI 後端是否啟動", true);
  }
}

// 取得並渲染時間衝突警告 (GET /api/courses/conflicts)
async function loadConflicts() {
  const panel = document.getElementById("conflict-panel");
  const summary = document.getElementById("conflict-summary");
  const list = document.getElementById("conflict-list");

  try {
    const res = await fetch(`${COURSE_API}/conflicts`);
    const data = await res.json();

    list.innerHTML = "";
    if (data.total_conflicts === 0) {
      panel.classList.add("clean");
      summary.textContent = "目前排課與空間借用均無任何時間衝突";
    } else {
      panel.classList.remove("clean");
      summary.textContent = `偵測到 ${data.total_conflicts} 筆排課／空間衝堂，請拖曳日曆或調整時段：`;
      data.conflicts.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = `【${c.type}】(${c.date}) ${c.detail}`;
        list.appendChild(li);
      });
    }
  } catch (err) {
    summary.textContent = "衝突偵測載入失敗";
  }
}

// 渲染下方課程清單表格
function renderCourseTable(courses) {
  const tbody = document.getElementById("course-table-body");
  if (!courses || courses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">目前尚無任何排課資料</td></tr>`;
    return;
  }

  tbody.innerHTML = courses
    .map((c) => {
      const isConfirmed = c.status === "confirmed";
      const statusBadge = isConfirmed
        ? `<span class="status-tag status-confirmed">已核定</span>`
        : `<span class="status-tag status-pending">志願待審</span>`;

      // 權限判斷：管理員可審核與刪除全部；教師僅能刪除自己的課程
      const canDelete =
        currentUser.role === "admin" ||
        (currentUser.role === "teacher" && c.teacher_id === currentUser.id);
      const canConfirm = currentUser.role === "admin" && !isConfirmed;

      return `
        <tr>
          <td>${c.course_code}</td>
          <td><strong>${c.course_name}</strong></td>
          <td>${c.teacher_name} (ID:${c.teacher_id})</td>
          <td>${c.room_code}</td>
          <td>${c.course_date} ${c.start_time.slice(0, 5)}~${c.end_time.slice(0, 5)}</td>
          <td>${statusBadge}</td>
          <td>
            ${canConfirm ? `<button class="btn-confirm" onclick="confirmCourse(${c.id})">核定</button>` : ""}
            ${canDelete ? `<button class="btn-del" onclick="deleteCourse(${c.id})">刪除</button>` : "-"}
          </td>
        </tr>
      `;
    })
    .join("");
}

// 送出新增排課志願 / 管理員直接排課 (POST /api/courses)
document.getElementById("course-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const roomVal = document.getElementById("classroom-id").value.trim();

  const payload = {
    course_code: document.getElementById("course-code").value.trim(),
    course_name: document.getElementById("course-name").value.trim(),
    teacher_id: parseInt(document.getElementById("teacher-id").value, 10),
    classroom_id: roomVal ? parseInt(roomVal, 10) : null,
    course_date: document.getElementById("course-date").value,
    start_time: document.getElementById("start-time").value + ":00",
    end_time: document.getElementById("end-time").value + ":00",
    status: currentUser.role === "admin" ? "confirmed" : "pending",
  };

  try {
    const res = await fetch(COURSE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.detail || "新增失敗", true);
      return;
    }

    showToast(data.message || "課程登記成功");
    e.target.reset();
    applyRoleUI();
    loadAllScheduleData();
  } catch (err) {
    showToast("無法連線至後端伺服器", true);
  }
});

// 管理員單擊「核定」將 pending 改為 confirmed (PUT /api/courses/{id})
async function confirmCourse(courseId) {
  try {
    const res = await fetch(
      `${COURSE_API}/${courseId}?operator_id=${currentUser.id}&operator_role=${currentUser.role}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.detail || "核定失敗", true);
      return;
    }
    showToast("課程已核定為正式排課");
    loadAllScheduleData();
  } catch (err) {
    showToast("連線後端失敗", true);
  }
}

// 刪除課程 (DELETE /api/courses/{id})
async function deleteCourse(courseId) {
  if (!confirm("確定要刪除此筆排課紀錄嗎？")) return;

  try {
    const res = await fetch(
      `${COURSE_API}/${courseId}?operator_id=${currentUser.id}&operator_role=${currentUser.role}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast(data.detail || "刪除失敗", true);
      return;
    }
    showToast("課程已刪除");
    loadAllScheduleData();
  } catch (err) {
    showToast("連線後端失敗", true);
  }
}