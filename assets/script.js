const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

/* MOBILE MENU */

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

/* ACTIVE PAGE */

const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");
  }
});

/* SIMULATED AI */

const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const aiInput = document.getElementById("ai-input");

const getAiReply = (prompt) => {
  const text = prompt.toLowerCase().trim();

  if (!text) {
    return "Hello! How can I help?";
  }

  if (
    text.includes("oi") ||
    text.includes("olá") ||
    text.includes("hello") ||
    text.includes("hi")
  ) {
    return "Hello! How are you? I can help with simple and quick questions.";
  }

  if (
    text.includes("como vai") ||
    text.includes("como você está") ||
    text.includes("how are you")
  ) {
    return "I’m good! I’m ready to answer simple and quick questions.";
  }

  if (
    text === "what is your name" ||
    text === "what's your name" ||
    text.includes("what is your name") ||
    text.includes("what's your name")
  ) {
    return "My name is AURA AI.";
  }

  if (
    text.includes("qual") ||
    text.includes("what") ||
    text.includes("who") ||
    text.includes("when") ||
    text.includes("where") ||
    text.includes("why") ||
    text.includes("como") ||
    text.includes("quem") ||
    text.includes("quando") ||
    text.includes("onde") ||
    text.includes("porque")
  ) {
    return "I can answer simple questions. For example: 'What is your name?' or 'How are you?'";
  }

  if (text.includes("nome") || text.includes("name")) {
    return "My name is AURA AI.";
  }

  if (
    text.includes("ajuda") ||
    text.includes("help") ||
    text.includes("suporte")
  ) {
    return "Of course! I can answer greetings and simple questions.";
  }

  return "I can only answer greetings and simple questions.";
};

const addMessage = (text, type = "ai") => {
  if (!chat) return;

  const message = document.createElement("div");
  message.className = `msg ${type}`;
  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
};

const showTyping = () => {
  if (!chat) return null;

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  return typing;
};

if (form && aiInput) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const prompt = aiInput.value.trim();

    if (!prompt) return;

    addMessage(prompt, "user");
    aiInput.value = "";

    const typing = showTyping();

    window.setTimeout(() => {
      if (typing) typing.remove();
      addMessage(getAiReply(prompt), "ai");
    }, 800);
  });
}
