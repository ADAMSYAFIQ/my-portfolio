// ==========================================================================
// 1. CYBERPUNK SYSTEM PRELOADER & TERMINAL BOOT SEQUENCE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const statusText = document.getElementById('statusText');

    if (!preloader) return;

    window.scrollTo(0, 0);
    document.body.classList.add('preloader-active');

    const bootMessages = [
        "INITIALIZING KERNEL...",
        "DECRYPTING ARCHIVES...",
        "LOADING DATABASE NODES...",
        "ESTABLISHING TELEMETRY LINK...",
        "SYSTEM ONLINE // READ-ONLY ACCESS"
    ];

    let progress = 0;
    let messageIndex = 0;

    const finishPreloader = () => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloader-active');
    };

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 5; // Dynamic progress increments

        if (progress >= 100) {
            progress = 100;
            if (progressBar) progressBar.style.width = '100%';
            if (progressPercent) progressPercent.textContent = '100%';
            if (statusText) statusText.textContent = bootMessages[bootMessages.length - 1];

            clearInterval(interval);

            // Smoothly dissolve preloader after reaching 100%
            setTimeout(finishPreloader, 300);
        } else {
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressPercent) progressPercent.textContent = `${progress}%`;

            // Cycle status messages as progress increases
            const targetMsgIndex = Math.floor((progress / 100) * (bootMessages.length - 1));
            if (targetMsgIndex !== messageIndex && bootMessages[targetMsgIndex]) {
                messageIndex = targetMsgIndex;
                if (statusText) statusText.textContent = bootMessages[messageIndex];
            }
        }
    }, 80);
});

// ==========================================================================
// 1B. RESPONSIVE MOBILE NAVIGATION TOGGLE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!menuToggle || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('nav-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});

// ==========================================================================
// 2. COMMENTS PAGE: Form Submission Handling
// ==========================================================================
function handleFormSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const alertBox = document.getElementById('formAlert');

    if (nameInput && alertBox) {
        const name = nameInput.value.trim();
        alertBox.className = "alert-box success";
        alertBox.textContent = `Transmission received! Thank you for your feedback, ${name || 'Visitor'}.`;
        alertBox.style.display = "block";
        document.getElementById('feedbackForm').reset();
    }
}

// ==========================================================================
// 3. PORTFOLIO PAGE: Independent Multi-Carousel Logic
// ==========================================================================
function moveSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    let activeIndex = 0;
    items.forEach((item, index) => {
        if (item.classList.contains('active')) {
            activeIndex = index;
            item.classList.remove('active');
        }
    });

    const newIndex = (activeIndex + direction + items.length) % items.length;
    items[newIndex].classList.add('active');
}

// ==========================================================================
// 4. PORTFOLIO PAGE: Lightbox Modal with Full-Screen Carousel Controls
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const captionText = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!modal) return;

    let currentImages = [];
    let currentIndex = 0;

    // Attach click triggers to all images with class 'lightbox-trigger'
    document.querySelectorAll('.lightbox-trigger').forEach(img => {
        img.addEventListener('click', function() {
            const parentContainer = this.closest('.cyber-carousel') || this.closest('.poster-gallery');

            if (parentContainer) {
                currentImages = Array.from(parentContainer.querySelectorAll('.lightbox-trigger'));
            } else {
                currentImages = [this];
            }

            currentIndex = currentImages.indexOf(this);
            if (currentIndex === -1) currentIndex = 0;

            updateLightboxImage();
            modal.style.display = "block";
        });
    });

    function updateLightboxImage() {
        if (currentImages.length === 0) return;
        const targetImg = currentImages[currentIndex];
        modalImg.src = targetImg.src;
        captionText.innerHTML = targetImg.alt || `Image ${currentIndex + 1} of ${currentImages.length}`;

        if (currentImages.length > 1) {
            if (prevBtn) prevBtn.style.display = "block";
            if (nextBtn) nextBtn.style.display = "block";
        } else {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
        }
    }

    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    modal.onclick = (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-container')) {
            modal.style.display = "none";
        }
    };

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "block") {
            if (e.key === 'Escape') {
                modal.style.display = "none";
            } else if (e.key === 'ArrowLeft' && currentImages.length > 1) {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight' && currentImages.length > 1) {
                currentIndex = (currentIndex + 1) % currentImages.length;
                updateLightboxImage();
            }
        }
    });
});