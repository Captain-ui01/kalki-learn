// Instructor Slider Navigation
const track = document.querySelector('.instructors-track');
const cards = document.querySelectorAll('.instructor-card');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (track && cards.length > 0) {
    let index = 0;
    let cardWidth = cards[0].offsetWidth + 25;
    const total = cards.length;
    const visible = 4;

    nextBtn.addEventListener('click', () => {
        index++;
        if (index > total - visible) index = 0; // loop back
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    });

    prevBtn.addEventListener('click', () => {
        index--;
        if (index < 0) index = total - visible; // loop to end
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    });

    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + 25;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    });
}

// Testimonial Slider
(function(){
    const track = document.querySelector('.testimonial-track');
    if (!track) return;

    // Grab original children and clone to make seamless loop
    const originals = Array.from(track.children);
    const cloneCount = 1; // append one clone set
    for (let i=0;i<cloneCount;i++){
        originals.forEach(node => track.appendChild(node.cloneNode(true)));
    }

    // settings
    let speed = 0.4; // pixels per frame (adjust for faster/slower)
    let x = 0;
    let isPaused = false;
    let rafId = null;
    const gap = parseFloat(getComputedStyle(track).gap) || 30;

    // compute total width of one original set
    function computeWidths(){
        const children = Array.from(track.children);
        // total width of first originalCount items
        const origCount = originals.length;
        let total = 0;
        for (let i=0;i<origCount;i++){
            const w = children[i].getBoundingClientRect().width;
            total += w + gap;
        }
        // subtract final gap
        total -= gap;
        return { totalSetWidth: total, cardWidths: children.slice(0,origCount).map(c => c.getBoundingClientRect().width) };
    }

    let { totalSetWidth, cardWidths } = computeWidths();

    // update on resize (recompute widths)
    window.addEventListener('resize', () => {
        ({ totalSetWidth, cardWidths } = computeWidths());
    });

    // animation loop
    function step(){
        if (!isPaused) {
            x -= speed;
            // wrap when we've scrolled past one set
            if (Math.abs(x) >= totalSetWidth) {
                x += totalSetWidth;
            }
            track.style.transform = `translateX(${x}px)`;
        }
        rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    // Pause on hover
    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { isPaused = false; });

    // Arrow controls: smooth shift by one card
    const nextBtn = document.querySelector('.testimonial-btn.next');
    const prevBtn = document.querySelector('.testimonial-btn.prev');

    // calculate a "shift" equal to the visible first card width + gap
    function getShiftAmount(direction = 'next') {
        const base = cardWidths && cardWidths.length ? cardWidths[0] : (track.children[0]?.getBoundingClientRect().width || 300);
        return (direction === 'next') ? (base + gap) : -(base + gap);
    }

    // Animate to target x over duration ms
    function animateShift(delta, duration = 360) {
        isPaused = true;
        const startX = x;
        const target = x + delta;
        const startTime = performance.now();

        return new Promise(resolve => {
            function animate(time){
                const t = Math.min(1, (time - startTime) / duration);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - t, 3);
                x = startX + (target - startX) * eased;
                // wrap handling to keep x within [-totalSetWidth, 0]
                if (x < -totalSetWidth) x += totalSetWidth;
                if (x > 0) x -= totalSetWidth;
                track.style.transform = `translateX(${x}px)`;
                if (t < 1) requestAnimationFrame(animate);
                else {
                    setTimeout(() => { isPaused = false; resolve(); }, 150);
                }
            }
            requestAnimationFrame(animate);
        });
    }

    nextBtn.addEventListener('click', () => {
        const shift = -getShiftAmount('next');
        animateShift(shift);
    });

    prevBtn.addEventListener('click', () => {
        const shift = -getShiftAmount('prev');
        animateShift(shift);
    });
})();