function initRoboticsCourse() {
        document.addEventListener('DOMContentLoaded', function() {
            // Progress bar
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                document.querySelector('.progress-bar').style.width = scrolled + '%';
            });
            
            // Scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.curriculum-module').forEach(module => observer.observe(module));
            
            // Ripple effect for enrollment button
            const enrollButton = document.querySelector('.btn-enroll');
            enrollButton.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
                
                // Change button text and style temporarily
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Enrollment Successful!';
                this.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                this.style.animation = 'none';
                
                // Create confetti
                createConfetti();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                    this.style.animation = 'glow 2s infinite';
                }, 3000);
            });
            
            function createConfetti() {
                const colors = ['#3498db', '#2980b9', '#2ecc71', '#f1c40f', '#e74c3c'];
                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.width = Math.random() * 15 + 5 + 'px';
                    confetti.style.height = Math.random() * 15 + 5 + 'px';
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 7000);
                }
            }
            
            // Typing effect for course title
            const courseTitle = document.querySelector('.section-title h2');
            const originalText = courseTitle.textContent;
            courseTitle.textContent = '';
            courseTitle.classList.add('typing-text');
            
            let i = 0;
            function typeWriter() {
                if (i < originalText.length) {
                    courseTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    courseTitle.classList.remove('typing-text');
                    courseTitle.style.borderRight = 'none';
                }
            }
            setTimeout(typeWriter, 1000);
            
            // Set custom properties for animations
            const modules = document.querySelectorAll('.curriculum-module');
            modules.forEach((module, index) => {
                module.style.setProperty('--module-index', index);
                module.querySelectorAll('li').forEach((li, liIndex) => {
                    li.style.setProperty('--li-index', liIndex);
                });
            });
            
            const techItems = document.querySelectorAll('.tech-item');
            techItems.forEach((item, index) => item.style.setProperty('--tech-index', index));
            
            // Navigation active state
            const navLinks = document.querySelectorAll('.course-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Robot animation enhancement
            const robotIcon = document.querySelector('.robot-icon');
            robotIcon.addEventListener('mouseover', () => {
                robotIcon.style.animation = 'robot-move 0.5s infinite ease-in-out';
            });
            robotIcon.addEventListener('mouseout', () => {
                robotIcon.style.animation = 'robot-move 3s infinite ease-in-out';
            });
        });
}        

// Run on normal load
document.addEventListener('DOMContentLoaded', initRoboticsCourse);

// Run when SPA loads this page
document.addEventListener('page:loaded', (e) => {
  if (e.detail === 'robotics-page') {
    initRoboticsCourse();
  }
});        
