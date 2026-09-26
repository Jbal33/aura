const socialFeed = document.querySelector(".social-feed");
const createPostForm = document.getElementById("social-post-form");
const storyDialog = document.getElementById("social-story-dialog");
let newPostNumber = 0;

const updateCommentCount = (post) => {
  const count = post.querySelectorAll(".social-comment").length;
  let countLabel = post.querySelector(".social-comment-count");

  if (!countLabel) {
    countLabel = document.createElement("span");
    countLabel.className = "social-comment-count";
    post.querySelector(".social-comments").before(countLabel);
  }

  countLabel.textContent = `${count} ${count === 1 ? "comment" : "comments"}`;
};

const createCommentForm = () => {
  newPostNumber += 1;
  const form = document.createElement("form");
  form.className = "social-comment-form";

  const label = document.createElement("label");
  label.className = "visually-hidden";
  label.htmlFor = `new-post-comment-${newPostNumber}`;
  label.textContent = "Write a comment";

  const input = document.createElement("input");
  input.id = label.htmlFor;
  input.name = "comment";
  input.type = "text";
  input.placeholder = "Add a comment...";
  input.maxLength = 240;
  input.required = true;

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Post";

  form.append(label, input, button);
  return form;
};

const createTextPost = (text) => {
  const post = document.createElement("article");
  post.className = "social-post social-text-post";

  const header = document.createElement("div");
  header.className = "social-post-header";

  const avatar = document.createElement("span");
  avatar.className = "social-avatar avatar-demo";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "ME";

  const author = document.createElement("div");
  author.className = "social-author";
  author.innerHTML =
    "<strong>You (demo)</strong><span>Just now · Text post</span>";

  const more = document.createElement("span");
  more.className = "social-more";
  more.setAttribute("aria-hidden", "true");
  more.textContent = "•••";

  header.append(avatar, author, more);

  const copy = document.createElement("p");
  copy.className = "social-post-copy";
  copy.textContent = text;

  const actions = document.createElement("div");
  actions.className = "social-post-actions";

  const like = document.createElement("button");
  like.className = "social-icon-button social-like";
  like.type = "button";
  like.setAttribute("aria-label", "Like your post");
  like.setAttribute("aria-pressed", "false");
  like.title = "Like";
  like.innerHTML = '<span aria-hidden="true">♡</span>';

  const focusComment = document.createElement("button");
  focusComment.className = "social-icon-button social-comment-focus";
  focusComment.type = "button";
  focusComment.setAttribute("aria-label", "Comment on your post");
  focusComment.title = "Comment";
  focusComment.innerHTML = '<span aria-hidden="true">◯</span>';

  const save = document.createElement("button");
  save.className = "social-icon-button social-save";
  save.type = "button";
  save.setAttribute("aria-label", "Save your post");
  save.setAttribute("aria-pressed", "false");
  save.title = "Save post";
  save.innerHTML = '<span aria-hidden="true">▱</span>';

  actions.append(like, focusComment, save);

  const likes = document.createElement("p");
  likes.className = "social-likes";
  likes.innerHTML = "<strong><span data-like-count>0</span> likes</strong>";

  const caption = document.createElement("p");
  caption.className = "social-caption";
  const captionAuthor = document.createElement("strong");
  captionAuthor.textContent = "You (demo) ";
  caption.append(captionAuthor, document.createTextNode(text));

  const comments = document.createElement("div");
  comments.className = "social-comments";
  comments.setAttribute("aria-live", "polite");

  const count = document.createElement("span");
  count.className = "social-comment-count";
  count.textContent = "0 comments";

  const details = document.createElement("div");
  details.className = "social-post-body";
  details.append(actions, likes, caption, count, comments, createCommentForm());

  post.append(header, copy, details);
  return post;
};

if (socialFeed) {
  socialFeed.addEventListener("click", (event) => {
    const like = event.target.closest(".social-like");
    const save = event.target.closest(".social-save");
    const commentFocus = event.target.closest(".social-comment-focus");

    if (like && socialFeed.contains(like)) {
      const post = like.closest(".social-post");
      const count = post.querySelector("[data-like-count]");
      const liked = like.getAttribute("aria-pressed") === "true";
      const currentCount = Number(count.textContent);

      like.setAttribute("aria-pressed", String(!liked));
      like.querySelector("span").textContent = liked ? "♡" : "♥";
      like.title = liked ? "Like" : "Unlike";
      count.textContent = String(currentCount + (liked ? -1 : 1));
    }

    if (save && socialFeed.contains(save)) {
      const saved = save.getAttribute("aria-pressed") === "true";
      save.setAttribute("aria-pressed", String(!saved));
      save.title = saved ? "Save post" : "Saved";
      save.querySelector("span").textContent = saved ? "▱" : "▰";
    }

    if (commentFocus && socialFeed.contains(commentFocus)) {
      commentFocus
        .closest(".social-post")
        .querySelector(".social-comment-form input")
        .focus();
    }
  });

  socialFeed.addEventListener("submit", (event) => {
    const form = event.target.closest(".social-comment-form");

    if (!form) return;

    event.preventDefault();

    const input = form.querySelector('input[name="comment"]');
    const commentText = input.value.trim();

    if (!commentText) return;

    const comment = document.createElement("p");
    comment.className = "social-comment";

    const author = document.createElement("strong");
    author.textContent = "You (demo) ";

    comment.append(author, document.createTextNode(commentText));
    form
      .closest(".social-post")
      .querySelector(".social-comments")
      .appendChild(comment);
    updateCommentCount(form.closest(".social-post"));
    form.reset();
    input.focus();
  });
}

if (createPostForm && socialFeed) {
  createPostForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = createPostForm.querySelector("textarea");
    const text = input.value.trim();

    if (!text) return;

    socialFeed.prepend(createTextPost(text));
    createPostForm.reset();
    socialFeed.firstElementChild.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

if (storyDialog) {
  document.querySelectorAll(".social-story").forEach((story) => {
    story.addEventListener("click", () => {
      document.getElementById("story-dialog-name").textContent =
        story.dataset.storyName;
      document.getElementById("story-dialog-copy").textContent =
        story.dataset.storyText;
      storyDialog.showModal();
    });
  });
}

document.querySelectorAll(".social-follow").forEach((button) => {
  button.addEventListener("click", () => {
    const following = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!following));
    button.textContent = following ? "Follow" : "Following";
  });
});
