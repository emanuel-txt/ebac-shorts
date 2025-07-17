// EBAC Shoes - JavaScript functionality
class EBACShoes {
  constructor() {
    this.cart = [];
    this.cartCount = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
  }

  setupEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => this.addToCart(e));
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.smoothScroll(e));
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => this.smoothScroll(e));
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    });
  }

  addToCart(event) {
    const button = event.target;
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);

    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    button.textContent = 'Adicionando...';

    // Simulate adding to cart (with delay for better UX)
    setTimeout(() => {
      // Add product to cart
      const existingItem = this.cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1
        });
      }

      // Update cart count
      this.cartCount += 1;
      this.updateCartDisplay();

      // Show notification
      this.showNotification(`${productName} adicionado ao carrinho!`);

      // Reset button
      button.classList.remove('loading');
      button.disabled = false;
      button.textContent = 'Adicionar ao carrinho';

      // Add success animation
      this.animateCartButton();
    }, 800);
  }

  updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = this.cartCount;
      cartCountElement.style.animation = 'bounce 0.5s ease-in-out';
      
      // Remove animation after it completes
      setTimeout(() => {
        cartCountElement.style.animation = '';
      }, 500);
    }
  }

  showNotification(message) {
    const notification = document.getElementById('cart-notification');
    const notificationText = notification.querySelector('.notification-text');
    
    notificationText.textContent = message;
    notification.classList.add('show');

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  animateCartButton() {
    const cartButton = document.querySelector('.cart-btn');
    if (cartButton) {
      cartButton.style.transform = 'scale(1.1)';
      cartButton.style.transition = 'transform 0.2s ease';
      
      setTimeout(() => {
        cartButton.style.transform = 'scale(1)';
      }, 200);
    }
  }

  smoothScroll(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      this.closeMobileMenu();
    }
  }

  setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animatedElements = document.querySelectorAll('.product-card, .about-content, .section-title');
    animatedElements.forEach(element => {
      element.classList.add('fade-in');
      observer.observe(element);
    });

    // Parallax effect for hero section (if needed)
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const navbar = document.querySelector('.header');
    
    // Add shadow to navbar when scrolling
    if (scrolled > 50) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    }
  }

  setupSmoothScrolling() {
    // Ensure smooth scrolling is enabled
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  setupMobileMenu() {
    // Create mobile menu if it doesn't exist
    if (!document.querySelector('.mobile-menu')) {
      this.createMobileMenu();
    }
  }

  createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav li:not(.cart-nav)');
    
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const menuList = document.createElement('ul');
    
    // Clone navigation links for mobile menu
    navLinks.forEach(link => {
      const menuItem = document.createElement('li');
      const menuLink = link.querySelector('a').cloneNode(true);
      menuLink.addEventListener('click', (e) => this.smoothScroll(e));
      menuItem.appendChild(menuLink);
      menuList.appendChild(menuItem);
    });
    
    // Add cart button to mobile menu
    const cartItem = document.createElement('li');
    const cartButton = document.querySelector('.cart-btn').cloneNode(true);
    cartItem.appendChild(cartButton);
    menuList.appendChild(cartItem);
    
    mobileMenu.appendChild(menuList);
    navbar.appendChild(mobileMenu);
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      
      // Animate hamburger menu
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      mobileToggle.classList.remove('active');
      
      // Reset hamburger menu
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  // Additional utility methods
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.cartCount = 0;
    this.updateCartDisplay();
  }

  removeFromCart(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const item = this.cart[itemIndex];
      this.cartCount -= item.quantity;
      this.cart.splice(itemIndex, 1);
      this.updateCartDisplay();
    }
  }

  // Enhanced product interactions
  setupProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-sm)';
      });
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const ebacShoes = new EBACShoes();
  
  // Make it available globally for debugging
  window.ebacShoes = ebacShoes;
  
  // Setup additional interactions
  ebacShoes.setupProductInteractions();
  
  // Add loading animation to page
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause any intensive operations
    console.log('Page hidden - pausing animations');
  } else {
    // Page is visible, resume operations
    console.log('Page visible - resuming animations');
  }
});

// Service Worker registration for PWA-like experience (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // This would be implemented in a real application
    console.log('Service Worker support detected');
  });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
  console.log('Analytics Event:', eventName, eventData);
  // In a real application, this would send data to analytics service
}

// Performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
  trackEvent('page_load', { loadTime });
});

// Error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  trackEvent('javascript_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});

// Keyboard navigation support
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // Close mobile menu on escape
    if (window.ebacShoes) {
      window.ebacShoes.closeMobileMenu();
    }
  }
});

// Touch gesture support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
  if (!touchStartX || !touchStartY) return;
  
  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Swipe detection logic could be added here
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      // Swipe left
      console.log('Swipe left detected');
    } else {
      // Swipe right
      console.log('Swipe right detected');
    }
  }
  
  touchStartX = 0;
  touchStartY = 0;
});
