const saveBtn = document.getElementById("save-post");
const cancelBtn = document.getElementById("cancel-post");

async function savePost(e) {
  e.preventDefault();
  const title = document.getElementById("post-title").value;
  const coconut = document.getElementById("post-content").value;

  const response = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({
      title,
      coconut,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    alert("Posted successfully!");
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

saveBtn.addEventListener("click", savePost);
