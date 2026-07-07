document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Header Scroll Effect & Active Links
  // ==========================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Scroll background toggler
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlighting current section in nav
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Mobile Nav Menu Toggle
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
    
    // Rotate toggle effect
    if (navLinksContainer.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(span => span.style.transform = 'none');
      spans[1].style.opacity = '1';
    });
  });

  // ==========================================
  // 3. Portfolio Filters
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolio-grid');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all and add to this
      filterButtons.forEach(button => button.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      const cards = portfolioGrid.querySelectorAll('.portfolio-card');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Simple visual fade in
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 4. Custom Video Modal Player
  // ==========================================
  const modal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');
  const iframeContainer = document.getElementById('modal-iframe-container');

  // We functionize this so that newly dynamically added elements can also be hooked
  function bindVideoTriggers() {
    const videoTriggers = document.querySelectorAll('[data-video]');
    videoTriggers.forEach(trigger => {
      // Avoid duplicate binding
      if (trigger.dataset.bound) return;
      trigger.dataset.bound = "true";

      trigger.addEventListener('click', (e) => {
        // Prevent trigger from navigating or doing something else
        e.preventDefault();
        const videoUrl = trigger.getAttribute('data-video');
        openModal(videoUrl);
      });
    });
  }

  function openModal(url) {
    if (url.endsWith('.mp4') || url.includes('assets/')) {
      iframeContainer.innerHTML = `
        <video src="${url}" 
               controls 
               autoplay 
               playsinline
               style="width: 100%; height: 100%; object-fit: contain; background: #000;">
        </video>
      `;
    } else {
      let embedUrl = url;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
        } else if (url.includes('youtube.com/watch')) {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          videoId = urlParams.get('v');
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('youtube.com/embed/')[1].split(/[?#]/)[0];
        }
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else {
          embedUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
        }
      } else if (url.includes('instagram.com')) {
        let baseUrl = url.split('?')[0];
        if (!baseUrl.endsWith('/')) {
          baseUrl += '/';
        }
        embedUrl = baseUrl + 'embed/';
      }
      
      iframeContainer.innerHTML = `
        <iframe src="${embedUrl}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
      `;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock background scroll
    // Delay resetting iframe to avoid visual jarring during transition
    setTimeout(() => {
      iframeContainer.innerHTML = '';
    }, 400);
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    // If clicking the dark backdrop directly, close it
    if (e.target === modal) {
      closeModal();
    }
  });

  // Esc key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  bindVideoTriggers();



  // ==========================================
  // 6. Contact Form Simulation
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Save original button content
    const originalText = submitBtn.innerHTML;
    
    // Show spinner/sending state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Message...`;

    // Send actual data using fetch
    const formData = new FormData(contactForm);
    
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Success feedback state
        submitBtn.style.background = 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)'; // Success Green gradient
        submitBtn.style.color = '#fff';
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Message Sent Successfully!`;
        contactForm.reset();
      } else {
        throw new Error('Failed to send');
      }
    })
    .catch(error => {
      // Error feedback state
      submitBtn.style.background = 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'; // Error Red gradient
      submitBtn.style.color = '#fff';
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Failed to send. Try again!`;
      console.error('Error sending form:', error);
    })
    .finally(() => {
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.innerHTML = originalText;
      }, 3000);
    });
  });

  // ==========================================
  // 7. Interactive Portfolio Customizer
  // ==========================================
  const custBtn = document.getElementById('customizer-btn');
  const custPanel = document.getElementById('customizer-panel');
  const custForm = document.getElementById('customizer-form');

  // Toggle Customizer Panel
  custBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    custPanel.classList.toggle('active');
  });

  // Click outside panel closes it
  document.addEventListener('click', (e) => {
    if (!custPanel.contains(e.target) && e.target !== custBtn) {
      custPanel.classList.remove('active');
    }
  });

  custForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('c-title').value;
    const desc = document.getElementById('c-desc').value;
    const category = document.getElementById('c-category').value;
    const thumb = document.getElementById('c-thumb').value;
    const videoUrl = document.getElementById('c-video').value;

    // Convert category keyword to user-friendly label
    const categoryLabels = {
      'commercial': 'Ads & Commercials',
      'youtube': 'YouTube / Long Form',
      'shorts': 'TikTok & Reels',
      'motion': 'Motion Graphics'
    };
    const categoryLabel = categoryLabels[category] || 'Custom Style';

    // Create standard structure
    const newCard = document.createElement('div');
    newCard.className = 'portfolio-card';
    newCard.setAttribute('data-category', category);
    
    newCard.innerHTML = `
      <div class="portfolio-thumbnail" data-video="${videoUrl}">
        <img src="${thumb}" alt="${title}">
        <div class="portfolio-play-btn">
          <i class="fa-solid fa-play"></i>
        </div>
        <div class="portfolio-card-overlay">
          <span class="portfolio-category">${categoryLabel}</span>
          <h3 class="portfolio-card-title">${title}</h3>
          ${desc ? `<p class="portfolio-card-desc">${desc}</p>` : ''}
        </div>
      </div>
    `;

    // Add to top of grid
    portfolioGrid.insertBefore(newCard, portfolioGrid.firstChild);

    // Fade in animation for the new item
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.9)';
    setTimeout(() => {
      newCard.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      newCard.style.opacity = '1';
      newCard.style.transform = 'scale(1)';
    }, 50);

    // Re-bind click event to newly created elements
    bindVideoTriggers();

    // Reset, close panel and notify
    custForm.reset();
    custPanel.classList.remove('active');

    // Show a small beautiful temporary alert banner
    const alertBanner = document.createElement('div');
    alertBanner.style.cssText = `
      position: fixed;
      top: 100px;
      right: 24px;
      background: linear-gradient(135deg, #00f2fe 0%, #9b51e0 100%);
      color: #000;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,242,254,0.3);
      z-index: 9999;
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    alertBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> "${title}" added to showcase!`;
    document.body.appendChild(alertBanner);

    setTimeout(() => {
      alertBanner.style.transform = 'translateY(0)';
      alertBanner.style.opacity = '1';
    }, 100);

    setTimeout(() => {
      alertBanner.style.transform = 'translateY(-20px)';
      alertBanner.style.opacity = '0';
      setTimeout(() => {
        alertBanner.remove();
      }, 400);
    }, 3000);
  });
  
});
