document.addEventListener('DOMContentLoaded', function() {
    // ====== Navigation Menu ======
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set active navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link has a valid href (not "#" or empty)
            if (this.getAttribute('href') === '#' || !this.getAttribute('href')) {
                e.preventDefault(); // Prevent default only for non-navigational links
            }

            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // ====== Hero Section Animations ======
    const notifications = document.querySelectorAll('.notification');
    const steps = document.querySelectorAll('.step');
    
    // Animate notifications sequentially
    function animateNotifications() {
        notifications.forEach((notification, index) => {
            // Initial state - hide all notifications
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            notification.style.transition = 'all 0.5s ease';
            
            // Animate each notification with delay
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 1000 * (index + 1));
        });
    }
    
    // Run animation on page load
    animateNotifications();

    // ====== Filter Buttons ======
    const filterButtons = document.querySelectorAll('.filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // ====== About Us Tabs ======
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active');
            });
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would typically show/hide content based on tab
            // For now just a placeholder, would need content sections to manipulate
            console.log('Tab clicked:', this.textContent);
        });
    });

    // ====== FAQ Questions ======
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqAnswer = document.querySelector('.faq-answer');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Remove active class from all questions
            faqQuestions.forEach(q => {
                q.classList.remove('active');
            });
            // Add active class to clicked question
            this.classList.add('active');
            
            // Change answer content based on question (placeholder)
            // In a real implementation, you'd have multiple answer divs or data attributes
            const questionText = this.textContent;
            
            // Simple content switch example
            if (questionText.includes('payment methods')) {
                faqAnswer.innerHTML = `
                    <div class="faq-cards-row">
                        <div class="faq-card">
                            <img src="/img/icons/credit-card.svg" alt="Credit Card" />
                            <h3>Credit & Debit Cards</h3>
                            <p>We accept all major credit and debit cards for payment</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/digital-wallet.svg" alt="Digital Wallet" />
                            <h3>Digital Wallets</h3>
                            <p>Pay easily with Apple Pay, Google Pay, and other digital wallets</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/cash.svg" alt="Cash" />
                            <h3>Cash on Delivery</h3>
                            <p>Pay with cash when your order arrives at your doorstep</p>
                        </div>
                    </div>`;
            } else if (questionText.includes('track my order')) {
                faqAnswer.innerHTML = `
                    <div class="faq-cards-row">
                        <div class="faq-card">
                            <img src="/img/icons/track.svg" alt="Track Order" />
                            <h3>Real-time Tracking</h3>
                            <p>Watch your order's journey from restaurant to your doorstep in real-time</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/app.svg" alt="Mobile App" />
                            <h3>Mobile App</h3>
                            <p>Get push notifications about your order status on our mobile app</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/support.svg" alt="Support" />
                            <h3>Customer Support</h3>
                            <p>Contact our support team anytime for updates on your order</p>
                        </div>
                    </div>`;
            } else if (questionText.includes('discounts')) {
                faqAnswer.innerHTML = `
                    <div class="faq-cards-row">
                        <div class="faq-card">
                            <img src="/img/icons/promotion.svg" alt="Promotions" />
                            <h3>Special Promotions</h3>
                            <p>Regular discounts and promotional offers throughout the year</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/loyalty.svg" alt="Loyalty Program" />
                            <h3>Loyalty Program</h3>
                            <p>Earn points with every order and redeem them for discounts</p>
                        </div>
                        <div class="faq-card">
                            <img src="/img/icons/referral.svg" alt="Referral" />
                            <h3>Referral Program</h3>
                            <p>Get discounts by referring friends and family to Foodzie</p>
                        </div>
                    </div>`;
            }
        });
    });

    // ====== Search Bar Functionality ======
    const searchForm = document.querySelector('.search-bar');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input');
            const postcodeValue = searchInput.value.trim();
            
            if (postcodeValue) {
                // Simple validation demo
                const postcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
                
                if (postcodePattern.test(postcodeValue)) {
                    alert(`Thank you! Searching for restaurants near ${postcodeValue}`);
                    // Here you would redirect or show results
                } else {
                    alert('Please enter a valid UK postcode');
                    searchInput.focus();
                }
            } else {
                alert('Please enter a postcode to continue');
                searchInput.focus();
            }
        });
    }

    // ====== Newsletter Subscription ======
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const emailValue = emailInput.value.trim();
            
            if (emailValue && isValidEmail(emailValue)) {
                // Success message
                alert(`Thank you for subscribing with ${emailValue}! You'll receive our latest deals.`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
                emailInput.focus();
            }
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Other event handlers and functionality
    // ====== Change Location Functionality ======
    const changeLocationBtn = document.querySelector('.change-location');
    
    if (changeLocationBtn) {
        changeLocationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simple implementation using prompt
            const newLocation = prompt('Enter your new delivery location:', '');
            
            if (newLocation && newLocation.trim() !== '') {
                // Update location text
                const locationSpan = document.querySelector('.location span');
                if (locationSpan) {
                    locationSpan.textContent = ` ${newLocation}`;
                }
            }
        });
    }



    // ====== Scroll Animation for Categories and Restaurants ======
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to category cards
    document.querySelectorAll('.category-card, .restaurant-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInOnScroll.observe(card);
    });

    // ====== Sticky Header Logic ======
    const header = document.querySelector('.header');
    const topBar = document.querySelector('.top-bar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            
            // Hide top bar on scroll down
            if (window.scrollY > lastScrollY) {
                topBar.style.height = '0';
                topBar.style.overflow = 'hidden';
                topBar.style.padding = '0';
                topBar.style.margin = '0';
            } else {
                // Show top bar on scroll up
                topBar.style.height = '60px';
            }
        } else {
            header.style.boxShadow = 'none';
            topBar.style.height = '60px';
        }
        
        lastScrollY = window.scrollY;
    });

    // ====== Deal Card Effects ======
    document.querySelectorAll('.deal-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
                badge.style.backgroundColor = '#FFD95E';
                badge.style.color = '#423C3C';
                badge.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
                badge.style.backgroundColor = '#1c2a3a';
                badge.style.color = '#fff';
            }
        });
    });

    // Initialize other components if needed
    console.log('Foodzie website initialized successfully!');

    //Modal Login and Signup
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginSignupBtn = document.querySelector('.login-signup');
    const closeModalBtn = document.getElementById('closeModal');
    const closeSignupModalBtn = document.getElementById('closeSignupModal');
    const switchToSignupBtn = document.getElementById('switchToSignup');
    const switchToLoginBtn = document.getElementById('switchToLogin');
    
    // Function to open login modal
    function openLoginModal() {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Function to close login modal
    function closeLoginModal() {
        loginModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Function to open signup modal
    function openSignupModal() {
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    }
    
    // Function to close signup modal
    function closeSignupModal() {
        signupModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Function to switch from signup to login
    function switchToLogin() {
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    }
    
    // Event listeners
    if (loginSignupBtn) {
        loginSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeLoginModal);
    }
    
    if (closeSignupModalBtn) {
        closeSignupModalBtn.addEventListener('click', closeSignupModal);
    }
    
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSignupModal();
        });
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            switchToLogin();
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeLoginModal();
        } else if (event.target === signupModal) {
            closeSignupModal();
        }
    });
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const errorDiv = document.getElementById('login-error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }

            const formData = new FormData(loginForm);
            const data = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // If login is successful, redirect to the appropriate page
                    const result = await response.json();
                    window.location.href = result.redirectUrl;
                } else {
                    // If login fails, show error message
                    const errorDiv = document.getElementById('login-error');
                    if (errorDiv) {
                        errorDiv.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                const errorDiv = document.getElementById('login-error');
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                }
            }
        });
    }

    // Check for error message in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.style.display = 'block';
        }
    }
    
    // Close modals when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeSignupModal();
        }
    });
});


document.querySelectorAll('.menu-section .nav-pills .nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.menu-section .nav-pills .nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});


const categoryButtons = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card');
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    const category = button.dataset.category;
    menuCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        card.classList.add('animate');
        setTimeout(() => card.classList.remove('animate'), 300);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Cart functionality (simplified, as order page doesn't update cart)
let cartCount = 0;
const cartCountElement = document.getElementById('cart-count');
document.querySelectorAll('.btn-add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const quantity = parseInt(button.parentElement.querySelector('.quantity-input')?.value || 1);
    cartCount += quantity;
    cartCountElement.textContent = cartCount;
  });
});

// Quantity selector (for menu page, reused in order page)
document.querySelectorAll('.quantity-btn').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('.quantity-input');
    let value = parseInt(input.value);
    if (button.classList.contains('increase')) {
      value++;
    } else if (button.classList.contains('decrease') && value > 1) {
      value--;
    }
    input.value = value;
  });
});

// New order form validation
const orderForm = document.getElementById('order-form');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    ['street', 'city', 'postal'].forEach(field => {
      const input = document.getElementById(field);
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });
    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
      isValid = false;
      document.querySelector('.payment-options').classList.add('is-invalid');
    } else {
      document.querySelector('.payment-options').classList.remove('is-invalid');
    }
    if (isValid) {
      orderForm.submit(); // Submit to /order
    }
  });
}

// Cart-Tab

// let listProductHTML = document.querySelector('.listProduct');
// let listCartHTML = document.querySelector('.listCart');
// let iconCart = document.querySelector('.icon-cart');
// let iconCartSpan = document.querySelector('.icon-cart span');
// let body = document.querySelector('body');
// let closeCart = document.querySelector('.close');
// let checkoutBtn = document.getElementById('checkout-btn');
// let cart = [];

// document.addEventListener('DOMContentLoaded', () => {
//     if (localStorage.getItem('cart')) {
//         cart = JSON.parse(localStorage.getItem('cart'));
//         addCartToHTML(); // Render cart items
//     }
   
// });

// if (checkoutBtn) {
//     checkoutBtn.addEventListener('click', function() {
        
//         // Optionally, you can validate cart here
//         if (cart.length === 0) {
//             alert('Your cart is empty!');
//             return;
//         }
//         // Cart is already in localStorage, just redirect
//         window.location.href = '/item/api/order';
//     });
// }
// let listProducts = [];
// iconCart.addEventListener("click", () => {
//     body.classList.toggle('showCart');
// });

// closeCart.addEventListener('click', () => {
//     body.classList.toggle('showCart');
// });



// listProductHTML.addEventListener('click', (event) => {
//         let positionClick = event.target;
//         if(positionClick.classList.contains('btn-order-now')){
//             event.preventDefault();
//             let id = positionClick.dataset.id;
//             let name = positionClick.dataset.name;
//             let image = positionClick.dataset.image;
//             let price = parseFloat(positionClick.dataset.price);
//             addToCart(id, name, image, price);
            
//         }
//     })

// const addToCart = (product_id, name, image, price) => {
//     let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
//     if(cart.length <= 0){
//         cart = [{
//             product_id: product_id,
//             name: name,
//             image: image,
//             price: price,
//             quantity: 1
//         }];
//     }else if(positionThisProductInCart < 0){
//         cart.push({
//             product_id: product_id,
//             name: name,
//             image: image,
//             price: price,
//             quantity: 1
//         });
//     }else{
//         cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
//     }
//     addCartToHTML();
//     addCartToMemory();
// }
// const addCartToMemory = () => {
//     localStorage.setItem('cart', JSON.stringify(cart));
// }
// const addCartToHTML = () => {
//     if (!listCartHTML || !iconCartSpan) return; 
//     listCartHTML.innerHTML = '';
//     let totalQuantity = 0;
//     if(cart.length > 0){
//         cart.forEach(item => {
//             totalQuantity = totalQuantity +  item.quantity;
//             let newItem = document.createElement('div');
//             newItem.classList.add('item');
//             newItem.dataset.id = item.product_id;

            
//             listCartHTML.appendChild(newItem);
//             newItem.innerHTML = `
           
//             <div class="image">
//                     <img src="${item.image}">
//                 </div>
//                 <div class="name">
//                 ${item.name}
//                 </div>
//                 <div class="totalPrice">$${item.price * item.quantity}</div>
//                 <div class="quantity">
//                     <span class="minus"><</span>
//                     <span>${item.quantity}</span>
//                     <span class="plus">></span>
//                 </div>
//             `;
//         })
//     }
//     iconCartSpan.innerText = totalQuantity;
// }
// listCartHTML.addEventListener('click', (event) => {
//     let positionClick = event.target;
//     if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
//         event.preventDefault();
//         let id = positionClick.closest('.item').dataset.id;
//         let positionThisProductInCart = cart.findIndex((value) => value.product_id == id);
//         if(positionThisProductInCart >= 0) {
//             if(positionClick.classList.contains('minus')) {
//                 if(cart[positionThisProductInCart].quantity > 1) {
//                     cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity - 1;
//                 } else {
//                     cart.splice(positionThisProductInCart, 1);
//                 }
//             } else if(positionClick.classList.contains('plus')) {
//                 cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
//             }
//             addCartToHTML();
//             addCartToMemory();
//         }
//     }


// })






