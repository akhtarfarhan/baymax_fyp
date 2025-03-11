document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Chatbot Toggle
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeButton = document.getElementById('closeButton');

    if (chatbotButton && chatbotWindow && closeButton) {
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        closeButton.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    // Send Message
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatbotBody = document.getElementById('chatbotBody');

    if (chatInput && sendButton && chatbotBody) {
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
    }

    // Blog Creation Chatbox
    const blogCreationButton = document.getElementById('blogCreationButton');
    const blogCreationWindow = document.getElementById('blogCreationWindow');
    const closeCreationButton = document.getElementById('closeCreationButton');
    const blogTitle = document.getElementById('blogTitle');
    const blogContent = document.getElementById('blogContent');
    const blogImage = document.getElementById('blogImage');
    const imagePreview = document.getElementById('imagePreview');
    const submitBlogButton = document.getElementById('submitBlogButton');
    const blogGrid = document.querySelector('.blog-grid');

    if (blogCreationButton && blogCreationWindow && closeCreationButton) {
        blogCreationButton.addEventListener('click', () => {
            blogCreationWindow.classList.toggle('active');
            if (blogCreationWindow.classList.contains('active')) {
                blogTitle.focus();
            }
        });

        closeCreationButton.addEventListener('click', () => {
            blogCreationWindow.classList.remove('active');
        });
    }

    // Preview image when selected
    if (blogImage && imagePreview) {
        blogImage.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    // Submit blog via AJAX
    if (submitBlogButton && blogGrid) {
        submitBlogButton.addEventListener('click', () => {
            const title = blogTitle.value.trim();
            const content = blogContent.value.trim();
            const file = blogImage.files[0];

            if (title && content) {
                const formData = new FormData();
                formData.append('data', JSON.stringify({ title, content }));
                if (file) {
                    formData.append('image', file);
                }

                fetch('/blog/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'), // For CSRF protection
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Create new blog card
                        const newBlogCard = document.createElement('article');
                        newBlogCard.classList.add('blog-card');
                        newBlogCard.innerHTML = `
                            <img src="${data.image_url || '{% static "images/default-blog.jpg" %}'}" alt="${data.title}">
                            <div class="blog-card-content">
                                <h2>${data.title}</h2>
                                <p>${data.content}</p>
                                <div class="blog-meta">
                                    <span>By ${getCurrentUser()} on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        `;

                        // Add animation
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
                        blogImage.value = '';
                        imagePreview.style.display = 'none';
                        blogCreationWindow.classList.remove('active');

                        alert('Your blog post has been submitted successfully!');
                    } else {
                        alert(data.message || 'Failed to submit blog post.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while submitting your blog.');
                });
            } else {
                alert('Please fill in all required fields (title and content)!');
            }
        });
    }

    // Allow Ctrl + Enter to submit
    if (blogContent) {
        blogContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                submitBlogButton.click();
            }
        });
    }

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Helper function to get current user (for display purposes)
    function getCurrentUser() {
        // This assumes user_name is available in the template or via an API call
        return document.body.dataset.userName || 'You'; // Fallback if not set
    }
});