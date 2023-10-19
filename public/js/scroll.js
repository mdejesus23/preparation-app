// back to top button
// Get the button
const backToTopBtn = document.querySelector(".scroll-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => scrollFunction();

const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};

// When the user clicks on the button, scroll to the top of the document
const backToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};
