const $form = document.getElementById("form");

$form.addEventListener("submit", () => {
  const inputEmail = email.value;
  const inputPassword = password.value;

  console.log(inputEmail);
  console.log(inputPassword);
  localStorage.setItem("email", inputEmail);
  localStorage.setItem("password", inputPassword);
})

addEventListener("load", () => {
  isSavedEmail = localStorage.getItem("email");
  isSavedPassword = localStorage.getItem("password");

  if (isSavedEmail && isSavedPassword) {
    $form.email.value = isSavedEmail;
    $form.password.value = isSavedPassword;
  }
})


// (() => {
//   const setItem = localStorage.setItem()
// })