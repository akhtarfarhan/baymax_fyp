document.addEventListener('DOMContentLoaded', function () {
    console.log("predict.js loaded successfully");

    const formSlider = document.getElementById('formSlider');
    if (!formSlider) return;

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

    function validateInput(input) {
        const name = input.name;
        const value = parseFloat(input.value);
        const range = ranges[name];
        return range && !isNaN(value) && value >= range.min && value <= range.max;
    }

    function toggleButton(element, buttonClass, show) {
        const button = element.closest('.form-group').querySelector(buttonClass);
        if (button) button.style.display = show ? 'inline-block' : 'none';
    }

    function moveToNextQuestion() {
        questions[currentQuestion].classList.remove('active');
        currentQuestion++;

        if (currentQuestion === 4 && formData.gender === 'male') {
            formData.pregnancies = 0;
            currentQuestion++;
        }

        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.add('active');
            if (currentQuestion === questions.length - 1) submitButton.classList.add('active');
        }
    }

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
            formData.gender = genderSelect.value;
            toggleButton(genderSelect, '.next-button', !!genderSelect.value);
        });

        const genderNextButton = genderSelect.closest('.form-group').querySelector('.next-button');
        if (genderNextButton) {
            genderNextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (genderSelect.value) {
                    moveToNextQuestion();
                    toggleButton(genderSelect, '.next-button', false);
                }
            });
        }
    }

    // Handle input changes for number fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            toggleButton(input, '.next-button', validateInput(input));
            toggleButton(input, '.back-button', currentQuestion > 0);
        });

        const nextButton = input.closest('.form-group').querySelector('.next-button');
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (validateInput(input)) {
                    formData[input.name] = input.value;
                    moveToNextQuestion();
                } else {
                    const range = ranges[input.name];
                    alert(`Enter a valid ${input.name} between ${range.min} and ${range.max} ${range.unit}.`);
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

    // Handle form submission
    if (submitButton) {
        submitButton.addEventListener('click', async() => {
            let isValid = true;

            for (const key in formData) {
                if (key !== 'gender' && ranges[key]) {
                    const value = parseFloat(formData[key]);
                    if (isNaN(value) || value < ranges[key].min || value > ranges[key].max) {
                        alert(`Invalid value for ${key}: ${formData[key]}. Must be between ${ranges[key].min} and ${ranges[key].max} ${ranges[key].unit}.`);
                        isValid = false;
                        break;
                    }
                }
            }

            if (isValid) {
                console.log('Final Form Data:', formData);
            
                fetch('/predict/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken(),
                    },
                    body: JSON.stringify({ data: formData })
                })
                .then(async response => {
                    if (!response.ok) {
                        // If response is not OK, try reading text to debug
                        const errorText = await response.text();
                        throw new Error(`Server Error: ${errorText}`);
                    }
                    
                    return response.json(); // Parse JSON only once
                })
                .then(data => {
                    console.log('This is the data:', data);
                    
                    if (data.success) {
                        window.location.href = data.redirect_url;
                    } else {
                        alert('Error: ' + (data.message || 'An unknown error occurred.'));
                    }
                })
                .catch(error => {
                    console.error('Submission error:', error);
                    alert('An error occurred while submitting your prediction.');
                });
            }
            
        });
    }

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
});