// Scroll-triggered Animation Script
document.addEventListener("DOMContentLoaded", () => {
    const animatedSections = document.querySelectorAll(
      ".about-section, .features-section, .featured-courses, .learning-paths, .stats-section, .instructors, .achievements, .events, .success-stories, .testimonials-section, .faq, .newsletter, .syllabus-section, .contact-content, .blog-grid, footer"
    );
  
    // Random animation classes for variety
    const animations = ["fade-up", "slide-left", "slide-right", "zoom-in"];
  
    animatedSections.forEach((section, index) => {
      section.dataset.anim = animations[index % animations.length];
      section.classList.add("hidden-section");
    });
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animType = entry.target.dataset.anim;
            entry.target.classList.add("animate-" + animType);
            entry.target.classList.remove("hidden-section");
  
            // re-trigger animation every time visible again
            entry.target.style.animation = "none";
            entry.target.offsetHeight; // reflow
            entry.target.style.animation = "";
          } else {
            entry.target.classList.remove(
              "animate-fade-up",
              "animate-slide-left",
              "animate-slide-right",
              "animate-zoom-in"
            );
            entry.target.classList.add("hidden-section");
          }
        });
      },
      { threshold: 0.2 }
    );
  
    animatedSections.forEach((section) => observer.observe(section));
  });
  
  // Add these new keyframes for page transitions
  const style = document.createElement('style');
  style.textContent = `
      @keyframes fadeOut {
          from {
              opacity: 1;
              transform: translateY(0);
          }
          to {
              opacity: 0;
              transform: translateY(20px);
          }
      }
      
      @keyframes fadeIn {
          from {
              opacity: 0;
              transform: translateY(20px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }
  `;
  document.head.appendChild(style);