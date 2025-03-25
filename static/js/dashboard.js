console.log("this one is httin")
// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.nav-links');

mobileMenuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Reset mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
    }
});

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
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        userMessage.innerHTML = `<p>${message}</p>`;
        chatbotBody.appendChild(userMessage);

        chatInput.value = '';
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');
            botMessage.innerHTML = `<p>Thanks for your message! How can I assist you further?</p>`;
            chatbotBody.appendChild(botMessage);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 1000);
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Handle final submission
const submitButton = document.getElementById('submitPrediction');
if (submitButton) {
    submitButton.addEventListener('click', () => {
        let isValid = true;
        for (const [key, value] of Object.entries(formData)) {
            if (key !== 'gender' && (!ranges[key] || parseFloat(value) < ranges[key].min || parseFloat(value) > ranges[key].max)) {
                isValid = false;
                const range = ranges[key];
                alert(`Invalid value for ${key}: ${value}. Must be between ${range.min} and ${range.max} ${range.unit}.`);
                break;
            }
        }
        if (isValid) {
            console.log('Final Form Data:', formData);
            fetch('/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(), // Add a function to get CSRF token
                },
                body: JSON.stringify({ data: formData })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url; // Redirect to dashboard
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
}

// Function to get CSRF token from cookies
function getCsrfToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return '';
}