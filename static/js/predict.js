document.addEventListener('DOMContentLoaded', function () {
    console.log("predict.js loaded successfully");

    const formSlider = document.getElementById('formSlider');
    if (formSlider) {
        const questions = formSlider.querySelectorAll('.form-group');
        let currentQuestion = 0;
        const formData = {};
        const submitButton = document.getElementById('submitPrediction');

        // Validation ranges
        const ranges = {
            age: { min: 1, max: 120, unit: 'years' },
            weight: { min: 0, max: 300, unit: 'kg' },
            height: { min: 2, max: 8, unit: 'ft' },
            pregnancies: { min: 0, max: 20, unit: '' },
            glucose: { min: 0, max: 199, unit: 'mg/dL' },
            bloodPressure: { min: 0, max: 200, unit: 'mmHg' },
            skinThickness: { min: 0, max: 99, unit: 'mm' },
            insulin: { min: 0, max: 846, unit: 'mu U/ml' }
        };

        // Show first question
        questions[currentQuestion].classList.add('active');

        // Validate input
        function validateInput(input) {
            const name = input.name;
            const value = parseFloat(input.value);
            const range = ranges[name];
            return !range || (value >= range.min && value <= range.max);
        }

        // Show/Hide Next Button
        function toggleNextButton(element, show) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            if (nextButton) {
                nextButton.style.display = show ? 'inline-block' : 'none';
            } else {
                console.error('Next button not found in form-group');
            }
        }

        // Show/Hide Back Button
        function toggleBackButton(element, show) {
            const backButton = element.closest('.form-group').querySelector('.back-button');
            if (backButton) backButton.style.display = show ? 'inline-block' : 'none';
        }

        // Move to next question
        function moveToNextQuestion() {
            questions[currentQuestion].classList.remove('active');
            currentQuestion++;

            // Skip Pregnancies for males
            if (currentQuestion === 4 && formData.gender === 'male') {
                formData.pregnancies = 0;
                currentQuestion++;
            }

            if (currentQuestion < questions.length) {
                questions[currentQuestion].classList.add('active');
                if (currentQuestion === questions.length - 1) {
                    submitButton.classList.add('active');
                }
            }
        }

        // Move to previous question
        function moveToPreviousQuestion() {
            if (currentQuestion > 0) {
                questions[currentQuestion].classList.remove('active');
                currentQuestion--;

                if (currentQuestion === 4 && formData.gender === 'male') {
                    currentQuestion--;
                }

                questions[currentQuestion].classList.add('active');
                submitButton.classList.remove('active');
            }
        }

        // Handle gender selection
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.addEventListener('change', () => {
                console.log('Gender changed to:', genderSelect.value);
                if (genderSelect.value) {
                    formData.gender = genderSelect.value;
                    toggleNextButton(genderSelect, true); // Show Next button when a gender is selected
                } else {
                    toggleNextButton(genderSelect, false); // Hide if no selection
                }
            });

            const genderNextButton = genderSelect.closest('.form-group').querySelector('.next-button');
            if (genderNextButton) {
                genderNextButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Next button clicked, gender:', formData.gender);
                    if (genderSelect.value) {
                        moveToNextQuestion();
                        toggleNextButton(genderSelect, false); // Hide Next button after moving
                    }
                });
            } else {
                console.error('Next button not found for gender selection');
            }
        } else {
            console.error('Gender select element not found');
        }

        // Handle input changes for number fields
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value && validateInput(input)) {
                    toggleNextButton(input, true);
                    if (currentQuestion > 0) toggleBackButton(input, true);
                } else {
                    toggleNextButton(input, false);
                    toggleBackButton(input, false);
                }
            });

            const nextButton = input.closest('.form-group').querySelector('.next-button');
            if (nextButton) {
                nextButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (input.value) {
                        if (validateInput(input)) {
                            formData[input.name] = input.value;
                            moveToNextQuestion();
                            toggleNextButton(input, false);
                        } else {
                            const range = ranges[input.name];
                            alert(`Please enter a value for ${input.name} between ${range.min} and ${range.max} ${range.unit}.`);
                        }
                    } else {
                        alert('Please fill in the field before proceeding.');
                    }
                });
            }

            const backButton = input.closest('.form-group').querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    moveToPreviousQuestion();
                });
            }
        });

        // Handle submission
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
                    console.log('Final Form Data before submission:', formData); // Add this log
                    fetch('/predict/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': getCsrfToken(),
                        },
                        body: JSON.stringify({ data: formData })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = data.redirect_url;
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while submitting your prediction.');
                    });
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
            console.warn('CSRF Token not found in cookies');
            return '';
        }
    }

    // Chatbot functionality (unchanged)
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeButton = document.getElementById('closeButton');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatbotBody = document.getElementById('chatbotBody');

    if (chatbotButton && chatbotWindow && closeButton) {
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
        closeButton.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

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