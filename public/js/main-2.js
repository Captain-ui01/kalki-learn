// Load page content dynamically
async function loadPageContent(pageId) {
    const pageElement = document.getElementById(pageId);
    if (!pageElement) return;
    
    const pageMap = {
        'home-page': 'pages/home.html',
        'dashboard-page': 'pages/dashboard.html',
        'syllabus-page': 'pages/syllabus.html',
        'about-page': 'pages/about.html',
        'blog-page': 'pages/blog.html',
        'contact-page': 'pages/contact.html',
        'login-page': 'pages/login.html',
        'signup-page': 'pages/signup.html',
        "student-dashboard-page": "/pages/student-dashboard.html",
        "teacher-dashboard-page": "/pages/teacher-dashboard.html",
        "enrollment-page": "/pages/enrollment.html",
        'python-page': 'courses/python.html',
        'webdev-page': 'courses/webdev.html',
        'javascript-page': 'courses/javascript.html',
        'datascience-page': 'courses/datascience.html',
        'aiprompt-page': 'courses/aiprompt.html',
        'mobile-page': 'courses/mobile.html',
        'robotics-page': 'courses/robotics.html',
        'java-page': 'courses/java.html',
        'ml-page': 'courses/machinelearning.html',
        'medicalcoding-page': 'courses/medicalcoding.html',
        'networking-page': 'courses/networking.html'
    };
    
    const pageUrl = pageMap[pageId];
    if (!pageUrl) {
        pageElement.innerHTML = `<div class="container"><h2>Page Not Found</h2><p>The requested page could not be loaded.</p></div>`;
        return;
    }
    
    /*document.dispatchEvent(
      new CustomEvent('page:loaded', { detail: pageId })
    ); */

    try {
        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error('Failed to load page');
        const content = await response.text();
        pageElement.innerHTML = content;
        
        // 🔥 NOW DOM EXISTS — SAFE POINT
        document.dispatchEvent(
        new CustomEvent('page:loaded', { detail: pageId })
        );
        // Re-initialize event listeners for the loaded content
        initializePageEvents();
        
    } catch (error) {
        console.error(`Error loading ${pageUrl}:`, error);
        pageElement.innerHTML = `<div class="container"><h2>Error loading content</h2><p>Please try again later.</p></div>`;
    }
}



// Initialize page events
function initializePageEvents() {
    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Course Card Click
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const coursePage = this.getAttribute('data-course');
            showPage(coursePage);
        });
    });

    // Syllabus Accordion
    document.querySelectorAll('.class-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.class-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.display = 'none';
            });
            
            // Open clicked accordion if it wasn't active
            if (!isActive) {
                this.classList.add('active');
                content.style.display = 'block';
            }
        });
    });


    // Syllabus Card Toggle
    document.querySelectorAll('.syllabus-title').forEach(title => {
        title.addEventListener('click', function() {
            const details = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Toggle current card
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        });
    });

    // Add bounce-in animation to elements
    document.querySelectorAll('.course-card, .path-card, .instructor-card').forEach((card, index) => {
        card.classList.add('bounce-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // send OTP
/*document.getElementById('send-otp-btn')?.addEventListener('click', async () => {
  const email = document.getElementById('signup-email')?.value?.trim();
  const name = document.getElementById('signup-name')?.value?.trim();
  if (!email) return alert('Enter email first');
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('otp-area').style.display = 'block';
      document.getElementById('otp-msg').textContent = 'OTP sent — check your email';
    } else {
      document.getElementById('otp-msg').textContent = data.message || 'Failed to send OTP';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('otp-msg').textContent = 'Network error sending OTP';
  }
});

// verify OTP
document.getElementById('verify-otp-btn')?.addEventListener('click', async () => {
  const email = document.getElementById('signup-email')?.value?.trim();
  const otp = document.getElementById('signup-otp')?.value?.trim();
  if (!otp) return alert('Enter OTP code');
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('otp-msg').style.color = 'green';
      document.getElementById('otp-msg').textContent = 'Email verified ✓ You can now create your account.';
      // optionally set a flag to allow signup
      window.__emailVerified = true;
    } else {
      document.getElementById('otp-msg').style.color = '#d9534f';
      document.getElementById('otp-msg').textContent = data.message || 'Invalid OTP';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('otp-msg').textContent = 'Network error verifying OTP';
  }
}); */


 // inside initializePageEvents()
const signupLink = document.getElementById('go-signup');
if (signupLink) {
  signupLink.removeEventListener?.('click', window._goSignupHandler);
  window._goSignupHandler = function (e) {
    e.preventDefault();
    showPage('signup-page');
  };
  signupLink.addEventListener('click', window._goSignupHandler);
}
   

   // Signup form handler (attach after page loaded)

   // ---------- Signup + OTP frontend logic (paste inside initializePageEvents) ----------
(function setupSignupOtpFlow() {
  const sendBtn = document.getElementById('send-otp-btn');
  const verifyBtn = document.getElementById('verify-otp-btn');
  const otpRow = document.getElementById('otp-row');
  const otpInput = document.getElementById('signup-otp');
  const emailEl = document.getElementById('signup-email');
  const feedbackEmail = document.getElementById('email-otp-feedback');
  const feedbackOtp = document.getElementById('otp-feedback');
  const signupForm = document.getElementById('signup-form');

  if (!signupForm || !sendBtn || !verifyBtn) return;

  // ---------- helpers ----------
  function show(el, msg, color = '#666') {
    if (!el) return;
    el.style.display = 'block';
    el.style.color = color;
    el.textContent = msg;
  }

  function resetOtpUI() {
    otpRow.style.display = 'none';
    feedbackEmail.style.display = 'none';
    feedbackOtp.style.display = 'none';
    otpInput.value = '';
    verifyBtn.style.display = 'none';
    window.__emailVerified = false;
  }

  resetOtpUI();

  let resendTimer = null;
  let resendSeconds = 60;
  let resendCount = 0;
  const MAX_RESENDS = 3;
  let otpVerified = false;

  function startResendTimer() {
    resendSeconds = 60;
    sendBtn.disabled = true;
    updateResendText();

  resendTimer = setInterval(() => {
    resendSeconds--;
    updateResendText();

    if (resendSeconds <= 0) {
      clearInterval(resendTimer);
      if (resendCount < MAX_RESENDS && !otpVerified) {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Resend OTP';
      }
    }
  }, 1000);
}

function updateResendText() {
  sendBtn.textContent = `Resend OTP (${resendSeconds}s)`;
}

/* ---------- Send / Resend OTP ---------- */
sendBtn.addEventListener('click', async () => {
  if (otpVerified) return; // 🔒 block after verification

  if (resendCount >= MAX_RESENDS) {
    show(
      feedbackEmail,
      'Maximum OTP resend limit reached. Please try again later.',
      'red'
    );
    sendBtn.disabled = true;
    return;
  }

  const email = emailEl.value.trim();
  if (!email) {
    show(feedbackEmail, 'Please enter your email first.', 'red');
    return;
  }

  resendCount++;

  show(
    feedbackEmail,
    resendCount === 1 ? 'Sending OTP…' : `Resending OTP (${resendCount}/${MAX_RESENDS})…`
  );

  try {
    const res = await fetch('${API_BASE_URL}/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      show(
        feedbackEmail,
        `OTP sent — check your email (Attempt ${resendCount}/${MAX_RESENDS})`,
        '#2b7a0b'
      );

      otpRow.style.display = 'block';
      verifyBtn.style.display = 'inline-block';
      otpInput.focus();

      // 🔥 START 60s TIMER
      startResendTimer();
    } else {
      show(feedbackEmail, data.message || 'Failed to send OTP', 'red');
      resendCount--; // rollback on failure
      sendBtn.disabled = false;
    }
  } catch (err) {
    console.error(err);
    show(feedbackEmail, 'Network error while sending OTP', 'red');
    resendCount--;
    sendBtn.disabled = false;
  }
});

  // ---------- Verify OTP ----------
  verifyBtn.addEventListener('click', async () => {
    const email = emailEl.value.trim();
    const otp = otpInput.value.trim();

    if (!otp) {
      show(feedbackOtp, 'Please enter the OTP.', 'red');
      return;
    }

    show(feedbackOtp, 'Verifying…');

    try {
      const res = await fetch('${API_BASE_URL}/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        show(feedbackOtp, 'Email verified ✓ You can create your account now.', '#2b7a0b');

        otpVerified = true;
        if (data.success) {
          window.emailVerified = true;

          document.getElementById('create-account-btn').disabled = false;
        }

        clearInterval(resendTimer);
        verifyBtn.style.display = 'none';

        sendBtn.disabled = true;
        verifyBtn.disabled = true;
        verifyBtn.style.cursor = 'not-allowed';
        emailEl.readOnly = true;
        sendBtn.style.cursor = 'not-allowed';
      } else {
        show(feedbackOtp, data.message || 'Invalid or expired OTP', 'red');
      }
    } catch (err) {
      console.error(err);
      show(feedbackOtp, 'Network error while verifying OTP', 'red');
    }
  });

  // Final form submit: only allowed if verified (createBtn enabled)
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name')?.value?.trim();
    const email = emailEl.value?.trim();
    const password = document.getElementById('signup-password')?.value;
    const confirm = document.getElementById('signup-confirm-password')?.value;
    const role = document.getElementById('signup-role')?.value;
    const termsChecked = document.getElementById('terms')?.checked;

    // basic validation
    if (!name || !email || !password || !confirm || !role) {
      alert('Please fill all fields.');
      return;
    }
    if (password !== confirm) { 
      alert('Passwords do not match'); return; 
    }
    if (!termsChecked) {
      return alert('Please agree to the Terms and Privacy Policy.');
    }
    if (password !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      return alert('Password must be at least 6 characters.');
    }
    
    
    try {
      const res = await fetch('${API_BASE_URL}/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('Account created! You can now login.');
        // go back to login page
        return showPage("login-page");
      } else {
        alert('Sign up failed: ' + (data.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while creating account.');
    }
  });

})();

// --- Login handlers for Student and Tutor (place inside initializePageEvents) ---

// Helper: unified login function
async function performLogin({ email, password, role }) {
  if (!email || !password) {
    alert('Please fill in both email and password.');
    return null;
  }

  try {
    // include role if you want backend to know (optional)
    const res = await fetch('${API_BASE_URL}/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      // save token & user
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(data.user, data.token); // re-render UI
      redirectAfterLogin(data.user);
      return { ok: true, data };
    } else {
      return { ok: false, message: data.message || 'Invalid credentials' };
    }
  } catch (err) {
    console.error('Login error', err);
    return { ok: false, message: 'Network error while logging in.' };
  }
}

// ================= REDIRECT AFTER LOGIN =================
function redirectAfterLogin(user) {
  if (!user || !user.role) {
    console.error("redirectAfterLogin: invalid user");
    return;
  }

  if (user.role === "student") {
    showPage("home-page");
  } 
  else if (user.role === "teacher") {
    showPage("teacher-dashboard-page");
  } 
  else {
    showPage("home-page");
  }
}

// Student login form
const studentForm = document.getElementById('student-login-form');
if (studentForm) {
  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('student-email')?.value?.trim();
    const password = document.getElementById('student-password')?.value;

    const result = await performLogin({ email, password, role: 'student' });

    // ----- UI ERROR HANDLING -----
    if (!result.ok) {

      // 👉 Role mismatch → display clear UI message
      if (result.message.includes("Role mismatch")) {
        alert(
          "This account is registered as a Tutor.\n\nPlease click the 'Tutor Login' tab to log in."
        );
        return;
      }

      // 👉 Other errors
      alert('Login failed: ' + (result.message || 'Invalid credentials.'));
      return;
    }

    // ----- SUCCESS -----
    alert(`Welcome back${result.data.user?.name ? ', ' + result.data.user.name : ''}!`);
    // save role explicitly (extra safety)
    localStorage.setItem('role', result.data.user.role);
    // hide login page if needed
    document.getElementById('login-page')?.classList.remove('active-page');

    redirectAfterLogin(result.data.user);

  });
}

// Tutor login form
const tutorForm = document.getElementById('tutor-login-form');
if (tutorForm) {
  tutorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('tutor-email')?.value?.trim();
    const password = document.getElementById('tutor-password')?.value;

    const result = await performLogin({ email, password, role: 'teacher' });

    // ----- UI ERROR HANDLING -----
    if (!result.ok) {

      // 👉 Role mismatch → display clear UI message
      if (result.message.includes("Role mismatch")) {
        alert(
          "This account is registered as a Student.\n\nPlease click the 'Student Login' tab to log in."
        );
        return;
      }

      // 👉 Other errors
      alert('Login failed: ' + (result.message || 'Invalid credentials.'));
      return;
    }

    // ----- SUCCESS -----
    alert(`Welcome back${result.data.user?.name ? ', ' + result.data.user.name : ''}!`);
    localStorage.setItem('role', result.data.user.role);
    // hide login page
    document.getElementById('login-page')?.classList.remove('active-page');
    redirectAfterLogin(result.data.user);

  });
}



    // -----------------------------
    // Contact Form Submit Handler
    // -----------------------------
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name').value;
            const email = contactForm.querySelector('#email').value;
            const subject = contactForm.querySelector('#subject').value;
            const message = contactForm.querySelector('#message').value;

            try {
                const res = await fetch('${API_BASE_URL}/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    alert('Message sent! Thank you.');
                    contactForm.reset();
                } else {
                    alert('Error sending message: ' + (data.message || res.statusText));
                }
            } catch (err) {
                console.error(err);
                alert('Network error sending message.');
            }
        });
    }

    // --- Login tab switching (works for dynamically loaded login.html) ---
(function attachLoginTabs() {
  const loginContainer =
    document.getElementById("login-page") ||
    document.querySelector(".login-container") ||
    null;

  // If login page not loaded yet, retry shortly
  if (!loginContainer) {
    setTimeout(attachLoginTabs, 60);
    return;
  }

  // Avoid attaching listeners multiple times
  if (loginContainer._tabsAttached) return;
  loginContainer._tabsAttached = true;

  // Delegated event listener for clicking Student / Tutor tabs
  loginContainer.addEventListener("click", function (ev) {
    const btn = ev.target.closest(".login-tab");
    if (!btn) return;

    ev.preventDefault();

    // Remove active from all tabs & forms
    loginContainer
      .querySelectorAll(".login-tab")
      .forEach((t) => t.classList.remove("active"));
    loginContainer
      .querySelectorAll(".login-form")
      .forEach((f) => f.classList.remove("active"));

    // Activate clicked tab
    btn.classList.add("active");

    const tabId = btn.getAttribute("data-tab") || "student";
    const formEl = document.getElementById(`${tabId}-login`);

    if (formEl) {
      formEl.classList.add("active");
      formEl.style.display = "";
      const firstInput = formEl.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    } else {
      console.warn("Tab target not found:", tabId);
    }
  });

  // Auto-activate first tab
  const firstTab =
    loginContainer.querySelector(".login-tab.active") ||
    loginContainer.querySelector(".login-tab");

  if (firstTab) firstTab.click();
})();

}

// Enhanced Page Navigation with Transitions
function showPage(pageId) {
    // Get current active page
    const currentPage = document.querySelector('.page.active-page');
    const nextPage = document.getElementById(pageId);

    

    if (!nextPage) {
        console.error(`showPage: Page element with id "${pageId}" not found in DOM.`);
        // Optionally, show a user-friendly message somewhere or load a fallback
        return;
    }
    
    if (currentPage && nextPage && currentPage !== nextPage) {
        // Add fade out animation to current page
        currentPage.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        // After fade out, switch pages and fade in
        setTimeout(() => {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active-page');
                page.style.animation = '';
            });
            
            // Load content for the new page
            loadPageContent(pageId);
            
            // Show the selected page with fade in animation
            nextPage.classList.add('active-page');
            nextPage.style.animation = 'fadeIn 0.5s ease-out forwards';

            
            // 🔥 ADD THIS
            if (pageId === "dashboard-page") {
            console.log("Dashboard page opened (after transition)");
            loadDashboard();
            }

            // Update mobile bottom nav active state
            document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Close mobile menu if open
            document.getElementById('main-nav').classList.remove('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Trigger scroll animations for new page
            setTimeout(revealOnScroll, 100);
            
        }, 300);
    } else {
        // Initial page load or same page click
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active-page');
        });
        
        // Load content for the new page
        loadPageContent(pageId);
        
        nextPage.classList.add('active-page');
        nextPage.style.animation = 'fadeIn 0.5s ease-out forwards';

        // 🔥 ADD THIS
        if (pageId === "dashboard-page") {
        console.log("Dashboard page opened (direct)");
        loadDashboard();
        }
    }

    
}



// --- AUTH UI + Chat Pill: add to main-2.js ---

// Helper: save user and token
function setAuth(user, token) {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));
  renderAuthUI();
}

// Helper: remove auth
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  renderAuthUI();
}

// get user object
function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// Render header auth buttons / avatar
function renderAuthUI() {
  // allow both id or class markup
let container = document.getElementById('auth-buttons');
if (!container) container = document.querySelector('.auth-buttons');
if (!container) {
  console.error('auth-buttons container not found (add id="auth-buttons" to header)');
  return;
}


  const user = getUser();
  container.innerHTML = ''; // clear

  if (user && user.name) {
    // Logged in: show small avatar and dropdown (or just avatar)
    container.classList.add('auth-logged-in');

    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.title = user.name || 'Profile';
    avatar.innerHTML = `<img src="${user.avatar || user.photo || 'https://www.gravatar.com/avatar/?d=mp'}" alt="avatar" style="width:100%;height:100%;object-fit:cover">`;

    avatar.addEventListener('click', () => {
  // open profile popup (not the chat)
  openProfileModal();
});

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-outline';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      showPage('home-page');
    });

    container.appendChild(avatar);
    container.appendChild(logoutBtn);
  } else {
    // Not logged in: show Login button
    container.classList.remove('auth-logged-in');
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn btn-outline';
    loginBtn.textContent = 'Login';
    loginBtn.addEventListener('click', () => showPage('login-page'));
    container.appendChild(loginBtn);
  }

  // ensure chat pill exists (only if logged in)
  renderChatPill();
}

// Create / update floating chat pill
function renderChatPill() {
  // remove existing
  const existing = document.querySelector('.chat-pill');
  if (existing) existing.remove();

  const user = getUser();
  if (!user) return; // only show for logged-in users

  const pill = document.createElement('div');
  pill.className = 'chat-pill';
  pill.setAttribute('role', 'button');
  pill.innerHTML = `
    <div class="pill-avatar"><img src="${user.avatar || user.photo || 'https://www.gravatar.com/avatar/?d=mp'}" alt="avatar" style="width:100%;height:100%;object-fit:cover"></div>
    <div class="pill-label" style="color:white;font-weight:600;font-size:0.95rem">Help & Chat</div>
    <div class="unread" id="chat-unread" style="display:none">1</div>
  `;
  document.body.appendChild(pill);

  pill.addEventListener('click', () => toggleChatPanel());
}

// Chat panel open/close
function createChatPanelIfNeeded() {
  if (document.querySelector('.chat-panel')) return;
  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = `
    <div class="panel-header">
      <div style="width:44px;height:44px;border-radius:50%;overflow:hidden">
        <img id="panel-avatar" src="${(getUser() && (getUser().avatar||getUser().photo)) || 'https://www.gravatar.com/avatar/?d=mp'}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div style="flex:1">
        <div style="font-weight:700">Team</div>
        <div style="font-size:12px;color:#666">Typically replies within a day</div>
      </div>
      <button id="panel-close" class="btn btn-outline" style="margin-left:6px">Close</button>
    </div>
    <div class="panel-body">
      <p style="color:#333">Hello! Need help? Send a message and our team will reply.</p>
      <textarea id="chat-msg" placeholder="Write a message..." style="width:100%;height:100px;padding:8px;border-radius:8px;border:1px solid #eee"></textarea>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button id="chat-send" class="btn btn-primary" style="flex:1">Send</button>
        <button id="chat-profile" class="btn btn-outline" style="flex:0">Profile</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector('#panel-close').addEventListener('click', () => panel.classList.remove('open'));
  panel.querySelector('#chat-send').addEventListener('click', async () => {
    const msg = panel.querySelector('#chat-msg').value.trim();
    if (!msg) return alert('Please enter a message.');
    // you can wire this to your contact API to save the message in DB
    try {
      const res = await fetch('${API_BASE_URL}/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: getUser().name, email: getUser().email, subject: 'Chat message', message: msg })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Message sent. Our team will reply!');
        panel.querySelector('#chat-msg').value = '';
        panel.classList.remove('open');
      } else {
        alert('Failed to send message: ' + (data.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert('Network error sending chat message.');
    }
  });

  panel.querySelector('#chat-profile').addEventListener('click', () => {
    panel.classList.remove('open');
    showPage('dashboard-page'); // or profile page if you have one
  });
}

/* ---------- Profile Modal (popup) ---------- */

function createProfileModalIfNeeded() {
  if (document.querySelector('.profile-modal')) return;

  const modal = document.createElement('div');
  modal.className = 'profile-modal';
  modal.innerHTML = `
    <div class="profile-modal-inner" role="dialog" aria-modal="true" aria-label="User Profile">
      <button class="pm-close" aria-label="Close">&times;</button>

      <div class="profile-top">
        <div class="avatar-wrapper">
          <img id="pm-avatar-img" src="${(getUser() && (getUser().avatar || getUser().photo)) || 'https://www.gravatar.com/avatar/?d=mp'}" alt="avatar">
          <label class="avatar-edit" title="Change avatar">
            <input id="pm-avatar-input" type="file" accept="image/*" style="display:none" />
            <i class="fas fa-pencil-alt"></i>
          </label>
        </div>
        <div class="profile-info">
          <div class="profile-name-row">
            <h3 id="pm-name-text">${(getUser() && getUser().name) || ''}</h3>
            <button id="pm-edit-name-btn" class="icon-btn" title="Edit name"><i class="fas fa-pencil-alt"></i></button>
          </div>
          <div class="profile-email"><strong>Email:</strong> <span id="pm-email-text">${(getUser() && getUser().email) || ''}</span></div>
        </div>
      </div>

      <div class="profile-actions">
        <button id="pm-save-btn" class="btn btn-primary">Save</button>
        <button id="pm-cancel-btn" class="btn btn-outline">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // event listeners
  modal.querySelector('.pm-close').addEventListener('click', closeProfileModal);
  modal.querySelector('#pm-cancel-btn').addEventListener('click', closeProfileModal);

  // file input preview (local preview + optional upload)
  const fileInput = modal.querySelector('#pm-avatar-input');
  const avatarImg = modal.querySelector('#pm-avatar-img');
  fileInput.addEventListener('change', (e) => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => avatarImg.src = ev.target.result;
    reader.readAsDataURL(file);
  });

  // edit name inline
  const editBtn = modal.querySelector('#pm-edit-name-btn');
  editBtn.addEventListener('click', () => {
    const nameEl = modal.querySelector('#pm-name-text');
    const cur = nameEl.textContent || '';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = cur;
    input.className = 'pm-name-input';
    nameEl.replaceWith(input);
    input.focus();

    // when user presses Enter or blurs, replace back
    input.addEventListener('blur', () => finishNameEdit(input));
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') input.blur();
      if (ev.key === 'Escape') { input.value = cur; input.blur(); }
    });
  });

  // Save button: if you have API for upload + update, do upload here; for now we update localStorage & UI
  modal.querySelector('#pm-save-btn').addEventListener('click', async () => {
    const newNameEl = document.querySelector('.pm-name-input');
    const newName = newNameEl ? newNameEl.value.trim() : modal.querySelector('#pm-name-text').textContent.trim();
    // Save to localStorage and update header UI
    const user = getUser() || {};
    if (newName) user.name = newName;
    // If an image file selected, optionally upload to server instead of localStorage.
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      // OPTIONAL: upload avatar file to your backend endpoint /api/auth/avatar (multipart/form-data)
      try {
        const form = new FormData();
        form.append('avatar', file);
        const token = localStorage.getItem('token');
        const res = await fetch('${API_BASE_URL}/api/auth/avatar', {
          method: 'POST',
          headers: token ? { 'Authorization': 'Bearer ' + token } : {},
          body: form
        });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          user.avatar = data.url; // server should return saved file url (e.g. /uploads/xxx)
        } else {
          // fallback: keep preview (already set) but warn user
          console.warn('Avatar upload failed', data);
        }
      } catch (err) {
        console.error('Avatar upload error', err);
      }
    }

    // persist locally
    localStorage.setItem('user', JSON.stringify(user));
    renderAuthUI();            // re-render header avatar + buttons
    closeProfileModal();
  });
}

function finishNameEdit(input) {
  const name = input.value.trim() || 'User';
  const h3 = document.createElement('h3');
  h3.id = 'pm-name-text';
  h3.textContent = name;
  input.replaceWith(h3);
}

function openProfileModal() {
  createProfileModalIfNeeded();
  const modal = document.querySelector('.profile-modal');
  if (modal) modal.classList.add('open');
  // populate up-to-date user values (in case changed)
  const user = getUser();
  if (user) {
    const img = document.getElementById('pm-avatar-img');
    if (img) img.src = user.avatar || user.photo || img.src;
    const nameEl = document.getElementById('pm-name-text');
    if (nameEl) nameEl.textContent = user.name || '';
    const emailEl = document.getElementById('pm-email-text');
    if (emailEl) emailEl.textContent = user.email || '';
  }
}

function closeProfileModal() {
  const modal = document.querySelector('.profile-modal');
  if (modal) modal.classList.remove('open');
}



function openChatPanel() {
  createChatPanelIfNeeded();
  const panel = document.querySelector('.chat-panel');
  if (panel) panel.classList.add('open');
}

function toggleChatPanel() {
  createChatPanelIfNeeded();
  const panel = document.querySelector('.chat-panel');
  if (!panel) return;
  panel.classList.toggle('open');
}

// initialize auth UI on load
document.addEventListener('DOMContentLoaded', () => {
  renderAuthUI();
});

// Also call renderAuthUI after any action that changes auth state
// Example: after successful login handler call setAuth(user, token);

// Load home page on initial load
document.addEventListener('DOMContentLoaded', function() {
    // Load the home page content
    loadPageContent('home-page');
    
    // Initialize page events
    initializePageEvents();
    
    // Initialize the first class accordion as open (for syllabus page)
    setTimeout(() => {
        const firstClassHeader = document.querySelector('.class-header');
        if (firstClassHeader) {
            firstClassHeader.classList.add('active');
            firstClassHeader.nextElementSibling.style.display = 'block';
        }
    }, 500);

});

// ================= DASHBOARD ROUTE HANDLER =================
document.addEventListener("page:loaded", (e) => {
  if (e.detail === "student-dashboard-page") {
    initStudentDashboard();
  }

  if (e.detail === "teacher-dashboard-page") {
    initTeacherDashboard();
  }
});

// --------- Enrollment Button Clicker -------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".enroll-btn");
  if (!btn) return;

  // ✅ LOGIN CHECK (ADD HERE)
  if (!localStorage.getItem("token")) {
  alert("Please login to enroll");
  showPage("login-page");
  return;
  }

  // ✅ AFTER LOGIN CONFIRMED
  const courseId = btn.dataset.courseId;
  const courseTitle = btn.dataset.courseTitle;

  console.log("Enroll clicked:", courseId, courseTitle);

  

  showPage("enrollment-page");
});

document.addEventListener("page:loaded", (e) => {
  const pageId = e.detail;

  if (pageId === "enrollment-page") {
    console.log("Enrollment page fully loaded");
    loadEnrollmentPage();
  }

  if (pageId === "dashboard-page") {
    loadDashboard();
  }
});

