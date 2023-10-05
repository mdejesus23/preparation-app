const toggleShowForm = document.getElementById("add-result-button");
const addResultForm = document.getElementById("add-result-form");

toggleShowForm.addEventListener("click", function () {
  if (
    addResultForm.style.display === "none" ||
    addResultForm.style.display === ""
  ) {
    addResultForm.style.display = "block";
  } else {
    addResultForm.style.display = "none";
  }
});

const bumpAddResultBtn = () => {
  const addResultButton = document.getElementById("add-result-button");

  addResultButton.classList.add("bump");
  setTimeout(() => {
    addResultButton.classList.remove("bump");
  }, 300);
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
    bumpAddResultBtn();
  });
});

// 2nd reading picker function
secondReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("secondReading");
    const secondReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = secondReading.innerText;
    bumpAddResultBtn();
  });
});

// 3rd reading picker function
thirdReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("thirdReading");
    const thirdReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = thirdReading.innerText;
    bumpAddResultBtn();
  });
});

// gospel reading picker function
gospelReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("gospelReading");
    const gospel = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = gospel.innerText;
    bumpAddResultBtn();
  });
});
