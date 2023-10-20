let backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);

// page loader
window.addEventListener("load", () => {
  // Hide the loader when the page is fully loaded
  document.getElementById("loader").style.display = "none";
});

window.addEventListener("beforeunload", () => {
  // Show the loader when the page is unloading (going to a new page)
  document.getElementById("loader").style.display = "block";
});

const dropDown = document.querySelector(".dropdown-content");

const showDropDown = () => {
  dropDown.classList.toggle("show");
};

const dropdownBtn = document.getElementById("dropdown-btn");

dropdownBtn.addEventListener("click", showDropDown);

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    if (dropDown.classList.contains("show")) {
      dropDown.classList.remove("show");
    }
  }
};
