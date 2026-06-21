function openPolicyModal(id) {
      document.getElementById(id).classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closePolicyModal(id) {
      document.getElementById(id).classList.remove('active');
      document.body.style.overflow = '';
    }


    // ─── SCROLL EVENTS & NAVBAR BACKGROUND ───
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── MOBILE DRAWER (MENU) ───
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('drawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawerLink');

    function openDrawer() {
      drawerOverlay.classList.add('overlayOpen');
      drawer.classList.add('drawerOpen');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawerOverlay.classList.remove('overlayOpen');
      drawer.classList.remove('drawerOpen');
      document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', openDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // ─── LIVE TIME IN MOCKUPS ───
    function updateMockupTime() {
      const timeElements = document.querySelectorAll('.mockupTime');
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      timeElements.forEach(el => el.textContent = `${hours}:${minutes}`);
    }
    updateMockupTime();
    setInterval(updateMockupTime, 1000);

    // ─── ANIMS ON INTERSECTION ───
    const scrollAnimateElements = document.querySelectorAll('.animateOnScroll');
    
    // Inject styles to override inline styles during scroll animation
    const animStyle = document.createElement('style');
    animStyle.innerHTML = `
      .serviceGridCard.animateOnScroll {
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      .serviceGridCard:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
      }
      .serviceGridCard:hover img {
        transform: scale(1.05) !important;
        transition: transform 0.3s ease !important;
      }
      .serviceGridCard img {
        transition: transform 0.3s ease !important;
      }
    `;
    document.head.appendChild(animStyle);

    // Add staggered transition delays for grid cards
    const fleetCards = document.querySelectorAll('.servicesGridContainer .serviceGridCard');
    fleetCards.forEach((card, index) => {
      // 4 columns on desktop, so stagger 0,1,2,3, 0,1,2,3
      card.style.transitionDelay = `${(index % 4) * 0.15}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Clean up animation classes after it completes to allow smooth hover effects
          setTimeout(() => {
            if(entry.target.style.transitionDelay) {
              entry.target.style.transitionDelay = '0s';
            }
            if(entry.target.classList.contains('serviceGridCard')) {
              entry.target.classList.remove('animateOnScroll');
              // Set opacity permanently to 1 just in case
              entry.target.style.opacity = '1';
            }
          }, 1000);
        }
      });
    }, { threshold: 0.1 });

    scrollAnimateElements.forEach(el => observer.observe(el));

    // ─── SERVICES 3D CAROUSEL LOGIC ───
    const serviceCards = Array.from(document.querySelectorAll('.serviceCard'));
    const prevBtn = document.getElementById('prevServiceBtn');
    const nextBtn = document.getElementById('nextServiceBtn');
    let activeCarouselIndex = 0;

    function renderCarousel() {
      serviceCards.forEach((card, index) => {
        // Reset classes
        card.className = 'serviceCard';
        card.style.transform = ''; // Clear any inline styles from offscreen state

        if (index === activeCarouselIndex) {
          card.classList.add('cardCenter');
        } else if (index === activeCarouselIndex - 1 || (activeCarouselIndex === 0 && index === serviceCards.length - 1)) {
          card.classList.add('cardLeft');
        } else if (index === activeCarouselIndex + 1 || (activeCarouselIndex === serviceCards.length - 1 && index === 0)) {
          card.classList.add('cardRight');
        } else {
          // Offscreen
          if (index < activeCarouselIndex) {
            card.style.transform = 'translateX(-120%) scale(0.75)';
          } else {
            card.style.transform = 'translateX(120%) scale(0.75)';
          }
        }
      });
    }

    prevBtn.addEventListener('click', () => {
      activeCarouselIndex = activeCarouselIndex === 0 ? serviceCards.length - 1 : activeCarouselIndex - 1;
      renderCarousel();
    });

    nextBtn.addEventListener('click', () => {
      activeCarouselIndex = activeCarouselIndex === serviceCards.length - 1 ? 0 : activeCarouselIndex + 1;
      renderCarousel();
    });

    serviceCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        activeCarouselIndex = index;
        renderCarousel();
      });
    });

    renderCarousel();

    // ─── DYNAMIC FOOTER YEARS ───
    const yr = new Date().getFullYear();
    document.getElementById('currentYear').textContent = yr;
    document.getElementById('currentYearDesktop').textContent = yr;
  

    // Counter Animation for Trust Numbers
    document.addEventListener("DOMContentLoaded", () => {
      const counters = document.querySelectorAll('.countUp');
      const speed = 50;
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const updateCount = () => {
              const current = +entry.target.innerText;
              const inc = Math.max(1, Math.ceil(target / speed));
              if (current < target) {
                entry.target.innerText = current + inc;
                setTimeout(updateCount, 30);
              } else {
                entry.target.innerText = target;
              }
            };
            updateCount();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(counter => observer.observe(counter));
    });