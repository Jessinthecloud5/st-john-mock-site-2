/* 
 * St. John Presbyterian Church - Main JS Script
 * Manages sticky navigation, hamburger drawer, accordions, video controls, prayer request form, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initAccordions();
  initFooterAccordions();
  initVideoPlayers();
  initModalForms();
  initScrollAnimations();
});

/* --- 1. Sticky Header --- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // run on load
}

/* --- 2. Mobile Menu Drawer --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !drawer || !overlay) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    drawer.classList.toggle('open');
    overlay.classList.toggle('visible');
    
    // Toggle body scroll lock
    if (drawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* --- 3. Accordions (FAQs & Beliefs) --- */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      
      // Check if item is already active
      const isActive = item.classList.contains('active');

      // Close all other accordion items in this group
      const group = item.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = '0px';
          }
        });
      }

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* --- 4. Mobile Footer Accordions --- */
function initFooterAccordions() {
  const footerHeaders = document.querySelectorAll('.footer-accordion-header');

  footerHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const col = header.parentElement;
      const content = header.nextElementSibling;
      const isActive = col.classList.contains('active');

      // Close other footer accordions
      document.querySelectorAll('.footer-col-nav, .footer-col-info, .footer-col-times, .footer-col-give').forEach(otherCol => {
        if (otherCol !== col) {
          otherCol.classList.remove('active');
          const otherContent = otherCol.querySelector('.footer-accordion-content');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      // Toggle current
      if (isActive) {
        col.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        col.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Reset max-height properties if browser is resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 580) {
      document.querySelectorAll('.footer-accordion-content').forEach(content => {
        content.style.maxHeight = '';
      });
      document.querySelectorAll('.footer-col-nav, .footer-col-info, .footer-col-times, .footer-col-give').forEach(col => {
        col.classList.remove('active');
      });
    }
  });
}

/* --- 5. Interactive Video Player --- */
function initVideoPlayers() {
  const playButtonCenter = document.querySelector('.video-play-center');
  const playButtonCtrl = document.querySelector('.video-control-left .video-icon-btn');
  const timeline = document.querySelector('.video-timeline-wrap');
  const timelineBar = document.querySelector('.video-timeline-bar');
  const timeText = document.querySelector('.video-time');
  const videoBadge = document.querySelector('.video-badge');

  if (!playButtonCenter) return;

  let isPlaying = false;
  let timerId = null;
  let currentSeconds = 0;
  const durationSeconds = 2730; // 45:30 in seconds

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(remainingSecs)}`;
  };

  const updateTimeline = () => {
    currentSeconds += 1;
    if (currentSeconds >= durationSeconds) {
      currentSeconds = 0;
      pauseVideo();
    }
    
    // Update text
    if (timeText) {
      timeText.textContent = `${formatTime(currentSeconds)} / ${formatTime(durationSeconds)}`;
    }

    // Update timeline percentage
    const pct = (currentSeconds / durationSeconds) * 100;
    if (timelineBar) {
      timelineBar.style.width = `${pct}%`;
    }
  };

  const playVideo = () => {
    isPlaying = true;
    
    // Update icons to Pause
    const pauseSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;
    
    if (playButtonCenter) {
      playButtonCenter.innerHTML = pauseSvg;
      playButtonCenter.style.opacity = '0'; // Hide center play button when playing (standard video player look)
    }
    
    if (playButtonCtrl) {
      playButtonCtrl.innerHTML = pauseSvg;
    }

    if (videoBadge) {
      videoBadge.textContent = "Facebook Livestream (Playing)";
    }

    // Start counter
    timerId = setInterval(updateTimeline, 1000);
  };

  const pauseVideo = () => {
    isPlaying = false;
    
    // Update icons to Play
    const playSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;

    if (playButtonCenter) {
      playButtonCenter.innerHTML = playSvg;
      playButtonCenter.style.opacity = '1';
    }

    if (playButtonCtrl) {
      playButtonCtrl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
    }

    if (videoBadge) {
      videoBadge.textContent = "Facebook Livestream (Paused)";
    }

    // Stop counter
    clearInterval(timerId);
  };

  const toggleVideo = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  playButtonCenter.addEventListener('click', toggleVideo);
  if (playButtonCtrl) playButtonCtrl.addEventListener('click', toggleVideo);
  
  // Make the entire screen clickable to play/pause
  const screen = document.querySelector('.video-screen');
  if (screen) {
    screen.addEventListener('click', toggleVideo);
  }

  // Click on timeline to seek
  if (timeline) {
    timeline.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = timeline.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      
      currentSeconds = percentage * durationSeconds;
      
      if (timelineBar) timelineBar.style.width = `${percentage * 100}%`;
      if (timeText) timeText.textContent = `${formatTime(currentSeconds)} / ${formatTime(durationSeconds)}`;
      
      if (!isPlaying) {
        playVideo();
      }
    });
  }
}

/* --- 6. Modal Dialogs & Toasts (Prayer Requests / General Contacts) --- */
function initModalForms() {
  const modalTriggers = document.querySelectorAll('[data-open-modal="prayer"]');
  const modalOverlay = document.getElementById('prayer-modal');
  const modalClose = document.querySelector('.modal-close');
  const form = document.getElementById('prayer-request-form');

  if (!modalOverlay) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Handle Prayer Request submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get inputs
      const name = document.getElementById('prayer-name').value;
      const request = document.getElementById('prayer-content').value;

      if (!request.trim()) return;

      // Disable button, simulate sending
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Submitting...";
      btn.disabled = true;

      setTimeout(() => {
        // Reset
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        closeModal();

        // Show Toast Notification
        showToast("Prayer Request Received", `Thank you ${name || "friend"}, we have added your request to our prayer list.`);
      }, 1200);
    });
  }
  
  // Connect regular page forms too if they exist
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value;
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;
      
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        showToast("Message Sent", `Thank you ${name || "friend"}, we will get back to you as soon as possible.`);
      }, 1200);
    });
  }
}

function showToast(title, message) {
  let toast = document.getElementById('toast-notification');
  
  if (!toast) {
    // Dynamically create toast if not present
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div class="toast-text">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  // Animate show
  setTimeout(() => toast.classList.add('show'), 100);

  // Hide toast after 4s
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --- 7. Scroll Fade-In Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-element');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport completely
  });

  elements.forEach(element => {
    observer.observe(element);
  });
}
