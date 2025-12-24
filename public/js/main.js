// main.js (safe, guarded version)

// Enhanced Page Navigation with Transitions
function showPage(pageId) {
    // Get current active page
    const currentPage = document.querySelector('.page.active-page');
    const nextPage = document.getElementById(pageId);

    if (!nextPage) {
        console.error(`showPage: Page element with id "${pageId}" not found in DOM.`);
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

            // Show the selected page with fade in animation
            nextPage.classList.add('active-page');
            nextPage.style.animation = 'fadeIn 0.5s ease-out forwards';

            // Update mobile bottom nav active state
            document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            // Close mobile menu if open
            const mainNav = document.getElementById('main-nav');
            if (mainNav) mainNav.classList.remove('active');

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
        nextPage.classList.add('active-page');
        nextPage.style.animation = 'fadeIn 0.5s ease-out forwards';
    }
}

async function loadDashboard(path) {
  const container = document.getElementById('app-content');
  if (!container) return;

  try {
    const res = await fetch(path);
    const html = await res.text();
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<h2>Failed to load dashboard</h2>';
  }
}

// Dropdown Menu - Fixed Version
function toggleDropdown(event) {
    event.preventDefault();
    const dropdown = event.target.closest('.dropdown');
    if (!dropdown) return;

    // Close all other dropdowns first
    document.querySelectorAll('.dropdown').forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
        }
    });

    // Toggle the current dropdown
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Close dropdown when a course is selected (guarded)
document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
        const dropdown = this.closest('.dropdown');
        if (dropdown) dropdown.classList.remove('active');
    });
});

// Enhanced Mobile Menu (guarded)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;
        nav.classList.toggle('active');
        this.classList.toggle('active');

        // Animate hamburger icon
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
            this.style.transform = 'rotate(180deg)';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
            this.style.transform = 'rotate(0deg)';
        }
    });
}

// Close mobile menu when clicking on links (guarded)
document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', function() {
        const mainNavBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        if (mainNav) mainNav.classList.remove('active');
        if (mainNavBtn) {
            mainNavBtn.classList.remove('active');
            mainNavBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mainNavBtn.style.transform = 'rotate(0deg)';
        }
    });
});

// FAQ Accordion (safe loop)
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Course Card Click (guarded)
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', function() {
        const coursePage = this.getAttribute('data-course');
        if (coursePage) showPage(coursePage);
    });
});

// Syllabus Accordion (guarded)
document.querySelectorAll('.class-header').forEach(header => {
    header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // Close all accordions safely
        document.querySelectorAll('.class-header').forEach(h => {
            h.classList.remove('active');
            const nxt = h.nextElementSibling;
            if (nxt) nxt.style.display = 'none';
        });

        // Open clicked accordion if it wasn't active
        if (!isActive) {
            this.classList.add('active');
            if (content) content.style.display = 'block';
        }
    });
});

// Syllabus Card Toggle (guarded)
document.querySelectorAll('.syllabus-title').forEach(title => {
    title.addEventListener('click', function() {
        const details = this.nextElementSibling;
        // Toggle current card
        this.classList.toggle('active');

        if (this.classList.contains('active')) {
            if (details) details.style.display = 'block';
        } else {
            if (details) details.style.display = 'none';
        }
    });
});

// Welcome Overlay (guarded)
const welcomeBtn = document.getElementById('welcome-enter');
if (welcomeBtn) {
    welcomeBtn.addEventListener('click', function() {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        }
    });
}

// Enhanced animations for elements when they come into view
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
// Initial call to check elements already in view
revealOnScroll();

// Initialize the first class accordion as open (guarded)
const firstClassHeader = document.querySelector('.class-header');
if (firstClassHeader) {
    firstClassHeader.classList.add('active');
    const sibling = firstClassHeader.nextElementSibling;
    if (sibling) sibling.style.display = 'block';
}

// Add bounce-in animation to elements (guarded)
document.querySelectorAll('.course-card, .path-card, .instructor-card').forEach((card, index) => {
    card.classList.add('bounce-in');
    card.style.animationDelay = `${index * 0.1}s`;
});

// Form validation for login/signup - this is a global fallback.
// If you attach more specific handlers (signup/login in main-2.js) they will run instead.
/*document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Default snippet - real form handlers are in other modules/JS (main-2.js)
        // Keep this basic alert only for forms that don't have custom handlers
        if (!form.dataset.hasCustomHandler) {
            alert('Form submitted! In a real application, this would send data to a server.');
        }
    });
});*/

// Enhanced mobile navigation (guarded)
document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.mobile-bottom-nav .nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Scroll Progress Indicator (guarded)
window.addEventListener('scroll', function() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const denom = (docHeight - winHeight) || 1;
    const scrollPercent = (scrollTop / denom) * 100;
    bar.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
});

// Course card navigation (Home page)
document.addEventListener('click', function (e) {
    const card = e.target.closest('.course-card');
    if (!card) return;

    const pageId = card.getAttribute('data-course');
    if (!pageId) return;

    // Close welcome overlay if visible
    const welcome = document.getElementById('welcome-overlay');
    if (welcome) {
        welcome.style.display = 'none';
    }

    showPage(pageId);
});

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('welcome-overlay');
  const hasVisited = sessionStorage.getItem('kalkiVisited');

  if (hasVisited) {
    overlay.style.display = 'none';
  } else {
    document.getElementById('welcome-enter').addEventListener('click', () => {
      overlay.style.display = 'none';
      sessionStorage.setItem('kalkiVisited', 'true');
    });
  }
});


