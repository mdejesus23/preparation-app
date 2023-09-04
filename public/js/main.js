const backdrop = document.querySelector(".backdrop");
const sideDrawer = document.querySelector(".mobile-nav");
const menuToggle = document.querySelector("#side-menu-toggle");
// const voteButtons = document.querySelectorAll(".vote-btn");

function backdropClickHandler() {
  backdrop.style.display = "none";
  sideDrawer.classList.remove("open");
}

function menuToggleClickHandler() {
  backdrop.style.display = "block";
  sideDrawer.classList.add("open");
}

// voteButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     if (button.innerText == "Vote") {
//       console.log("inner text equal to vote.");
//       button.innerText = "Unvote";
//     } else if (button.innerText == "Unvote") {
//       button.innerText = "Vote";
//     }
//   });
// });

backdrop.addEventListener("click", backdropClickHandler);
menuToggle.addEventListener("click", menuToggleClickHandler);
