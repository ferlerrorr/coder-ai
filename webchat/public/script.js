const form = document.getElementById("chat-form");
const promptInput = document.getElementById("prompt");
const messagesDiv = document.getElementById("messages");
const techStackSelect = document.getElementById("tech-stack");

let selectedStack = "";

const stackInstructions = {
  mern: "Please respond using JavaScript with MongoDB, Express, React, and Node.js (MERN stack).",
  mean: "Please respond using JavaScript with MongoDB, Express, Angular, and Node.js (MEAN stack).",
  mevn: "Please respond using JavaScript with MongoDB, Express, Vue.js, and Node.js (MEVN stack).",
  lamp: "Please respond using PHP with a Linux, Apache, MySQL, and PHP (LAMP) stack.",
  lemp: "Please respond using PHP with Linux, Nginx, MySQL, and PHP (LEMP) stack.",
  jamstack:
    "Please respond using modern JavaScript frameworks with static site generators and APIs (JAMstack).",
  django: "Please respond using Python and the Django framework.",
  flask: "Please respond using Python and the Flask framework.",
  rails: "Please respond using Ruby and the Ruby on Rails framework.",
  dotnet: "Please respond using C# and .NET Core technologies.",
  ai: "Please respond using Python with AI/ML libraries such as PyTorch or TensorFlow.",
  next: "Please respond using React with Next.js.",
  nuxt: "Please respond using Vue.js with Nuxt.js.",
  sveltekit: "Please respond using JavaScript with the SvelteKit framework.",
  "": "Please respond appropriately to general questions.",
};

techStackSelect.addEventListener("change", (e) => {
  selectedStack = e.target.value;
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function extractCodeFromMarkdown(content) {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
  const match = content.match(codeBlockRegex);
  return match ? match[1].trim() : null;
}

function addMessage(text, sender, isHtml = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  if (sender === "user") {
    const stackTitle = document.createElement("div");
    stackTitle.classList.add("stack-title");

    const titleText = selectedStack
      ? `${selectedStack.toUpperCase()} Question`
      : "General Knowledge Question";
    stackTitle.textContent = titleText;
    messageDiv.appendChild(stackTitle);
  }

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  if (isHtml) {
    messageContent.innerHTML = text;

    const codeBlocks = messageContent.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    messageContent.textContent = text;
  }

  messageDiv.appendChild(messageContent);
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function highlightCode(code, language) {
  const codeElement = document.createElement("pre");
  const codeBlock = document.createElement("code");

  codeBlock.classList.add(`language-${language}`);
  codeBlock.textContent = code;

  codeElement.appendChild(codeBlock);
  return codeElement;
}

function highlightNewCode() {
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = promptInput.value.trim();
  if (!userInput) return;

  const instruction = stackInstructions[selectedStack] || "";
  const finalPrompt = `${instruction}\n${userInput}`;

  addMessage(userInput, "user");
  promptInput.value = "";

  try {
    const res = await fetch(`http://localhost:11434/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5-coder:0.5b",
        messages: [{ role: "user", content: finalPrompt }],
      }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (aiContent) {
      const isGeneral = selectedStack === "";
      if (isGeneral) {
        addMessage(aiContent, "ai");
      } else {
        const extractedCode = extractCodeFromMarkdown(aiContent);
        if (extractedCode) {
          const escaped = escapeHtml(extractedCode);
          const language = selectedStack === "mern" ? "javascript" : "php";
          const highlightedCode = highlightCode(escaped, language);
          addMessage(highlightedCode.outerHTML, "ai", true);
        } else {
          addMessage(aiContent, "ai");
        }
      }
    } else {
      addMessage("Error: No message content received", "ai");
    }
  } catch (err) {
    console.error(err);
    addMessage("Error: Something went wrong", "ai");
  }
});
