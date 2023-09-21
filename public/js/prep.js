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
