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
