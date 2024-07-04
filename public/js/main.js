let backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  if (backdrop.style.display === "block") {
    backdrop.style.display = "none";
  } else {
    backdrop.style.display = "block";
  }
  sideDrawer.classList.toggle("open");
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

// desktop dropdown
const dropDown = document.querySelector(".dropdown-content");
const dropdownBtn = document.getElementById("dropdown-btn");

const showDropDown = () => {
  console.log("show dropdown was clicked");
  dropDown.classList.toggle("show");
};

dropdownBtn?.addEventListener("click", showDropDown);

// mobile dropdown
const mobileDdContet = document.querySelector(".mobile-dropdown-content");
const mobileDdBtn = document.getElementById("mobile-dropdown-btn");

const showMobileDd = () => {
  console.log("show dropdown was clicked");
  mobileDdContet.classList.toggle("show");
};

mobileDdBtn.addEventListener("click", showMobileDd);

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".mobile-dropbtn")) {
    if (mobileDdContet.classList.contains("show")) {
      mobileDdContet.classList.remove("show");
    }
  }

  if (!event.target.matches(".dropbtn")) {
    if (dropDown.classList.contains("show")) {
      dropDown.classList.remove("show");
    }
  }
};
