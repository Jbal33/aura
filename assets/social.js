const socialFeed = document.querySelector(".social-feed");
const createPostForm = document.getElementById("social-post-form");
const storyDialog = document.getElementById("social-story-dialog");
const profilePhotoInput = document.getElementById("social-profile-image-input");
const postPhotoInput = document.getElementById("social-post-image-input");
const profilePhotoStatus = document.getElementById("profile-photo-status");
const postPhotoStatus = document.getElementById("post-photo-status");
const postPhotoPreview = document.getElementById("social-post-preview");
const postPhotoPreviewImage = document.getElementById(
  "social-post-preview-image",
);
const removeProfilePhotoButton = document.getElementById(
  "remove-profile-photo",
);
const removePostPhotoButton = document.getElementById("remove-post-photo");
const maxDemoImageSize = 8 * 1024 * 1024;
let newPostNumber = 0;
let profilePhotoUrl = null;
let selectedPostPhotoUrl = null;

const setUploadStatus = (element, message, state = "") => {
  if (!element) return;

  element.textContent = message;
  element.dataset.state = state;
};

const isValidDemoImage = (file, statusElement) => {
  if (!file.type.startsWith("image/")) {
    setUploadStatus(statusElement, "Choose an image file.", "error");
    return false;
  }

  if (file.size > maxDemoImageSize) {
    setUploadStatus(
      statusElement,
      "Choose an image smaller than 8 MB.",
      "error",
    );
    return false;
  }

  return true;
};

const updateDemoAvatars = () => {
  document.querySelectorAll(".avatar-demo").forEach((avatar) => {
    if (!profilePhotoUrl) {
      avatar.replaceChildren(document.createTextNode("ME"));
      return;
    }

    const image = document.createElement("img");
    image.src = profilePhotoUrl;
    image.alt = "Your selected demo profile photo";
    avatar.replaceChildren(image);
  });
};

if (profilePhotoInput) {
  profilePhotoInput.addEventListener("change", () => {
    const file = profilePhotoInput.files?.[0];

    if (!file || !isValidDemoImage(file, profilePhotoStatus)) return;

    const previousPhotoUrl = profilePhotoUrl;
    profilePhotoUrl = URL.createObjectURL(file);
    updateDemoAvatars();

    if (previousPhotoUrl) URL.revokeObjectURL(previousPhotoUrl);

    if (removeProfilePhotoButton) removeProfilePhotoButton.hidden = false;
    setUploadStatus(
      profilePhotoStatus,
      "Profile photo preview updated. It stays on this device.",
      "success",
    );
  });
}

if (removeProfilePhotoButton) {
  removeProfilePhotoButton.addEventListener("click", () => {
    if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);

    profilePhotoUrl = null;
    profilePhotoInput.value = "";
    removeProfilePhotoButton.hidden = true;
    updateDemoAvatars();
    setUploadStatus(profilePhotoStatus, "Profile photo removed.");
  });
}

if (postPhotoInput) {
  postPhotoInput.addEventListener("change", () => {
    const file = postPhotoInput.files?.[0];

    if (!file || !isValidDemoImage(file, postPhotoStatus)) return;

    if (selectedPostPhotoUrl) URL.revokeObjectURL(selectedPostPhotoUrl);

    selectedPostPhotoUrl = URL.createObjectURL(file);
    postPhotoPreviewImage.src = selectedPostPhotoUrl;
    postPhotoPreview.hidden = false;
    setUploadStatus(
      postPhotoStatus,
      "Photo ready to attach. It will not be uploaded.",
      "success",
    );
  });
}

const addCommentDeleteAction = (comment) => {
  if (comment.querySelector(".social-delete-comment")) return;

  const author = comment.querySelector("strong")?.textContent || "comment";
  const deleteButton = document.createElement("button");
  deleteButton.className = "social-delete-comment";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete comment by ${author}`);
  deleteButton.title = "Delete comment";
  deleteButton.textContent = "×";
  comment.dataset.owner = "demo-user";
  comment.appendChild(deleteButton);
};

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

const createTextPost = (text, photoUrl = null) => {
  const post = document.createElement("article");
  post.className = "social-post social-text-post";
  post.dataset.owner = "demo-user";

  if (photoUrl) post.dataset.localImageUrl = photoUrl;

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

  const more = document.createElement("button");
  more.className = "social-more";
  more.type = "button";
  more.setAttribute("aria-label", "Post options");
  more.setAttribute("aria-expanded", "false");
  more.title = "Post options";
  more.textContent = "•••";

  header.append(avatar, author, more);

  const image = photoUrl ? document.createElement("img") : null;

  if (image) {
    image.className = "social-post-image";
    image.src = photoUrl;
    image.alt = "Photo selected from your gallery for this demo post";
  }

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
  if (!text) caption.hidden = true;

  const comments = document.createElement("div");
  comments.className = "social-comments";
  comments.setAttribute("aria-live", "polite");

  const count = document.createElement("span");
  count.className = "social-comment-count";
  count.textContent = "0 comments";

  const details = document.createElement("div");
  details.className = "social-post-body";
  details.append(actions, likes, caption, count, comments, createCommentForm());

  post.append(header);
  if (image) post.append(image);
  post.append(details);
  return post;
};

if (socialFeed) {
  socialFeed.addEventListener("click", (event) => {
    const moreButton = event.target.closest(".social-more");
    const deletePostButton = event.target.closest(".social-delete-post");
    const deleteCommentButton = event.target.closest(".social-delete-comment");
    const like = event.target.closest(".social-like");
    const save = event.target.closest(".social-save");
    const commentFocus = event.target.closest(".social-comment-focus");

    if (!moreButton && !event.target.closest(".social-post-menu")) {
      socialFeed.querySelectorAll(".social-post-menu").forEach((menu) => {
        const post = menu.closest(".social-post");
        menu.remove();
        post
          ?.querySelector(".social-more")
          ?.setAttribute("aria-expanded", "false");
      });
    }

    if (moreButton) {
      const post = moreButton.closest(".social-post");

      if (post.dataset.owner !== "demo-user") return;

      const existingMenu = post.querySelector(".social-post-menu");

      if (existingMenu) {
        existingMenu.remove();
        moreButton.setAttribute("aria-expanded", "false");
        return;
      }

      socialFeed.querySelectorAll(".social-post-menu").forEach((menu) => {
        const menuPost = menu.closest(".social-post");
        menu.remove();
        menuPost
          ?.querySelector(".social-more")
          ?.setAttribute("aria-expanded", "false");
      });

      const menu = document.createElement("div");
      menu.className = "social-post-menu";
      menu.setAttribute("role", "menu");

      const deleteButton = document.createElement("button");
      deleteButton.className = "social-delete-post";
      deleteButton.type = "button";
      deleteButton.setAttribute("role", "menuitem");
      deleteButton.textContent = "Delete post";

      menu.appendChild(deleteButton);
      post.querySelector(".social-post-header").appendChild(menu);
      moreButton.setAttribute("aria-expanded", "true");
      deleteButton.focus();
      return;
    }

    if (deletePostButton) {
      const post = deletePostButton.closest(".social-post");

      if (post.dataset.owner === "demo-user") {
        if (post.dataset.localImageUrl) {
          URL.revokeObjectURL(post.dataset.localImageUrl);
        }
        post.remove();
      }

      return;
    }

    if (deleteCommentButton) {
      const post = deleteCommentButton.closest(".social-post");

      if (
        deleteCommentButton.closest(".social-comment").dataset.owner !==
        "demo-user"
      ) {
        return;
      }

      deleteCommentButton.closest(".social-comment").remove();
      updateCommentCount(post);
      return;
    }

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
    addCommentDeleteAction(comment);
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

    if (!text && !selectedPostPhotoUrl) {
      setUploadStatus(
        postPhotoStatus,
        "Add text or choose a photo to post.",
        "error",
      );
      return;
    }

    const postPhotoUrl = selectedPostPhotoUrl;
    socialFeed.prepend(createTextPost(text, postPhotoUrl));
    selectedPostPhotoUrl = null;
    postPhotoInput.value = "";
    postPhotoPreviewImage.removeAttribute("src");
    postPhotoPreview.hidden = true;
    setUploadStatus(postPhotoStatus, "Your demo post was added.", "success");
    updateDemoAvatars();
    createPostForm.reset();
    socialFeed.firstElementChild.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

window.addEventListener("pagehide", () => {
  if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);
  if (selectedPostPhotoUrl) URL.revokeObjectURL(selectedPostPhotoUrl);

  document
    .querySelectorAll(".social-post[data-local-image-url]")
    .forEach((post) => {
      URL.revokeObjectURL(post.dataset.localImageUrl);
    });
});

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
