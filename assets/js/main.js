/**
 * Verra Project Hub Documentation - Main JavaScript
 * Enhanced functionality matching ProjectHub frontend experience
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main initialization function
 */
function initializeApp() {
    setupScrollAnimations();
    setupNavigationHighlighting();
    setupResponsiveFeatures();
    setupPerformanceOptimizations();
    console.log('Verra Project Hub Documentation initialized successfully');
}

/**
 * Enhanced scroll animations with intersection observer
 */
function setupScrollAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    // Optional: Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for older browsers
        handleScrollAnimationsFallback();
    }
}

/**
 * Fallback animation handler for older browsers
 */
function handleScrollAnimationsFallback() {
    function animateOnScroll() {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionVisible = (sectionTop < windowHeight - 100);
            
            if (sectionVisible) {
                section.classList.add('fade-in-up');
            }
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    animateOnScroll(); // Initial check
}

/**
 * Active navigation highlighting based on scroll position
 */
function setupNavigationHighlighting() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100; // Offset for fixed header
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('nav-active'));
                
                // Add active class to corresponding nav item
                const correspondingNavItem = Array.from(navItems).find(item => {
                    const onclick = item.getAttribute('onclick');
                    return onclick && onclick.includes(section.id);
                });
                
                if (correspondingNavItem) {
                    correspondingNavItem.classList.add('nav-active');
                }
            }
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    updateActiveNavigation(); // Initial check
}

/**
 * Enhanced smooth scrolling with easing
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (!element) return;
    
    const headerHeight = window.innerWidth <= 768 ? 70 : 80;
    const targetPosition = element.offsetTop - headerHeight;
    
    // Smooth scroll with custom easing
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) * 0.5, 800); // Dynamic duration
    let startTime = null;
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easedProgress = easeInOutQuad(progress);
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
    
    // Update URL without triggering scroll
    if (history.pushState) {
        history.pushState(null, null, '#' + sectionId);
    }
}

/**
 * Responsive features and mobile optimizations
 */
function setupResponsiveFeatures() {
    // Mobile navigation toggle (if needed in future)
    let isMenuOpen = false;
    
    // Handle window resize
    function handleResize() {
        // Recalculate positions and update animations
        if (window.innerWidth <= 768) {
            // Mobile-specific optimizations
            document.body.classList.add('mobile-view');
        } else {
            document.body.classList.remove('mobile-view');
        }
    }
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
    
    handleResize(); // Initial check
}

/**
 * Performance optimizations
 */
function setupPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = [
        'https://verra.org/wp-content/themes/verra/images/verra-logo-color.svg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Lazy load non-critical content
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Utility function for analytics (matching ProjectHub structure)
 */
function trackEvent(action, category = 'Documentation', label = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

/**
 * Enhanced error handling
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // Could implement error reporting here
});

/**
 * Service worker registration for PWA capabilities (future enhancement)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration could be added here for offline functionality
    });
}

// Expose functions globally for onclick handlers
window.scrollToSection = scrollToSection;
window.trackEvent = trackEvent;