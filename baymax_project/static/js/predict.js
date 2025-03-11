document.addEventListener('DOMContentLoaded', function () {
    console.log("predict.js loaded successfully");

    // Form slider functionality
    const formSlider = document.getElementById('formSlider');
    if (formSlider) {
        const questions = formSlider.querySelectorAll('.form-group');
        let currentQuestion = 0;
        const formData = {};

        // Ensure the first question is visible on page load
        questions[currentQuestion].classList.add('active');

        // Function to show the "Next" and "Back" buttons
        function showNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'inline-block';
        }

        function showBackButton(element) {
            const backButton = element.closest('.form-group').querySelector('.back-button');
            if (backButton) backButton.style.display = 'inline-block';
        }

        // Function to hide the "Next" and "Back" buttons
        function hideNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'none';
        }

        function hideBackButton(element) {
            const backButton = element.closest('.form-group').querySelector('.back-button');
            if (backButton) backButton.style.display = 'none';
        }

        // Handle select change for gender and show "Next" button
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.addEventListener('change', () => {
                if (genderSelect.value) {
                    formData.gender = genderSelect.value;
                    console.log("Gender selected:", formData.gender); // Debug
                    showNextButton(genderSelect);
                } else {
                    hideNextButton(genderSelect);
                }
            });

            const genderNextButton = genderSelect.closest('.form-group').querySelector('.next-button');
            genderNextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (genderSelect.value) {
                    moveToNextQuestion();
                    hideNextButton(genderSelect);
                }
            });
        }

        // Handle input changes and "Next" button for other questions
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    showNextButton(input);
                    showBackButton(input);
                } else {
                    hideNextButton(input);
                    hideBackButton(input);
                }
            });

            const nextButton = input.closest('.form-group').querySelector('.next-button');
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (input.value) {
                    formData[input.name] = input.value;
                    moveToNextQuestion();
                    hideNextButton(input);
                } else {
                    alert('Please fill in the field before proceeding.');
                }
            });

            const backButton = input.closest('.form-group').querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    moveToPreviousQuestion();
                });
            }
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

            console.log("Moving to question:", currentQuestion, "Gender:", formData.gender); // Debug

            // Skip "Pregnancies" (data-question="3", index 2) if gender is "male"
            if (currentQuestion === 2 && formData.gender === 'male') {
                console.log("Skipping Pregnancies for male"); // Debug
                formData.pregnancies = 0;
                currentQuestion++;
            }

            if (currentQuestion < questions.length) {
                questions[currentQuestion].classList.add('active');
                showBackButton(questions[currentQuestion].querySelector('input, select'));
                if (currentQuestion === questions.length - 1) {
                    setTimeout(() => {
                        submitButton.classList.add('active');
                    }, 300);
                }
            }
        }

        // Function to move to the previous question
        function moveToPreviousQuestion() {
            if (currentQuestion > 0) {
                questions[currentQuestion].classList.remove('active');
                currentQuestion--;

                // Adjust if moving back past the skipped "Pregnancies" question
                if (currentQuestion === 2 && formData.gender === 'male') {
                    console.log("Moving back past Pregnancies for male"); // Debug
                    currentQuestion--;
                }

                questions[currentQuestion].classList.add('active');
                hideNextButton(questions[currentQuestion].querySelector('input, select'));
                hideBackButton(questions[currentQuestion].querySelector('input, select'));

                const currentInput = questions[currentQuestion].querySelector('input, select');
                if (currentInput.value) {
                    showNextButton(currentInput);
                    if (currentQuestion > 0) showBackButton(currentInput);
                }

                if (currentQuestion < questions.length - 1) {
                    submitButton.classList.remove('active');
                }
            }
        }
    }

    // Chatbot Toggle (unchanged)
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

    // Send Message (unchanged)
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
});