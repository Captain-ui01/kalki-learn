// js/teacher-dashboard.js

// js/teacher-dashboard.js

async function initTeacherDashboard() {
  try {
    console.log("initTeacherDashboard called");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized access. Please login again.");
      return;
    }

    // 🔥 FETCH MUST BE FIRST
    const res = await fetch(`${API_BASE_URL}/api/teacher/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("API failed with status " + res.status);
    }

    const data = await res.json();
    console.log("Teacher dashboard data:", data);

    // 🔥 NOW SAFE — HTML EXISTS
    const nameEl = document.getElementById("teacher-name");
    if (nameEl) nameEl.innerText = `Welcome, ${data.teacher.name}`;

    const summaryEl = document.getElementById("teacher-summary");
    if (summaryEl)
      summaryEl.innerText =
        data.summary || "Manage your courses and track student progress.";

    renderTeacherStats(data.stats);
    renderTeacherCourses(data.courses);
    renderTeacherStudents(data.students);
    renderTeacherAnalytics(data.analytics);

  } catch (err) {
    console.error("Teacher Dashboard Error:", err);
    alert("Unable to load dashboard. Please try again.");
  }
}


/* ================= RENDER FUNCTIONS ================= */

function renderTeacherStats(stats = {}) {
  const container = document.getElementById("teacher-stats");
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card">
      <h4>${stats.totalCourses || 0}</h4>
      <p>Courses</p>
    </div>
    <div class="stat-card">
      <h4>${stats.totalStudents || 0}</h4>
      <p>Students</p>
    </div>
    <div class="stat-card">
      <h4>${stats.rating || "N/A"}</h4>
      <p>Rating</p>
    </div>
  `;
}

function renderTeacherCourses(courses = []) {
  const container = document.getElementById("teacher-courses");
  if (!container) return;

  if (!courses.length) {
    container.innerHTML = "<p>No courses created yet.</p>";
    return;
  }

  container.innerHTML = "";

  courses.forEach(course => {
    container.innerHTML += `
      <div class="course-card">
        <h4>${course.title}</h4>
        <p>Students Enrolled: ${course.students}</p>
        <p>Status: ${course.status}</p>
      </div>
    `;
  });
}

function renderTeacherStudents(students = []) {
  const container = document.getElementById("teacher-students");
  if (!container) return;

  if (!students.length) {
    container.innerHTML = "<p>No students enrolled yet.</p>";
    return;
  }

  container.innerHTML = "";

  students.forEach(student => {
    container.innerHTML += `
      <div class="student-card">
        <h4>${student.name}</h4>
        <p>Email: ${student.email}</p>
        <p>Course: ${student.course}</p>
      </div>
    `;
  });
}

function renderTeacherAnalytics(analytics = {}) {
  const container = document.getElementById("teacher-analytics");
  if (!container) return;

  container.innerHTML = `
    <div class="analytics-card">
      <p>Average Completion</p>
      <h4>${analytics.avgCompletion || 0}%</h4>
    </div>
    <div class="analytics-card">
      <p>Active Students</p>
      <h4>${analytics.activeStudents || 0}</h4>
    </div>
  `;
}
