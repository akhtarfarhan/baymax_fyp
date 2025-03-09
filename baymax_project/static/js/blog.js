// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
// const blogPosts = [
//     {
//         id: 1,
//         title: "Understanding Diabetes Risk Factors",
//         excerpt: "Learn about the key factors that contribute to diabetes risk and how to identify early warning signs.",
//         author: "Dr. Sarah Johnson",
//         date: "Feb 15, 2024",
//         comments: 8,
//         image: "placeholder.svg"
//     },
//     {
//         id: 2,
//         title: "AI in Healthcare: A New Era",
//         excerpt: "Discover how artificial intelligence is revolutionizing healthcare prediction and management.",
//         author: "Tech Team",
//         date: "Feb 12, 2024",
//         comments: 12,
//         image: "placeholder.svg"
//     },
//     {
//         id: 3,
//         title: "Lifestyle Changes for Diabetes Prevention",
//         excerpt: "Simple but effective lifestyle modifications that can help reduce your risk of developing diabetes.",
//         author: "Health & Wellness Team",
//         date: "Feb 10, 2024",
//         comments: 15,
//         image: "placeholder.svg"
//     }
// ];
// Function to create blog post cards
function createBlogCard(post) {
    return `
        <article class="blog-card fade-up">
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-card-content">
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
                <div class="blog-meta">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        ${post.author}
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${post.date}
                    </span>
                </div>
            </div>
        </article>
    `;
}
// Function to render all blog posts
function renderBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.innerHTML = blogPosts.map(post => createBlogCard(post)).join('');
    }
}
// Handle scroll animations
function handleScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(element => observer.observe(element));
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts();
    handleScrollAnimations();
});
// Handle navbar scroll effect (reusing from main page)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

// Blog Creation Chatbox
const blogCreationButton = document.getElementById('blogCreationButton');
const blogCreationWindow = document.getElementById('blogCreationWindow');
const closeCreationButton = document.getElementById('closeCreationButton');
const blogTitle = document.getElementById('blogTitle');
const blogContent = document.getElementById('blogContent');
const submitBlogButton = document.getElementById('submitBlogButton');
const blogGrid = document.querySelector('.blog-grid');

blogCreationButton.addEventListener('click', () => {
    blogCreationWindow.classList.toggle('active');
    if (blogCreationWindow.classList.contains('active')) {
        blogTitle.focus();
    }
});

closeCreationButton.addEventListener('click', () => {
    blogCreationWindow.classList.remove('active');
});

submitBlogButton.addEventListener('click', () => {
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();

    if (title && content) {
        // Create new blog card
        const newBlogCard = document.createElement('article');
        newBlogCard.classList.add('blog-card');
        newBlogCard.innerHTML = `
            <img src="images/placeholder.jpg" alt="${title}">
            <div class="blog-card-content">
                <h2>${title}</h2>
                <p>${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
            </div>
        `;

        // Add animation for new card
        newBlogCard.style.opacity = '0';
        newBlogCard.style.transform = 'translateY(20px)';
        blogGrid.insertBefore(newBlogCard, blogGrid.firstChild);

        setTimeout(() => {
            newBlogCard.style.transition = 'all 0.5s ease';
            newBlogCard.style.opacity = '1';
            newBlogCard.style.transform = 'translateY(0)';
        }, 100);

        // Clear inputs and close window
        blogTitle.value = '';
        blogContent.value = '';
        blogCreationWindow.classList.remove('active');

        // Optional: Show success message
        alert('Your blog post has been submitted successfully!');
    } else {
        alert('Please fill in both title and content!');
    }
});

// Allow Enter key to submit when focused on content
blogContent.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) { // Ctrl + Enter to submit
        submitBlogButton.click();
    }
});