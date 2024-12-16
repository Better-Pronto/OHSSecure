button = document.querySelector(".secure-login-button");
button.addEventListener("click", (e) => {
  button.parentElement.classList.add("hidden");
  button.parentElement.parentElement.children[2].classList.remove("hidden");
  button.parentElement.parentElement.children[3].classList.add("hidden");
});

form = document.querySelector("#secure-login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let email = document.querySelector("#ohs-email").value;

  fetch("https://encryptionapi.pythonanywhere.com/create", {
    method: "POST",
    body: JSON.stringify({ email: email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if ("error" in data) {
        alert("Invalid Email.");
        return;
      }

      console.log(data["authToken"]);

      chrome.storage.local.set({
        token: data["authToken"],
      });

      form.parentElement.classList.add("hidden");
      form.parentElement.parentElement.children[1].classList.add("hidden"); 
      form.parentElement.parentElement.children[3].classList.remove("hidden");
    });
});

chrome.storage.local.get("token", function(value) {
  let token = value.token;
  if (token) {
    console.log(token);
    form = document.querySelector("#secure-login-form");
    form.parentElement.classList.add("hidden");
    form.parentElement.parentElement.children[1].classList.add("hidden");
    form.parentElement.parentElement.children[3].classList.remove("hidden");
  }
})