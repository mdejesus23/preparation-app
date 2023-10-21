let resetThemeElement;
let resetThemeId;
let resetCsrf;

//modal element for deleting themes
const resetModalBackdrop = document.getElementById("backdrop-reset");

const showResetModal = (button) => {
  resetModalBackdrop.style.display = "flex";

  resetThemeElement = button.closest("article");
  resetThemeId = themeElement.querySelector("#themeId").value;
  resetCsrf = themeElement.querySelector("#csrfToken").value;
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == resetModalBackdrop) {
    resetModalBackdrop.style.display = "none";
  }
};

// close modal
const closeModal = () => {
  modalBackdrop.style.display = "none";
};

// reset votes
const resetVotes = () => {
  const url = "/admin/theme/reset-votes" + resetThemeId;

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "csrf-token": resetCsrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      closeModal();
    })
    .catch((err) => {
      console.log(err);
    });
};
