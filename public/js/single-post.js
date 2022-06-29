const commentForm = document.getElementById("comment-form");

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

commentForm.addEventListener("keypress", submitOnEnter);
