const pageContentEl = document.querySelector("#page-content");

function voteHandler(event) {
  var postId = event.target.getAttribute("data-post-id");
  var upvoteId = event.target.getAttribute("data-upvote-id");
  var downvoteId = event.target.getAttribute("data-downvote-id");
  var buttonVal = event.target.getAttribute("value");
  if (event.target.matches(".upvote-btn") && !buttonVal) {
    upvoteHandler(postId);
  } else if (event.target.matches(".upvote-btn") && buttonVal) {
    removeUpvoteHandler(upvoteId);
  } else if (event.target.matches(".downvote-btn") && !buttonVal) {
    downvoteHandler(postId);
  } else if (event.target.matches(".downvote-btn") && buttonVal) {
    removeDownvoteHandler(downvoteId);
  }
}

async function upvoteHandler(id) {
  const response = await fetch("/api/posts/upvote", {
    method: "PUT",
    body: JSON.stringify({
      post_id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    console.log(response.statusText);
  }
}

async function removeUpvoteHandler(id) {
  const response = await fetch(`/api/posts/upvote/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    console.log(response.statusText);
  }
}

async function downvoteHandler(id) {
  const response = await fetch("/api/posts/downvote", {
    method: "PUT",
    body: JSON.stringify({
      post_id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    console.log(response.statusText);
  }
}

async function removeDownvoteHandler(id) {
  const response = await fetch(`/api/posts/downvote/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    console.log(response.statusText);
  }
}

pageContentEl.addEventListener("click", voteHandler);
