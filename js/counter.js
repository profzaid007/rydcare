/**
 * Animated Counter - Scroll-triggered number animations
 * Progressive Enhancement: Shows static numbers without JS
 */

// Format number with suffixes (M, K, etc.)
function formatNumber(num, target) {
    const original = target.toString();
    
    // Check if original has special formatting
    if (original.includes('M+')) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (original.includes('K+')) {
        return (num / 1000).toFixed(0) + 'K+';
    } else if (original.includes('★')) {
        return num.toFixed(1) + '★';
    } else if (original.includes('+')) {
        return num + '+';
    }
    
    return num.toLocaleString();
}

// Animate counter from 0 to target value
function animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (target - startValue) * easeOut;
        
        element.textContent = formatNumber(Math.floor(current), target);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatNumber(target, target);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize counter animations with Intersection Observer
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    // Track which counters have already been animated
    const animated = new Set();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                const target = parseFloat(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                animated.add(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% visible
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
} else {
    initCounters();
}
