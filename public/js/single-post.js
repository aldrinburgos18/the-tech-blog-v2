const commentForm = document.getElementById("comment-form");
const editButton = document.getElementById("edit-post");

async function submitOnEnter(event) {
  if (event.which === 13 && !event.shiftKey) {
    event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));

    const comment_text = commentForm.value;
    const post_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];

    if (comment_text) {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          post_id,
          comment_text,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  }
}

async function editPostContent() {
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  const title = document.getElementById("edit-post-title").value;
  const coconut = document.getElementById("edit-post-content").value;

  const response = await fetch(`/api/posts/${post_id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      coconut,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText);
  }
}

function showEditForm() {
  const editForm = document.getElementById("edit-form");
  const postEl = document.getElementById("user-post");
  console.log(editButton.value);
  if (editButton.value == "off") {
    editForm.removeAttribute("hidden");
    postEl.setAttribute("hidden", true);
    editButton.setAttribute("value", "on");
    editButton.classList.add("edit-form-button", "mt-2");
    editButton.innerText = "save";
  } else {
    editForm.setAttribute("hidden", true);
    postEl.removeAttribute("hidden");
    editButton.setAttribute("value", "off");
    editPostContent();
    editButton.classList.remove("edit-form-button", "mt-2");
    editButton.innerText = "Edit post";
  }
}

commentForm.addEventListener("keypress", submitOnEnter);
editButton.addEventListener("click", showEditForm);
