const authForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");
const authSubmit = authForm?.querySelector('button[type="submit"]');
const config = window.AURA_SUPABASE_CONFIG;
const authPageName = location.pathname.split("/").pop() || "index.html";
const isLoginPage = authPageName === "login.html";
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

const configurationReady =
  config?.url?.startsWith("https://") &&
  config?.publishableKey &&
  !config.url.includes("PASTE_") &&
  !config.publishableKey.includes("PASTE_");

if (!configurationReady) {
  if (authForm) {
    setAuthMessage(
      "Supabase is not configured yet. Add the project URL and publishable key in assets/supabase-config.js.",
      "error",
    );
  }
} else {
  const loadSupabase = () =>
    new Promise((resolve, reject) => {
      if (window.supabase?.createClient) {
        resolve();
        return;
      }

      const sdkScript = document.createElement("script");
      sdkScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      sdkScript.onload = resolve;
      sdkScript.onerror = () => reject(new Error("Could not load Supabase."));
      document.head.appendChild(sdkScript);
    });

  loadSupabase()
    .then(async () => {
      const supabase = window.supabase.createClient(
        config.url,
        config.publishableKey,
      );

      if (authForm && authSubmit) {
        authSubmit.disabled = false;

        authForm.addEventListener("submit", async (event) => {
          event.preventDefault();

          const email = new FormData(authForm)
            .get("email")
            .toString()
            .trim()
            .toLowerCase();
          const returnPage = getReturnPage();
          const emailRedirectTo = new URL("login.html", location.origin);
          emailRedirectTo.searchParams.set("next", returnPage);

          authSubmit.disabled = true;
          setAuthMessage("Sending your sign-in link...");

          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: emailRedirectTo.toString(),
            },
          });

          if (error) {
            setAuthMessage(
              "We could not send a link. Check the address or ask the AURA administrator to add your account.",
              "error",
            );
          } else {
            setAuthMessage(
              "Check your inbox for a one-time sign-in link.",
              "success",
            );
          }

          authSubmit.disabled = false;
        });
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        if (authForm) {
          setAuthMessage(
            "Could not check your sign-in session. Try again.",
            "error",
          );
        }
        return;
      }

      if (isLoginPage && data.session) {
        location.replace(getReturnPage());
        return;
      }

      if (protectedPages.has(authPageName) && !data.session) {
        const next = `${location.pathname}${location.search}${location.hash}`;
        location.replace(`login.html?next=${encodeURIComponent(next)}`);
        return;
      }

      if (data.session) {
        const navLinks = document.querySelector(".nav-links");

        if (navLinks) {
          const signOutLink = document.createElement("a");
          signOutLink.href = "#sign-out";
          signOutLink.textContent = "Sign out";
          signOutLink.addEventListener("click", async (event) => {
            event.preventDefault();
            await supabase.auth.signOut();
            location.replace("login.html");
          });
          navLinks.appendChild(signOutLink);
        }
      }
    })
    .catch(() => {
      if (authForm) {
        setAuthMessage(
          "Could not connect to Supabase. Check your connection and configuration.",
          "error",
        );
      }
    });
}
