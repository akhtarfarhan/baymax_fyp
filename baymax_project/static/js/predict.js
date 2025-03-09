(function () {
    console.log("predict.js loaded");

    // Form slider functionality
    const formSlider = document.getElementById('formSlider');
    if (formSlider) {
        const questions = formSlider.querySelectorAll('.form-group');
        let currentQuestion = 0;
        const formData = {};

        // Ensure the first question is visible on page load
        questions[currentQuestion].classList.add('active');

        // Function to show the "Next" button
        function showNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'inline-block'; // Show the "Next" button
        }

        // Function to hide the "Next" button
        function hideNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'none'; // Hide the "Next" button
        }

        // Handle select change for gender and show "Next" button
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.addEventListener('change', () => {
                if (genderSelect.value) {
                    formData.gender = genderSelect.value;
                    showNextButton(genderSelect); // Show "Next" button
                } else {
                    hideNextButton(genderSelect); // Hide "Next" button if no selection
                }
            });

            // Handle "Next" button click for gender
            const genderNextButton = genderSelect.closest('.form-group').querySelector('.next-button');
            genderNextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (genderSelect.value) {
                    moveToNextQuestion();
                    hideNextButton(genderSelect); // Hide "Next" button after moving
                }
            });
        }

        // Handle input changes and "Next" button for other questions
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    showNextButton(input); // Show "Next" button when input has value
                } else {
                    hideNextButton(input); // Hide "Next" button if input is empty
                }
            });

            const nextButton = input.closest('.form-group').querySelector('.next-button');
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (input.value) {
                    formData[input.name] = input.value;
                    moveToNextQuestion();
                    hideNextButton(input); // Hide "Next" button after moving
                } else {
                    alert('Please fill in the field before proceeding.');
                }
            });
        });

        // Handle final submission
        const submitButton = document.getElementById('submitPrediction');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                console.log('Final Form Data:', formData);
                // Add further logic here (e.g., send to API for prediction)
            });
        }

        // Function to move to the next question
        function moveToNextQuestion() {
            questions[currentQuestion].classList.remove('active');
            currentQuestion++;
            if (currentQuestion < questions.length) {
                questions[currentQuestion].classList.add('active');
                if (currentQuestion === questions.length - 1) {
                    setTimeout(() => {
                        submitButton.classList.add('active');
                    }, 300); // Delay for popup effect
                }
            }
        }
    }

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
    }
})();