async function loginFormHandler(event) {
  event.preventDefault();
  console.log("clicked");

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (email && password) {
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Logged in successfully.");
    } else {
      alert(response.statusText);
    }
  } else {
    alert("Please enter email and password!");
  }
}

document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);
