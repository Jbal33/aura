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

const calculateExpression = (expression) => {
  const normalizedExpression = expression
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/\s+/g, "");
  const sourceTokens = normalizedExpression.match(
    /\d+(?:\.\d+)?|[()+\-*/x×÷]/gi,
  );

  if (!sourceTokens || sourceTokens.join("") !== normalizedExpression) {
    return null;
  }

  const tokens = sourceTokens.map((token) => {
    if (token.toLowerCase() === "x" || token === "×") return "*";
    if (token === "÷") return "/";
    return token;
  });
  let position = 0;
  const steps = [];

  const parsePrimary = () => {
    if (tokens[position] === "(") {
      position += 1;
      const value = parseAddition();

      if (tokens[position] !== ")") throw new Error("INVALID_EXPRESSION");

      position += 1;
      return value;
    }

    const value = Number(tokens[position]);

    if (!Number.isFinite(value)) throw new Error("INVALID_EXPRESSION");

    position += 1;
    return value;
  };

  const parseUnary = () => {
    if (tokens[position] === "+") {
      position += 1;
      return parseUnary();
    }

    if (tokens[position] === "-") {
      position += 1;
      return -parseUnary();
    }

    return parsePrimary();
  };

  const parseMultiplication = () => {
    let value = parseUnary();

    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position];
      position += 1;
      const nextValue = parseUnary();

      if (operator === "/" && nextValue === 0) {
        throw new Error("DIVISION_BY_ZERO");
      }

      const previousValue = value;
      value = operator === "*" ? value * nextValue : value / nextValue;
      steps.push({
        left: previousValue,
        operator: operator === "*" ? "×" : "÷",
        right: nextValue,
        result: value,
      });
    }

    return value;
  };

  const parseAddition = () => {
    let value = parseMultiplication();

    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position];
      position += 1;
      const nextValue = parseMultiplication();
      const previousValue = value;
      value = operator === "+" ? value + nextValue : value - nextValue;
      steps.push({
        left: previousValue,
        operator,
        right: nextValue,
        result: value,
      });
    }

    return value;
  };

  try {
    const result = parseAddition();

    if (position !== tokens.length || !Number.isFinite(result)) return null;

    return { result, steps };
  } catch (error) {
    if (error.message === "DIVISION_BY_ZERO")
      return { error: "division-by-zero" };
    return null;
  }
};

const getAiReply = (prompt) => {
  const text = prompt.toLowerCase().trim();
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const words = normalizedText.split(/[^a-z0-9]+/).filter(Boolean);

  if (!text) {
    return "Hello! How can I help?";
  }

  if (words.some((word) => ["oi", "olá", "hello", "hi"].includes(word))) {
    return "Hello! How are you? I can help with simple and quick questions.";
  }

  if (
    normalizedText.includes("como vai") ||
    normalizedText.includes("como voce esta") ||
    normalizedText.includes("how are you") ||
    normalizedText.includes("how are u")
  ) {
    return "I’m good! I’m ready to answer simple and quick questions.";
  }
  if (
    normalizedText.includes("how is you") ||
    normalizedText.includes("how is u")
  ) {
    return "I'm good! But you need to improve your english, lol (+1000 aura points).";
  }

  if (
    normalizedText === "what is your name" ||
    normalizedText === "what's your name" ||
    normalizedText.includes("what is your name") ||
    normalizedText.includes("what is ur name") ||
    normalizedText.includes("what's ur name") ||
    normalizedText.includes("what's your name")
  ) {
    return "My name is AURA AI.";
  }

  if (
    normalizedText.includes("what is aura") ||
    normalizedText.includes("what's aura") ||
    normalizedText.includes("tell me about aura")
  ) {
    return "AURA is a fictional school platform that brings study tools, school information, academic progress, and student community features together.";
  }

  if (
    normalizedText.includes("photosynthesis") ||
    normalizedText.includes("fotossintese")
  ) {
    return "Photosynthesis is how plants use sunlight, water, and carbon dioxide to make their food and release oxygen.";
  }

  if (
    normalizedText.includes("gravity") ||
    normalizedText.includes("gravidade")
  ) {
    return "Gravity is a force that pulls objects toward each other. Earth's gravity pulls objects toward the ground and keeps the Moon in orbit.";
  }

  if (
    normalizedText.includes("water cycle") ||
    normalizedText.includes("ciclo da agua")
  ) {
    return "The water cycle moves water around Earth: the Sun causes evaporation, water vapor forms clouds through condensation, and precipitation brings water back to the ground.";
  }

  if (normalizedText.includes("fraction") || normalizedText.includes("frac")) {
    return "A fraction represents part of a whole. The top number is the numerator, and the bottom number is the denominator. For example, 1/2 means one of two equal parts.";
  }

  if (
    normalizedText.includes("study tip") ||
    normalizedText.includes("how should i study") ||
    normalizedText.includes("how to study") ||
    normalizedText.includes("dica de estudo") ||
    normalizedText.includes("como estudar")
  ) {
    return "Try a short study cycle: choose one topic, review it for 20 minutes, explain it in your own words, then answer a practice question. Take a short break and repeat.";
  }

  /* Convert written operators to symbols before solving the expression. */
  const mathText = normalizedText
    .replace(/\b(multiplied by|multiply by|times)\b/g, "*")
    .replace(/\b(divided by|divide by|over)\b/g, "/")
    .replace(/\b(plus|added to)\b/g, "+")
    .replace(/\b(minus)\b/g, "-");
  const mathExpressions = mathText.match(/[\d.,()+\-*/x×÷\s]+/gi) || [];
  const mathExpression = mathExpressions
    .map((expression) => expression.trim())
    .find(
      (expression) => /\d/.test(expression) && /[+\-*/x×÷]/.test(expression),
    );

  if (mathExpression) {
    const calculation = calculateExpression(mathExpression);

    if (calculation?.error === "division-by-zero") {
      return "Division by zero is undefined. There is no number you can multiply by 0 to get the original value. Check the divisor and try again.";
    }

    if (calculation) {
      const displayExpression = mathExpression
        .replace(/[x×]/gi, "×")
        .replace(/÷/g, "÷");
      const formattedResult = calculation.result.toLocaleString("en-US", {
        maximumFractionDigits: 8,
      });
      const formatNumber = (number) =>
        number.toLocaleString("en-US", { maximumFractionDigits: 8 });
      const steps = calculation.steps
        .map(
          (step, index) =>
            `Step ${index + 1}: ${formatNumber(step.left)} ${step.operator} ${formatNumber(step.right)} = ${formatNumber(step.result)}.`,
        )
        .join(" ");
      const explanation = mathExpression.includes("(")
        ? "Solve the parentheses first, then follow the operation order."
        : /[*\/x×÷]/i.test(mathExpression)
          ? "Multiplication and division come before addition and subtraction."
          : "For addition and subtraction, work from left to right.";

      return `${explanation} ${steps} Final answer: ${formattedResult}.`;
    }
  }

  if (normalizedText.includes("nome") || normalizedText.includes("name")) {
    return "My name is AURA AI.";
  }

  if (
    words.some((word) =>
      ["thanks", "thank", "obrigado", "obrigada"].includes(word),
    )
  ) {
    return "You're welcome! Let me know if you have another question.";
  }

  if (
    words.some((word) =>
      ["bye", "goodbye", "tchau", "adeus", "até"].includes(word),
    )
  ) {
    return "Goodbye! Good luck with your studies.";
  }

  if (
    normalizedText.includes("what can you do") ||
    normalizedText.includes("how can you help") ||
    normalizedText.includes("o que voce pode fazer")
  ) {
    return "I can respond to greetings, explain a few school topics, share a study tip, and solve simple arithmetic problems.";
  }

  if (
    normalizedText.includes("qual") ||
    normalizedText.includes("what") ||
    normalizedText.includes("who") ||
    normalizedText.includes("when") ||
    normalizedText.includes("where") ||
    normalizedText.includes("why") ||
    normalizedText.includes("como") ||
    normalizedText.includes("quem") ||
    normalizedText.includes("quando") ||
    normalizedText.includes("onde") ||
    normalizedText.includes("porque")
  ) {
    return "I don't know that one yet. Try asking about AURA, photosynthesis, gravity, the water cycle, fractions, study tips, or a simple math calculation.";
  }

  if (
    normalizedText.includes("ajuda") ||
    normalizedText.includes("help") ||
    normalizedText.includes("suporte")
  ) {
    return "I can help with greetings, a few school topics, study tips, and simple math. Ask 'What can you do?' for examples.";
  }

  return "I'm still learning. Try a greeting, a simple math problem, or ask about AURA, photosynthesis, gravity, the water cycle, fractions, or study tips.";
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
