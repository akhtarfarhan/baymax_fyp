document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuButton.addEventListener('click', () => {
      navLinks.classList.toggle('active');
  });
});

function toggleForm() {
  const container = document.querySelector('.container');
  container.classList.toggle('active');
}
 // Handle navigation with animation
 function navigate(event, url, direction) {
  event.preventDefault();
  const container = document.querySelector('.container');
  container.classList.add(`slide-out-${direction}`);
  setTimeout(() => {
      window.location.href = url;
  }, 750); // Match the animation duration
}

// Apply entrance animation on page load
window.onload = () => {
  const container = document.querySelector('.container');
  container.classList.add('slide-in-right');
};

// Handle navigation with animation
function navigate(event, url, direction) {
  event.preventDefault();
  const container = document.querySelector('.container');
  container.classList.add(`slide-out-${direction}`);
  setTimeout(() => {
      window.location.href = url;
  }, 750); // Match the animation duration
}

// Apply entrance animation on page load
window.onload = () => {
  const container = document.querySelector('.container');
  container.classList.add('slide-in-left');
};