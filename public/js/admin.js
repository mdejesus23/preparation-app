let themeElement;
let themeId;
let csrf;

//modal element for deleting themes
const modalBackdrop = document.getElementById("backdrop-admin");
const deleteModalContent = document.getElementById("delete-modal-content");

const showModal = (button) => {
  modalBackdrop.style.display = "flex";
  deleteModalContent.style.display = "block";

  themeElement = button.closest("article");
  themeId = themeElement.querySelector("#themeId").value;
  csrf = themeElement.querySelector("#csrfToken").value;
};

// close modal
const closeModal = () => {
  modalBackdrop.style.display = "none";
  deleteModalContent.style.display = "none";
};

const deleteTheme = () => {
  const url = "/admin/theme/" + themeId;

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
      closeModal();
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
