let resetThemeElement;
let resetThemeId;
let resetCsrf;

//modal element for deleting themes
const resetModalBackdrop = document.getElementById("backdrop-reset");

const showResetModal = (button) => {
  resetModalBackdrop.style.display = "flex";

  resetThemeElement = button.closest("article");
  resetThemeId = resetThemeElement.querySelector("#themeId").value;
  resetCsrf = resetThemeElement.querySelector("#csrfToken").value;
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == resetModalBackdrop) {
    resetModalBackdrop.style.display = "none";
  }
};

// close modal
const resetCloseModal = () => {
  resetModalBackdrop.style.display = "none";
};

// reset votes
const resetVotes = () => {
  const url = "/admin/theme/reset-votes/" + resetThemeId;

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "csrf-token": resetCsrf,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      resetCloseModal();
    })
    .catch((err) => {
      console.log(err);
      resetCloseModal();
    });
};
