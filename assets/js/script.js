// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const orderForm = document.getElementById('orderForm');
const orderModal = document.getElementById('orderModal');
const modalClose = document.querySelector('.modal-close');
const orderButtons = document.querySelectorAll('.btn-order');
const productSelect = document.getElementById('product');

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===== Order Now Button Click =====
orderButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product;
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    const offsetTop = contactSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    
    // Set the product in the dropdown
    setTimeout(() => {
      const productMap = {
        'Custom Cups': 'cups',
        'Custom Shirts': 'shirts',
        'Custom Keychains': 'keychains',
        'Custom Pens': 'pens',
        'Custom School Bags': 'bags',
        'More Items': 'other'
      };
      
      if (productMap[productName]) {
        productSelect.value = productMap[productName];
      }
      
      // Focus on name field
      document.getElementById('name').focus();
    }, 500);
  });
});

// ===== Form Submission =====
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(orderForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    product: formData.get('product'),
    details: formData.get('details')
  };
  
  // Validate form
  if (!data.name || !data.email || !data.product || !data.details) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Show success modal
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.textContent = `Thank you ${data.name}! Your order request for ${getProductName(data.product)} has been submitted. We'll contact you at ${data.email} within 24 hours.`;
  
  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Reset form
  orderForm.reset();
  
  // Console log for demo purposes
  console.log('Order Submitted:', data);
});

// ===== Modal Close =====
modalClose.addEventListener('click', closeModal);

orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && orderModal.classList.contains('active')) {
    closeModal();
  }
});

function closeModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Helper Functions =====
function getProductName(value) {
  const products = {
    'cups': 'Custom Cups',
    'shirts': 'Custom Shirts',
    'keychains': 'Custom Keychains',
    'pens': 'Custom Pens',
    'bags': 'Custom School Bags',
    'other': 'Custom Items'
  };
  return products[value] || 'Custom Items';
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#ef4444' : '#10b981'};
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 3000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  `;
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    opacity: 0.8;
  `;
  
  // Add animation keyframes
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Close button click
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ===== Scroll Animations =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation class to elements
document.querySelectorAll('.product-card, .about-feature, .contact-item').forEach(el => {
  el.classList.add('animate-on-scroll');
  observer.observe(el);
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
    
    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active');
        navLink.style.color = '#818cf8';
      } else {
        navLink.classList.remove('active');
        navLink.style.color = '';
      }
    }
  });
});

// ===== Quick View Button (Demo) =====
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.dataset.product;
    showNotification(`Quick view for ${product} - Feature coming soon!`, 'info');
  });
});

// ===== Parallax Effect on Hero =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to body for initial animations
  document.body.classList.add('loaded');
  
  // Trigger initial animations
  setTimeout(() => {
    document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-stats').forEach((el, index) => {
      el.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
      el.style.opacity = '0';
    });
  }, 100);
});
