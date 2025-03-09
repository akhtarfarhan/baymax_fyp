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

// Sample User Data (Replace with actual data from your backend)
const userData = {
    name: "Tsewang Norbu Gurung",
    email: "tsewang.norbu@example.com",
    age: 22,
    gender: "Male",
    predictionHistory: [
        { date: "2024-01-15", riskLevel: "Low", details: "Glucose: 90 mg/dL" },
        { date: "2024-02-10", riskLevel: "Medium", details: "Glucose: 140 mg/dL" },
        { date: "2024-03-05", riskLevel: "High", details: "Glucose: 200 mg/dL" },
    ],
};

// Populate User Info
document.getElementById("userName").textContent = userData.name;
document.getElementById("userFullName").textContent = userData.name;
document.getElementById("userEmail").textContent = userData.email;
document.getElementById("userAge").textContent = userData.age;
document.getElementById("userGender").textContent = userData.gender;

// Populate Prediction History
const predictionHistoryTable = document.getElementById("predictionHistory").querySelector("tbody");
userData.predictionHistory.forEach((prediction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${prediction.date}</td>
        <td>${prediction.riskLevel}</td>
        <td>${prediction.details}</td>
    `;
    predictionHistoryTable.appendChild(row);
});

// Sample User Input Data (Replace with actual data from your form)
const formData = {
    gender: "Male",
    age: 30,
    pregnancies: 2,
    glucose: 120,
    bloodPressure: 80,
    skinThickness: 25,
    insulin: 150,
    weight: 70,
    height: 1.75,
};

// Populate the User Input Summary Card
document.getElementById("summaryGender").textContent = formData.gender;
document.getElementById("summaryAge").textContent = formData.age;
document.getElementById("summaryPregnancies").textContent = formData.pregnancies;
document.getElementById("summaryGlucose").textContent = `${formData.glucose} mg/dL`;
document.getElementById("summaryBloodPressure").textContent = `${formData.bloodPressure} mmHg`;
document.getElementById("summarySkinThickness").textContent = `${formData.skinThickness} mm`;
document.getElementById("summaryInsulin").textContent = `${formData.insulin} mu U/ml`;
document.getElementById("summaryWeight").textContent = `${formData.weight} kg`;
document.getElementById("summaryHeight").textContent = `${formData.height} m`;

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

// Add enter key support for sending messages
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});