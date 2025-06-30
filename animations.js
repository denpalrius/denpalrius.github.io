/*─────────────────────────────────────────────────────────────────────────────
  ANIMATION JAVASCRIPT HOOKS
─────────────────────────────────────────────────────────────────────────────*/

document.addEventListener('DOMContentLoaded', () => {
  
  /*─────────────────────────────────────────────────────────────────────────────
    INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
  ─────────────────────────────────────────────────────────────────────────────*/
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Unobserve after animation to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe section headings
  document.querySelectorAll('section h2').forEach(heading => {
    observer.observe(heading);
  });

  // Observe timeline items with staggered delay
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    // Add a small delay for staggered effect
    item.style.transitionDelay = `${index * 100}ms`;
    observer.observe(item);
  });

  /*─────────────────────────────────────────────────────────────────────────────
    THEME TOGGLE ROTATION ANIMATION
  ─────────────────────────────────────────────────────────────────────────────*/
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      themeToggle.classList.add('rotating');
      
      // Remove the class after animation completes
      setTimeout(() => {
        themeToggle.classList.remove('rotating');
      }, 400);
    });
  }

  /*─────────────────────────────────────────────────────────────────────────────
    SMOOTH SCROLL ENHANCEMENT
  ─────────────────────────────────────────────────────────────────────────────*/
  
  // Enhanced smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        const navbar = document.querySelector('.navbar');
        
        if (targetElement && navbar) {
          e.preventDefault();
          
          const offsetTop = targetElement.offsetTop - navbar.offsetHeight - 20;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /*─────────────────────────────────────────────────────────────────────────────
    PERFORMANCE OPTIMIZATION
  ─────────────────────────────────────────────────────────────────────────────*/
  
  // Debounce scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      // Any scroll-based animations can be added here
    }, 10);
  });

  /*─────────────────────────────────────────────────────────────────────────────
    PRELOAD CRITICAL ANIMATIONS
  ─────────────────────────────────────────────────────────────────────────────*/
  
  // Ensure hero animations start immediately
  const heroElements = document.querySelectorAll('.landing-img, .landing h1, .landing .subtitle, .landing .description, .action-buttons, .social-icons');
  heroElements.forEach(element => {
    element.style.willChange = 'transform, opacity';
  });

  // Clean up will-change after animations complete
  setTimeout(() => {
    heroElements.forEach(element => {
      element.style.willChange = 'auto';
    });
  }, 1500);

  /*─────────────────────────────────────────────────────────────────────────────
    ACCESSIBILITY ENHANCEMENTS
  ─────────────────────────────────────────────────────────────────────────────*/
  
  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }

  // Listen for changes in motion preference
  prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  });

});