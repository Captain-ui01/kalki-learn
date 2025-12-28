async function loadDashboard() {
    console.log("dashboard.js loaded");
  try {
    const res = await fetch(`${API_BASE_URL}/api/student/dashboard`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    console.log("Dashboard data:", data);

    // 🚨 STOP if backend says failure
if (!data.success) {
  console.warn("Dashboard API failed:", data.message);
  return; // ⛔ DO NOT continue
}

    // Stats
    const coursesEl = document.getElementById("stat-courses");
    if (coursesEl) {
      coursesEl.innerText = data.stats.courses ?? "N/A";
    }

    const hoursEl = document.getElementById("stat-hours");
    if (hoursEl) hoursEl.innerText = data.stats.hours ?? "N/A";

    const certEl = document.getElementById("stat-certificates");
    if (certEl) certEl.innerText = data.stats.certificates ?? "N/A";

    const projEl = document.getElementById("stat-projects");
    if (projEl) projEl.innerText = data.stats.projects ?? "N/A";

    // Continue Learning
    const continueDiv = document.getElementById("continue-learning-list");
    const continueEmpty = document.getElementById("continue-learning-empty");
    if (!continueDiv || !continueEmpty) return;
    continueDiv.innerHTML = "";

if (!data.continueLearning || data.continueLearning.length === 0) {
  continueEmpty.style.display = "block";
} else {
  continueEmpty.style.display = "none";

  data.continueLearning.forEach(e => {
    continueDiv.innerHTML += `
      <div class="progress-course-card">
        <img src="${e.courseId.image}">
        <div class="progress-info">
          <h4>${e.courseId.title}</h4>
          <p>Completed ${e.progress || 0}%</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${e.progress || 0}%"></div>
          </div>
        </div>
        <button class="btn btn-primary">Continue</button>
      </div>
    `;
  });
}


    // Achievements
    const achDiv = document.getElementById("achievement-list");
const achEmpty = document.getElementById("achievement-empty");
if (!achDiv || !achEmpty) return;
achDiv.innerHTML = "";
if (!data.achievements || data.achievements.length === 0) {
  achEmpty.style.display = "block";
} else {
  achEmpty.style.display = "none";

  data.achievements.forEach(a => {
    achDiv.innerHTML += `
      <div class="achievement-badge">
        <div class="badge-icon"><i class="${a.icon}"></i></div>
        <div>
          <h5>${a.title}</h5>
          <p>${a.description}</p>
        </div>
      </div>
    `;
  });
}


    // Deadlines
    const deadlineDiv = document.getElementById("deadline-list");
const deadlineEmpty = document.getElementById("deadline-empty");
if (!deadlineDiv || !deadlineEmpty) return;
deadlineDiv.innerHTML = "";

if (!data.deadlines || data.deadlines.length === 0) {
  deadlineEmpty.style.display = "block";
} else {
  deadlineEmpty.style.display = "none";

  data.deadlines.forEach(d => {
    deadlineDiv.innerHTML += `
      <div class="event-card">
        <div class="event-date">${d.date}</div>
        <h4>${d.title}</h4>
        <p>${d.description}</p>
      </div>
    `;
  });
}

  } catch (err) {
    console.error("Dashboard JS error:", err);
  }
}
 
function initKalkiDashboard() {
  const token = localStorage.getItem("token");

  const value = token ? "0" : "N/A";

  document.getElementById("kdb-progress").innerText = value;
  document.getElementById("kdb-complete").innerText = value;
  document.getElementById("kdb-cert").innerText = value;
  document.getElementById("kdb-support").innerText = value;
}

document.addEventListener("page:loaded", (e) => {
  if (e.detail === "dashboard-page") {
    initKalkiDashboard();
  }
});
