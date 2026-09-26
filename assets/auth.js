const authForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");
const demoPageName = location.pathname.split("/").pop() || "index.html";
const demoEmailKey = "auraDemoEmail";
const schoolEmailPattern = /^[a-z0-9_-]+\.[a-z0-9_-]+@unidavi\.edu\.br$/i;
const isLoginPage = demoPageName === "login.html";
const protectedPages = new Set([
  "index.html",
  "ai.html",
  "social.html",
  "school.html",
  "score.html",
  "academic.html",
  "about.html",
]);

const getReturnPage = () => {
  const requestedPage = new URLSearchParams(location.search).get("next");
  const pageName = requestedPage?.split(/[?#]/, 1)[0].replace(/^\/+/, "");

  return protectedPages.has(pageName) ? pageName : "index.html";
};

const setAuthMessage = (message, state = "") => {
  if (!authMessage) return;

  authMessage.textContent = message;
  authMessage.dataset.state = state;
};

const isSchoolEmail = (email) => schoolEmailPattern.test(email || "");

const getFirstName = (email) => {
  const firstName = email.split("@")[0].split(".")[0];

  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
};

if (authForm) {
  authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = new FormData(authForm)
      .get("email")
      .toString()
      .trim()
      .toLowerCase();

    if (!isSchoolEmail(email)) {
      setAuthMessage(
        "Use the school email format name.surname@unidavi.edu.br.",
        "error",
      );
      return;
    }

    localStorage.setItem(demoEmailKey, email);
    setAuthMessage(
      "Demo sign-in successful. This does not verify your identity.",
      "success",
    );

    window.setTimeout(() => location.replace(getReturnPage()), 500);
  });
}

let demoEmail = localStorage.getItem(demoEmailKey);

if (demoEmail && !isSchoolEmail(demoEmail)) {
  localStorage.removeItem(demoEmailKey);
  demoEmail = null;
}

if (isLoginPage && demoEmail) {
  location.replace(getReturnPage());
} else if (protectedPages.has(demoPageName) && !demoEmail) {
  const next = `${location.pathname}${location.search}${location.hash}`;
  location.replace(`login.html?next=${encodeURIComponent(next)}`);
} else if (demoEmail) {
  const welcomeMessage = document.getElementById("welcome-message");

  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome, ${getFirstName(demoEmail)}.`;
    welcomeMessage.hidden = false;
  }

  const navLinks = document.querySelector(".nav-links");

  if (navLinks) {
    const signOutLink = document.createElement("a");
    signOutLink.href = "#sign-out";
    signOutLink.textContent = "Sign out";
    signOutLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem(demoEmailKey);
      location.replace("login.html");
    });
    navLinks.appendChild(signOutLink);
  }
}
