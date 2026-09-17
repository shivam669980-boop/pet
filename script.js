/* 
========================================================================
   PET HUB PREMIUM DEMO WEBSITE - INTERACTIVE LOGIC
   Handles: Sticky Nav, Mobile Menu, Breed Filters, Lightbox, Scroll Reveals,
            Form Submissions, Toast Alerts, and WhatsApp Triggers
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY HEADER & ACTIVE SCROLL NAVIGATION
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('header, section');

    const handleScroll = () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight Active Link on Scroll (Only on Desktop)
        if (window.innerWidth > 768) {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120; // Offset for sticky navbar height
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial on-load check


    // ==========================================
    // 2. MOBILE NAVIGATION HAMBURGER DRAWER & MULTI-PAGE SYSTEM
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navbar.classList.toggle('mobile-active');
        });

        // Close Mobile Menu Click Listener
        const menuCloseBtn = document.getElementById('menu-close-btn');
        if (menuCloseBtn) {
            menuCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.remove('active');
                navbar.classList.remove('mobile-active');
            });
        }

        // Global Multi-Page Navigation for Mobile Viewports
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const targetId = anchor.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetSection = document.querySelector(targetId);

            if (window.innerWidth <= 768) {
                // Multi-page page switch logic on mobile
                const allViews = document.querySelectorAll('header.hero, section.about, section.breeds, section.services, .divider-banner, section.gallery, section.testimonials, section.contact');
                
                let isSectionView = false;
                allViews.forEach(view => {
                    if ('#' + view.getAttribute('id') === targetId) {
                        isSectionView = true;
                    }
                });

                if (isSectionView) {
                    e.preventDefault();

                    // Hide all other views
                    allViews.forEach(view => view.classList.remove('active-page'));

                    // Show target view
                    if (targetSection) {
                        targetSection.classList.add('active-page');
                        targetSection.classList.add('active'); // Trigger reveal animation instantly
                        
                        // Force reveal child elements
                        const reveals = targetSection.querySelectorAll('.reveal');
                        reveals.forEach(r => r.classList.add('active'));
                    }

                    // Highlight active matching links in navigation
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === targetId) {
                            link.classList.add('active');
                        }
                    });

                    // Scroll to top instantly
                    window.scrollTo({ top: 0, behavior: 'instant' });

                    // Close hamburger menu drawer if open
                    navMenu.classList.remove('active');
                    navbar.classList.remove('mobile-active');
                }
            }
        });

        // Close menu when clicking anywhere else on page
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navbar.classList.remove('mobile-active');
            }
        });
    }    // ==========================================
    // 3. INTERACTIVE DOG BREEDS / PET FILTERS
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const breedCards = document.querySelectorAll('.breed-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            breedCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                // Graceful fade transition logic
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hidden');
                    // Force reflow for CSS animation
                    void card.offsetWidth;
                    card.classList.remove('fade-out');
                } else {
                    card.classList.add('fade-out');
                    // Wait for fade transition duration (300ms) before hiding completely
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.classList.add('hidden');
                        }
                    }, 300);
                }
            });
        });
    });


    // ==========================================
    // 4. IMAGE GALLERY LIGHTBOX OVERLAY
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg && lightboxCaption && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const fullSrc = item.getAttribute('data-src');
                const captionText = item.getAttribute('data-caption');

                lightboxImg.setAttribute('src', fullSrc);
                lightboxCaption.textContent = captionText;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Unlock background scroll
            setTimeout(() => {
                lightboxImg.setAttribute('src', ''); // Reset source
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close lightbox clicking on dark backdrop
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close lightbox pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // ==========================================
    // 5. ANIMATE-ON-SCROLL REVEAL IMPLEMENTATION
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            root: null,
            threshold: 0.12, // Trigger when 12% of the element is visible
            rootMargin: '0px 0px -50px 0px' // Margins around viewport
        });

        revealElements.forEach(elem => revealObserver.observe(elem));
    } else {
        // Fallback for older browsers
        revealElements.forEach(elem => elem.classList.add('active'));
    }


    // ==========================================
    // 6. CUSTOM SUCCESS TOAST ALERTS
    // ==========================================
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    const showToast = (title, message, duration = 4000) => {
        if (!toast) return;

        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };


    // ==========================================
    // 7. INQUIRY AND NEWSLETTER FORM DEMO HANDLERS
    // ==========================================
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract data
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const interest = document.getElementById('breed-interest');
            const breedName = interest.options[interest.selectedIndex].text;

            // Trigger premium feedback
            showToast(
                'Inquiry Received!',
                `Thank you ${firstName} ${lastName}. Our pet advisor will email you at ${email} shortly regarding your ${breedName} inquiry.`
            );

            inquiryForm.reset();
        });
    }

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const emailValue = emailInput.value.trim();

            showToast(
                'Subscribed Successfully!',
                `Thank you! ${emailValue} has been added to our exclusive VIP litter announcement registry.`
            );

            emailInput.value = '';
        });
    }


    // ==========================================
    // 8. FLOATING WHATSAPP BUTTON REDIRECTION
    // ==========================================
    const whatsappButton = document.getElementById('whatsapp-button');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', () => {
            const phoneNumber = '918210384883';
            const message = encodeURIComponent(
                'Hi Pet Hub! I am browsing your premium demo website and would love to inquire about your available luxury breed puppies.'
            );
            const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            // Open chat window in new secure tab
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

});
