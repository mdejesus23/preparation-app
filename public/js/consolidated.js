const toggleShowForm = document.getElementById("add-result-button");
const addResultForm = document.getElementById("add-result-form");

const modalBackdrop = document.getElementById("backdrop-consolidated");

const showModal = () => {
  modalBackdrop.style.display = "flex";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modalBackdrop) {
    modalBackdrop.style.display = "none";
  }
};

// close modal
const closeModal = () => {
  modalBackdrop.style.display = "none";
};

// first reading popup message.
const popupMessage = () => {
  const popup = document.querySelector(".first-popup");

  popup.classList.add("show-popup");
  setTimeout(() => {
    popup.classList.remove("show-popup");
  }, 2000);
};

// second reading popup message.
const secondReadingPopup = () => {
  const popup = document.querySelector(".second-popup");

  popup.classList.add("show-popup");
  setTimeout(() => {
    popup.classList.remove("show-popup");
  }, 2000);
};

//  third reading popup message.
const thirdReadingPopup = () => {
  const popup = document.querySelector(".third-popup");

  popup.classList.add("show-popup");
  setTimeout(() => {
    popup.classList.remove("show-popup");
  }, 2000);
};

// gospel reading popup message.
const gospelReadingPopup = () => {
  const popup = document.querySelector(".gospel-popup");

  console.log(popup);

  popup.classList.add("show-popup");
  setTimeout(() => {
    popup.classList.remove("show-popup");
  }, 2000);
};

const firstReadingList = document.querySelectorAll(".reading-1");
const secondReadingList = document.querySelectorAll(".reading-2");
const thirdReadingList = document.querySelectorAll(".reading-3");
const gospelReadingList = document.querySelectorAll(".gospel");

// 1st reading picker function
firstReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("firstReading");
    const firstReading = rl.querySelector("p"); // select p element inside li element
    readingInput.value = "";
    readingInput.value = firstReading.innerText;
    popupMessage();
  });
});

// 2nd reading picker function
secondReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("secondReading");
    const secondReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = secondReading.innerText;
    secondReadingPopup();
  });
});

// 3rd reading picker function
thirdReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("thirdReading");
    const thirdReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = thirdReading.innerText;
    thirdReadingPopup();
  });
});

// gospel reading picker function
gospelReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("gospelReading");
    const gospel = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = gospel.innerText;
    gospelReadingPopup();
  });
});
