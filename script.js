const chatToggler = document.getElementById("chatbot-toggler");
const closeChatbot = document.getElementById("close-chatbot");
const chatbotScreen = document.querySelector(".chatbot-screen");
const landingScreen = document.querySelector(".landing-screen");
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.getElementById("send-message");

const API_KEY = "AIzaSyB-ObHAH7t5M9iYrV3McZ-TN_LBeBtvNYo";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const chatHistory = [];

const createMessageElement = (text, className) => {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  return div;
};

const generateBotResponse = async (text) => {
  chatHistory.push({ role: "user", parts: [{ text }] });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: chatHistory }),
  });

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond.";
  chatHistory.push({ role: "model", parts: [{ text: reply }] });
  console.log("Bot reply:", reply);
  
  parseMarkdown(reply); 
  console.log("Parsed reply:", reply);
  
  chatBody.scrollTop = chatBody.scrollHeight;
};

const sendMessageHandler = (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const userMsg = createMessageElement(text, "user-message");
  chatBody.appendChild(userMsg);
  messageInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  generateBotResponse(text);
};

chatToggler.addEventListener("click", () => {
  chatbotScreen.classList.add("show");
  landingScreen.style.display = "none";
});

closeChatbot.addEventListener("click", () => {
  chatbotScreen.classList.remove("show");
  landingScreen.style.display = "flex";
});

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    sendMessageHandler(e);
  }
});

sendMessage.addEventListener("click", sendMessageHandler);

const parseMarkdown = (markdownText) => {
  const html = marked.parse(markdownText);
  const div = document.createElement("div");
  div.className = "message bot-message";
  div.innerHTML = html;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
};


