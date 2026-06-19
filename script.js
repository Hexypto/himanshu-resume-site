/**
 * Himanshu Sharma Resume/Portfolio website scripting
 * Interactivity: Style Customizer, Project Filters, Copy to Clipboard, Intersection Nav Indicators
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INTERACTIVE STYLE CUSTOMIZER LOGIC ---
    const root = document.documentElement;

    // Control Elements
    const presetButtons = document.querySelectorAll('.btn-preset');
    const sliderBlur = document.getElementById('slider-blur');
    const sliderRadius = document.getElementById('slider-radius');
    const toggleGlow = document.getElementById('toggle-glow');

    // Code Output Displays
    const codeAccent = document.getElementById('code-accent');
    const codeSecondary = document.getElementById('code-secondary');
    const codeBlur = document.getElementById('code-blur');
    const codeRadius = document.getElementById('code-radius');
    const codeGlow = document.getElementById('code-glow');

    const colorValDisplay = document.getElementById('color-val');
    const blurValDisplay = document.getElementById('blur-val');
    const radiusValDisplay = document.getElementById('radius-val');
    const glowValDisplay = document.getElementById('glow-val');

    // Theme Color Presets
    presetButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active classes
            presetButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const primaryColor = button.getAttribute('data-color');
            const secondaryColor = button.getAttribute('data-color-sec');
            const themeName = button.getAttribute('data-name');

            // Apply to CSS variables
            root.style.setProperty('--accent-color', primaryColor);
            root.style.setProperty('--accent-secondary', secondaryColor);
            root.style.setProperty('--accent-glow', `rgba(${hexToRgb(primaryColor)}, 0.45)`);

            // Update Displays
            colorValDisplay.textContent = themeName;
            codeAccent.textContent = primaryColor;
            codeSecondary.textContent = secondaryColor;
        });
    });

    // Glass Blur Slider
    sliderBlur.addEventListener('input', (e) => {
        const val = e.target.value;
        root.style.setProperty('--glass-blur', `${val}px`);
        blurValDisplay.textContent = `${val}px`;
        codeBlur.textContent = `${val}px`;
    });

    // Border Radius Slider
    sliderRadius.addEventListener('input', (e) => {
        const val = e.target.value;
        root.style.setProperty('--radius-main', `${val}px`);
        radiusValDisplay.textContent = `${val}px`;
        codeRadius.textContent = `${val}px`;
    });

    // Glow Spread Toggle
    toggleGlow.addEventListener('change', (e) => {
        const checked = e.target.checked;
        if (checked) {
            root.style.setProperty('--glow-opacity', '1');
            root.style.setProperty('--glow-spread', '20px');
            glowValDisplay.textContent = 'On';
            codeGlow.textContent = '1';
        } else {
            root.style.setProperty('--glow-opacity', '0');
            root.style.setProperty('--glow-spread', '0px');
            glowValDisplay.textContent = 'Off';
            codeGlow.textContent = '0';
        }
    });

    // Helper: Hex color to RGB string
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result 
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : '139, 92, 246';
    }


    // --- 2. GALLERY SPOTLIGHT & GRID FILTERING ---
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    
    // Mouse Spotlight Effect
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Gallery Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Active state toggle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Fade out transition
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.remove('hide');
                        // Trigger browser reflow
                        void item.offsetWidth;
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    // Hero Websites CTA Button Router
    const heroWebBtn = document.getElementById('hero-web-btn');
    if (heroWebBtn) {
        heroWebBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsSec = document.getElementById('projects');
            if (projectsSec) {
                projectsSec.scrollIntoView({ behavior: 'smooth' });
            }
            const webFilterTab = document.getElementById('filter-web');
            if (webFilterTab) {
                // Delayed click to align with scroll finish
                setTimeout(() => {
                    webFilterTab.click();
                }, 300);
            }
        });
    }


    // --- 3. COPY EMAIL TO CLIPBOARD ---
    const copyButton = document.getElementById('btn-copy-email');
    const toast = document.getElementById('copy-toast');
    const emailText = 'sharmahimmu3@gmail.com';

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText).then(() => {
                // Show toast
                toast.classList.add('show');
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }


    // --- 4. NAVIGATION HIGH LIGHTING ON SCROLL ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Matches when section is centered in viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- 5. MOBILE HAMBURGER MENU TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle-btn');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinksList.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
            });
        });
    }

});
