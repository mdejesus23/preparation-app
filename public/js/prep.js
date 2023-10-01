const buttonInnerTextToggle = (btn, readingElem) => {
  if (btn.innerText == "Vote") {
    btn.innerText = "Unvote";
    readingElem.classList.add("voted");
  } else {
    btn.innerText = "Vote";
    readingElem.classList.remove("voted");
  }
};

const voteReading = (button) => {
  const themeId = button.parentNode.querySelector("[name=themeId]").value;
  const readingId = button.parentNode.querySelector("[name=readingId]").value;
  const csrf = button.parentNode.querySelector("[name=csrfToken]").value;
  const btn = button;
  const readingElement = button.closest("li");
  let url = `/readings/vote/${themeId}`;

  //   if (btn.innerText === "Vote") {
  //     url = `/readings/vote/${themeId}`;
  //   } else if (btn.innerText === "Unvote") {
  //     url = `/readings/unvote/${themeId}`;
  //   }

  fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "csrf-token": csrf,
      "X-Request-ID": readingId,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      buttonInnerTextToggle(btn, readingElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

const categoryNav = document.querySelectorAll(".category-list li");
const historical = document.getElementById("h1");
const prophetical = document.getElementById("p1");
const epistle = document.getElementById("e1");
const gospel = document.getElementById("g1");

categoryNav.forEach((li) => {
  li.addEventListener("click", function () {
    if (li.innerText == "Historical") {
      historical.style.display = "inline-block";
      prophetical.style.display = "none";
      epistle.style.display = "none";
      gospel.style.display = "none";
    } else if (li.innerText == "Prophetical") {
      historical.style.display = "none";
      prophetical.style.display = "inline-block";
      epistle.style.display = "none";
      gospel.style.display = "none";
    } else if (li.innerText == "Epistle") {
      historical.style.display = "none";
      prophetical.style.display = "none";
      epistle.style.display = "inline-block";
      gospel.style.display = "none";
    } else if (li.innerText == "Gospel") {
      historical.style.display = "none";
      prophetical.style.display = "none";
      epistle.style.display = "none";
      gospel.style.display = "inline-block";
    } else if (li.innerText == "All") {
      historical.style.display = "inline-block";
      prophetical.style.display = "inline-block";
      epistle.style.display = "inline-block";
      gospel.style.display = "inline-block";
    }
  });
});
