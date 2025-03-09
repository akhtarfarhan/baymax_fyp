(function () {
    console.log("script.js loaded");

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer for fade-up animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach((el) => {
        observer.observe(el);
    });

    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        // Reset mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }
})();

// Form submission handling
const predictionForm = document.getElementById('predictionForm');
if (predictionForm) {
    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(predictionForm);
        const data = {
            gender: formData.get('gender'),
            age: formData.get('age'),
            pregnancies: formData.get('pregnancies'),
            glucose: formData.get('glucose'),
            bloodPressure: formData.get('bloodPressure'),
            skinThickness: formData.get('skinThickness'),
            insulin: formData.get('insulin'),
            weight: formData.get('weight'),
            height: formData.get('height')
        };
        console.log('Form Data:', data);
        // Add further logic here (e.g., send to API for prediction)
    });
}
// Chatbot Toggle
const chatbotButton = document.getElementById('chatbotButton');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeButton = document.getElementById('closeButton');

chatbotButton.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
});

closeButton.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Send Message
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatbotBody = document.getElementById('chatbotBody');

sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        userMessage.innerHTML = `<p>${message}</p>`;
        chatbotBody.appendChild(userMessage);

        // Clear input
        chatInput.value = '';

        // Scroll to bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');
            botMessage.innerHTML = `<p>Thanks for your message! How can I assist you further?</p>`;
            chatbotBody.appendChild(botMessage);

            // Scroll to bottom
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 1000);
    }
});