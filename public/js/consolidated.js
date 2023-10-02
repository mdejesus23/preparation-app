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

const firstReadingList = document.querySelectorAll(".reading-1");
const secondReadingList = document.querySelectorAll(".reading-2");
const thirdReadingList = document.querySelectorAll(".reading-3");
const gospelReadingList = document.querySelectorAll(".gospel");

// 1st reading picker function
firstReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("first-reading");
    const firstReading = rl.querySelector("p"); // select p element inside li element
    readingInput.value = "";
    readingInput.value = firstReading.innerText;
  });
});

// 2nd reading picker function
secondReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("second-reading");
    const secondReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = secondReading.innerText;
  });
});

// 3rd reading picker function
thirdReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("third-reading");
    const thirdReading = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = thirdReading.innerText;
  });
});

// gospel reading picker function
gospelReadingList.forEach((rl) => {
  rl.addEventListener("click", function () {
    const readingInput = document.getElementById("gospel-reading");
    const gospel = rl.querySelector("p");
    readingInput.value = "";
    readingInput.value = gospel.innerText;
  });
});
