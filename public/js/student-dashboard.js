//document.addEventListener("DOMContentLoaded", () => {
  // Run ONLY if student dashboard exists in DOM
  //if (document.getElementById("student-name")) {
    //initStudentDashboard();
  //}
//});*/

/*async function initStudentDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/student/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    document.getElementById("student-name").innerText =
      `Welcome back, ${data.student.name}`;

    document.getElementById("student-summary").innerText =
      data.summary || "Your learning progress";

    renderStudentCourses(data.courses || []);

  } catch (err) {
    console.error(err);
    alert("Failed to load student dashboard");
  }
}

function renderStudentCourses(courses) {
  const container = document.getElementById("student-courses");
  container.innerHTML = "";

  if (courses.length === 0) {
    container.innerHTML = "<p>No courses enrolled yet.</p>";
    return;
  }

  courses.forEach(course => {
    container.innerHTML += `
      <div class="course-card">
        <h4>${course.title}</h4>
        <p>Progress: ${course.progress}%</p>
      </div>
    `;
  });
}

/*document.addEventListener("page:loaded", e => {
  if (e.detail === "student-dashboard-page") {
    initStudentDashboard();
  }
});*/

