async function loadDashboard() {
  console.log("Student dashboard loading...");

  const token = localStorage.getItem("token");

  // 🔒 NOT LOGGED IN → N/A
  if (!token) {
    setDashboardNA();
    return;
  }

  const userName = localStorage.getItem("userName");

  const greetingEl = document.getElementById("dashboard-greeting");
  if (greetingEl) {
    greetingEl.innerText = userName
      ? `Hello, ${userName} 👋`
      : "Hello 👋";
  }


  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/student`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const result = await res.json();
    console.log("Dashboard API result:", result);

    // 🚨 Stop if backend failed
    if (!result.success) {
      console.warn("Dashboard API failed:", result.message);
      setDashboardNA();
      return;
    }

    const data = result.data;

    // ================= OVERVIEW =================
    setText("kdb-progress", data.coursesInProgress);
    setText("kdb-complete", data.coursesCompleted);
    setText("kdb-cert", data.certificates);
    setText("kdb-hours", data.hoursLearned);

    // ================= CONTINUE LEARNING =================
    const list = document.getElementById("continue-learning-list");
    const empty = document.getElementById("continue-learning-empty");

    if (!list || !empty) return;

    list.innerHTML = "";

    if (!data.continueLearning || data.continueLearning.length === 0) {
      empty.style.display = "block";
      empty.innerHTML = `
        <p>You haven’t enrolled in any courses yet 🎯</p>
        <p>Start your learning journey today 🚀</p>
      `;
    } else {
      empty.style.display = "none";

      data.continueLearning.forEach(e => {
        list.innerHTML += `
          <div class="progress-course-card">
            <div class="progress-info">
              <h4>${e.courseId?.title || "Course"}</h4>
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

    // ================= UPCOMING EVENTS =================
    const eventsList = document.getElementById("events-list");
    const eventsEmpty = document.getElementById("events-empty");

    if (eventsList && eventsEmpty) {
      eventsList.innerHTML = "";

      if (!data.events || data.events.length === 0) {
        eventsEmpty.style.display = "block";
        eventsEmpty.innerHTML = `
          <p>No upcoming events 📭</p>
          <p class="kdb-muted">You’re all caught up. Keep learning!</p>
        `;
      } else {
        eventsEmpty.style.display = "none";

        data.events.forEach(ev => {
          eventsList.innerHTML += `
            <div class="event-card">
              <div class="event-date">${ev.date}</div>
              <h4>${ev.title}</h4>
              <p>${ev.description}</p>
            </div>
          `;
        });
      }
    }

    // ================= ACHIEVEMENTS =================
    const achList = document.getElementById("achievement-list");
    const achEmpty = document.getElementById("achievement-empty");

    if (achList && achEmpty) {
      achList.innerHTML = "";

      if (!data.achievements || data.achievements.length === 0) {
        achEmpty.style.display = "block";
        achEmpty.innerHTML = `
          <p>No achievements yet 🏁</p>
          <p class="kdb-muted">Complete your first course to earn badges!</p>
        `;
      } else {
        achEmpty.style.display = "none";

        data.achievements.forEach(a => {
          achList.innerHTML += `
            <div class="achievement-badge">
              <span class="badge-icon">${a.icon}</span>
              <div>
                <h5>${a.title}</h5>
                <p>${a.description}</p>
              </div>
            </div>
          `;
        });
      }
    }
    loadProfileAvatar();
  } catch (err) {
    console.error("Dashboard JS error:", err);
    setDashboardNA();
  }
}

function loadProfileAvatar() {
  const avatarImg = document.getElementById("profile-avatar");
  if (!avatarImg) return;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.avatar) {
    avatarImg.src = "/images/default-avatar.png";
    return;
  }

  avatarImg.src = user.avatar.startsWith("http")
    ? user.avatar
    : `${API_BASE_URL}${user.avatar}`;
}



// ================= HELPERS =================
function setDashboardNA() {
  setText("kdb-progress", "N/A");
  setText("kdb-complete", "N/A");
  setText("kdb-cert", "N/A");
  setText("kdb-hours", "N/A");

  const empty = document.getElementById("continue-learning-empty");
  if (empty) {
    empty.style.display = "block";
    empty.innerHTML = `
      <p>Please login to see your learning progress 🔐</p>
    `;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerText = value === undefined || value === null ? "0" : value;
}

function loadMiniCalendar() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthEl = document.getElementById("calendar-month");
  const daysEl = document.getElementById("calendar-days");

  if (!monthEl || !daysEl) return;

  monthEl.innerText = `📅 ${monthNames[month]} ${year}`;
  daysEl.innerHTML = "";

  // Empty slots before month start
  for (let i = 0; i < firstDay; i++) {
    daysEl.innerHTML += `<div></div>`;
  }

  // Dates
  for (let d = 1; d <= lastDate; d++) {
    const isToday = d === today;
    daysEl.innerHTML += `
      <div class="calendar-day ${isToday ? "today" : ""}">
        ${d}
      </div>
    `;
  }
}


// ================= PAGE LOAD =================
document.addEventListener("page:loaded", (e) => {
  if (e.detail === "dashboard-page") {
    loadDashboard();
    loadMiniCalendar();
    loadProfileAvatar(); 
  }
});