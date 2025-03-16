document.addEventListener('DOMContentLoaded', function () {
    console.log("predict.js loaded successfully");

    // Form slider functionality
    const formSlider = document.getElementById('formSlider');
    if (formSlider) {
        const questions = formSlider.querySelectorAll('.form-group');
        let currentQuestion = 0;
        const formData = {};

        // Validation ranges with units
        const ranges = {
            age: { min: 1, max: 120, unit: 'years' },
            weight: { min: 0, max: 300, unit: 'kg' },
            height: { min: 2, max: 8, unit: 'ft' }, // Updated to feet
            pregnancies: { min: 0, max: 20, unit: '' },
            glucose: { min: 0, max: 199, unit: 'mg/dL' },
            bloodPressure: { min: 0, max: 200, unit: 'mmHg' },
            skinThickness: { min: 0, max: 99, unit: 'mm' },
            insulin: { min: 0, max: 846, unit: 'mu U/ml' }
        };

        // Ensure the first question is visible on page load
        questions[currentQuestion].classList.add('active');

        // Function to show/hide buttons
        function showNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'inline-block';
        }

        function showBackButton(element) {
            const backButton = element.closest('.form-group').querySelector('.back-button');
            if (backButton) backButton.style.display = 'inline-block';
        }

        function hideNextButton(element) {
            const nextButton = element.closest('.form-group').querySelector('.next-button');
            nextButton.style.display = 'none';
        }

        function hideBackButton(element) {
            const backButton = element.closest('.form-group').querySelector('.back-button');
            if (backButton) backButton.style.display = 'none';
        }

        // Validate input against range
        function validateInput(input) {
            const name = input.name;
            const value = parseFloat(input.value);
            const range = ranges[name];
            if (!range) return true; // No range for gender
            return value >= range.min && value <= range.max;
        }

        // Handle select change for gender
        const genderSelect = document.getElementById('gender');
        if (genderSelect) {
            genderSelect.addEventListener('change', () => {
                if (genderSelect.value) {
                    formData.gender = genderSelect.value;
                    console.log("Gender selected:", formData.gender);
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

        // Handle input changes and validation
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value && validateInput(input)) {
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
                    if (validateInput(input)) {
                        formData[input.name] = input.value;
                        moveToNextQuestion();
                        hideNextButton(input);
                    } else {
                        const range = ranges[input.name];
                        alert(`Please enter a value for ${input.name} between ${range.min} and ${range.max} ${range.unit}.`);
                    }
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
                    // Add API call or further logic here
                    // If your model expects height in meters, convert it here:
                    formData.heightInMeters = (parseFloat(formData.height) * 0.3048).toFixed(2);
                    console.log('Height in meters:', formData.heightInMeters);
                }
            });
        }

        // Move to next question
        function moveToNextQuestion() {
            questions[currentQuestion].classList.remove('active');
            currentQuestion++;

            // Skip Pregnancies (data-question="5", index 4) if gender is male
            if (currentQuestion === 4 && formData.gender === 'male') {
                console.log("Skipping Pregnancies for male");
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

        // Move to previous question
        function moveToPreviousQuestion() {
            if (currentQuestion > 0) {
                questions[currentQuestion].classList.remove('active');
                currentQuestion--;

                // Adjust if moving back past the skipped Pregnancies question
                if (currentQuestion === 4 && formData.gender === 'male') {
                    console.log("Moving back past Pregnancies for male");
                    currentQuestion--;
                }

                questions[currentQuestion].classList.add('active');
                hideNextButton(questions[currentQuestion].querySelector('input, select'));
                hideBackButton(questions[currentQuestion].querySelector('input, select'));

                const currentInput = questions[currentQuestion].querySelector('input, select');
                if (currentInput.value && validateInput(currentInput)) {
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