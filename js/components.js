/**
 * WomenRise Component Loader
 * Dynamically loads reusable components (header, footer, testimonials) into pages
 */

// Load component HTML into specified element
function loadComponent(componentPath, targetElementId) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = data;
                
                // Execute any scripts in the loaded content
                const scripts = targetElement.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                });
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load header if placeholder exists
    if (document.getElementById('header-placeholder')) {
        loadComponent('components/header.html', 'header-placeholder');
    }
    
    // Load footer if placeholder exists
    if (document.getElementById('footer-placeholder')) {
        loadComponent('components/footer.html', 'footer-placeholder');
    }
    
    // Load testimonials if placeholder exists
    if (document.getElementById('testimonials-placeholder')) {
        loadComponent('components/testimonials.html', 'testimonials-placeholder');
    }
});

// jQuery method for loading components (alternative)
$(document).ready(function() {
    // Load header
    if ($('#header-placeholder').length) {
        $('#header-placeholder').load('components/header.html');
    }
    
    // Load footer
    if ($('#footer-placeholder').length) {
        $('#footer-placeholder').load('components/footer.html');
    }
    
    // Load testimonials
    if ($('#testimonials-placeholder').length) {
        $('#testimonials-placeholder').load('components/testimonials.html', function() {
            // Reinitialize owl carousel after loading testimonials
            if (typeof $.fn.owlCarousel !== 'undefined') {
                $('.testimonial-carousel').owlCarousel({
                    autoplay: true,
                    smartSpeed: 1000,
                    margin: 45,
                    dots: true,
                    loop: true,
                    center: true,
                    responsive: {
                        0:{
                            items:1
                        },
                        768:{
                            items:2
                        },
                        992:{
                            items:3
                        }
                    }
                });
            }
        });
    }
});
