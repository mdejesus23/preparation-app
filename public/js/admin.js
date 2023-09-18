const deleteTheme = (button) => {
  const themeId = button.parentNode.querySelector("[name=themeId]").value;
  const csrf = button.parentNode.querySelector("[name=csrfToken]").value;

  console.log(csrf);

  const themeElement = button.closest("article");

  const url = "/admin/theme/" + themeId;

  // const url = `/admin/theme/${themeId}`;

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
      themeElement.parentNode.removeChild(themeElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
