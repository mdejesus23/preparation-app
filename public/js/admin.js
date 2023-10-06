let themeElement;
let resultId;
let csrf;

//modal element
const modalBackdrop = document.getElementById("backdrop");

const showModal = (button) => {
  modalBackdrop.style.display = "flex";

  themeElement = button.closest("article");
  resultId = themeElement.querySelector("#themeId").value;
  csrf = themeElement.querySelector("#csrfToken").value;
};

const closeModal = () => {
  modalBackdrop.style.display = "none";
};

const deleteTheme = () => {
  const url = "/admin/theme/" + resultId;

  fetch(url, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      themeElement.remove(); // remove themeElement in the DOM
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteReading = (button) => {
  const themeId = button.parentNode.querySelector("[name=themeId]").value;
  const readingId = button.parentNode.querySelector("[name=readingId]").value;
  const csrf = button.parentNode.querySelector("[name=csrfToken]").value;

  const readingElement = button.closest("li");

  const url = `/admin/delete-reading/${themeId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
      "X-Request-ID": readingId,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      readingElement.parentNode.removeChild(readingElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
