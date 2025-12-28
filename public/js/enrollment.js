function loadEnrollmentPage() {
  
  const courseSelect = document.getElementById("enroll-course");

  if (!courseSelect) {
    console.warn("Enroll course select not found yet");
    return;
  }

   // Clear existing options
  courseSelect.innerHTML = `
    <option value="">Select Course</option>
  `;

  // ✅ MANUAL COURSE LIST (can be API later)
  const courses = [   
    { id: "aiprompt", title: "AI Prompt Engineering" },
    { id: "datascience", title: "Data Science" },
    { id: "java", title: "Java" },
    { id: "javascript", title: "JavaScript" },
    { id: "machinelearning", title: "Machine Learning" },
    { id: "medicalcoding", title: "Medical Coding" },
    { id: "mobile", title: "Mobile Development" },
    { id: "networking", title: "Networking" },
    { id: "python", title: "Python" },
    { id: "robotics", title: "Robotics" },
    { id: "webdev", title: "Web Development" }
  ];

  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.title;
    courseSelect.appendChild(option);
  });
}


document.addEventListener("submit", async function (e) {
  if (e.target.id !== "enrollmentForm") return;

  e.preventDefault(); // 🚨 VERY IMPORTANT

  // 1️⃣ Collect data
  const data = {
    fullName: document.getElementById("enroll-name").value,
    gender: document.getElementById("enroll-gender").value,
    email: document.getElementById("enroll-email").value,
    phone: document.getElementById("enroll-phone").value,
    course: document.getElementById("enroll-course").value,
    timeZone: document.getElementById("enroll-zone").value
  };

  // 2️⃣ Basic validation
  if (!document.getElementById("enroll-terms").checked) {
    alert("Please accept Terms & Conditions");
    return;
  }

  try {
    // 3️⃣ Send data to backend
    const res = await fetch(`${API_BASE_URL}/api/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    // 4️⃣ Show success message
    if (result.success) {
      alert("🎉 Enrollment Successful!");

      // optional: clear form
      e.target.reset();

      // optional: stay on page OR go dashboard
      // showPage("dashboard-page");
    } else {
      alert(result.message || "Enrollment failed");
    }

  } catch (error) {
    console.error(error);
    alert("Server error. Please try again later.");
  }
});
