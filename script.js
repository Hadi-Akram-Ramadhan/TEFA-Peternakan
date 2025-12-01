// TEFA Peternakan Website - Interactive JavaScript

// Component Loader
async function loadComponent(elementId, componentPath) {
    // Check if running on file:// protocol
    if (window.location.protocol === 'file:') {
        console.error('Error: Fetch API tidak berjalan pada protokol file://. Harap gunakan web server lokal (seperti Laragon, XAMPP, atau Live Server).');
        // Only show alert once to avoid spamming
        if (!window.hasShownFileProtocolAlert) {
            alert('PENTING: Website ini menggunakan komponen dinamis yang memerlukan Web Server.\n\nMohon buka website ini melalui alamat localhost (contoh: http://localhost/tefa) menggunakan Laragon/XAMPP, BUKAN dengan membuka file HTML secara langsung.');
            window.hasShownFileProtocolAlert = true;
        }
        return;
    }

    try {
        // Add cache-busting parameter to force reload of components
        const cacheBuster = `?v=${Date.now()}`;
        const response = await fetch(componentPath + cacheBuster);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Initialize App Features
function initApp() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Mobile Dropdown Toggle
    const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdownContent = this.nextElementSibling;
            this.classList.toggle('active');
            dropdownContent.classList.toggle('hidden');
        });
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            // Close all other FAQs
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });

            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                // Only prevent default if the target exists on the current page
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and elements for scroll animations
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active Navigation Highlighting
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const nav = document.querySelector('nav');

        // Navbar shadow on scroll
        if (nav) {
             if (window.scrollY > 50) {
                nav.classList.add('shadow-lg');
            } else {
                nav.classList.remove('shadow-lg');
            }
        }

        let current = '';
        if (nav) {
             const navHeight = nav.offsetHeight;
             sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionHeight = section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const pesan = document.getElementById('pesan').value;

            // Basic validation
            if (!nama || !email || !pesan) {
                alert('Mohon lengkapi semua field!');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Mohon masukkan email yang valid!');
                return;
            }

            // Show success message
            alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');

            // Reset form
            contactForm.reset();

            // In a real application, you would send this data to a server
            console.log('Form submitted:', { nama, email, pesan });
        });
    }

    // Add animation delays to cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Highlight current page in navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksList = document.querySelectorAll('.nav-link, .mobile-menu a');
    navLinksList.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('text-green-700');
        }
    });
}

// Loading Screen Logic
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', async function () {
    // Load components
    await Promise.all([
        loadComponent('navbar-placeholder', 'components/navbar.html'),
        loadComponent('footer-placeholder', 'components/footer.html')
    ]);

    // Initialize app after components are loaded
    initApp();
    
    // Hide loader when everything is ready
    // Use a small delay to ensure smooth transition
    setTimeout(hideLoader, 800);
});

// Fallback: Hide loader if window load takes too long (e.g. slow network)
window.addEventListener('load', function() {
    setTimeout(hideLoader, 500);
});
