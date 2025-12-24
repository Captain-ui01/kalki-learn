function initMedicalCourse() {
    console.log('Medical Coding JS initialized');
        document.addEventListener('DOMContentLoaded', function() {
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                document.querySelector('.progress-bar').style.width = scrolled + '%';
            });
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.curriculum-module').forEach(module => observer.observe(module));
            
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
                
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Enrollment Successful!';
                this.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                this.style.animation = 'none';
                
                createConfetti();
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                    this.style.animation = 'glow 2s infinite';
                }, 3000);
            });
            
            function createConfetti() {
                const colors = ['#e74c3c', '#c0392b', '#2ecc71', '#3498db', '#f39c12'];
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
            
            const modules = document.querySelectorAll('.curriculum-module');
            modules.forEach((module, index) => {
                module.style.setProperty('--module-index', index);
                module.querySelectorAll('li').forEach((li, liIndex) => {
                    li.style.setProperty('--li-index', liIndex);
                });
            });
            
            const techItems = document.querySelectorAll('.tech-item');
            techItems.forEach((item, index) => item.style.setProperty('--tech-index', index));
            
            const navLinks = document.querySelectorAll('.course-nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });
}        

// Run on normal load
document.addEventListener('DOMContentLoaded', initMedicalCourse);

// Run when SPA loads this page
document.addEventListener('page:loaded', (e) => {
  if (e.detail === 'medicalcoding-page') {
    initMedicalCourse()
    ;
  }
});

document.addEventListener('page:loaded', (e) => {
  console.log('page:loaded fired →', e.detail);
});
