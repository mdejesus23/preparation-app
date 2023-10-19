let themeElement;
let themeId;
let csrf;

const passCodeErr = document.getElementById("passcode-error");

const modalBackdrop = document.getElementById("backdrop-themes");

const showModal = (button) => {
  modalBackdrop.style.display = "flex";

  themeElement = button.closest("article");
  themeId = themeElement.querySelector('[name="themeId"]').value;
  csrf = themeElement.querySelector('[name="csrfToken"]').value;
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

const postPasscode = () => {
  const passcode = document.getElementById("passcode").value;

  const url = "/readings/" + themeId;

  fetch(url, {
    method: "POST",
    headers: {
      "csrf-token": csrf,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ passcode: passcode }),
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      if (data.message === "Passcode does not match") {
        passCodeErr.style.display = "block";
      } else {
        passCodeErr.style.display = "none";
        window.location.href = "/readings/" + themeId; // Change the URL to the desired destination
      }
      closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
};
