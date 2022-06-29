async function signupFormHandler(event) {
  event.preventDefault();

  const firstname = document.querySelector("#firstname").value.trim();
  const lastname = document.querySelector("#lastname").value.trim();
  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (firstname && lastname && username && email && password) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    //check response status
    if (response.ok) {
      alert("User created successfully.");
      document.location.replace("/");
    } else {
      alert(response.statusText);
    }
  } else {
    alert("Please complete form below!");
  }
}

document
  .querySelector(".user-form")
  .addEventListener("submit", signupFormHandler);
