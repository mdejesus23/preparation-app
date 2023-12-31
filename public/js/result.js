let resultElement;
let resultId;
let csrf;

// modal element
const modalBackdrop = document.getElementById("backdrop-result");
const resultModalContent = document.getElementById("result-modal-content");

const showModal = (button) => {
  modalBackdrop.style.display = "flex";
  resultModalContent.style.display = "block";

  resultElement = button.closest("article");
  resultId = resultElement.querySelector("#resultId").value;
  csrf = resultElement.querySelector("#csrfToken").value;
};

// close modal button.
const closeModal = () => {
  modalBackdrop.style.display = "none";
  resultModalContent.style.display = "none";
};

const deleteResult = () => {
  const url = "/results/" + resultId;

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
      resultElement.remove(); // remove themeElement in the DOM
      // close the modal
      closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
};
