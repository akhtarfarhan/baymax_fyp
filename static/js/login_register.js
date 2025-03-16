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