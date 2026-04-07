/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// 1. Replace this with your actual Cloudflare Worker URL
const WORKER_URL = "https://square-sky-7c95.wilkinsonmp.workers.dev";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  // Prevent the page from refreshing when the form is submitted
  e.preventDefault();

  // Get what the user typed
  const userText = userInput.value;

  // Clear the input field for the next message
  userInput.value = "";

  // 2. Add the user's message to the chat window using a template literal
  chatWindow.innerHTML += `
    <div class="msg user">
      <strong>You:</strong> ${userText}
    </div>
  `;

  // Scroll to the bottom so we see the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Show a loading message
  const loadingMsg = document.createElement("div");
  loadingMsg.className = "msg ai";
  loadingMsg.textContent = "AI is thinking...";
  chatWindow.appendChild(loadingMsg);

  try {
    // 3. Make the request to your Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // We send the 'messages' array that the Worker expects
      body: JSON.stringify({
        messages: [{ role: "user", content: userText }],
      }),
    });

    // 4. Parse the response from the Worker
    const data = await response.json();

    // Remove the "thinking" message
    chatWindow.removeChild(loadingMsg);

    // 5. Get the text from the OpenAI response structure
    const aiText = data.choices[0].message.content;

    // Add the AI response to the chat window
    chatWindow.innerHTML += `
      <div class="msg ai">
        <strong>AI:</strong> ${aiText}
      </div>
    `;

    // Scroll again to show the AI response
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (error) {
    console.error("Error:", error);
    loadingMsg.textContent = "Error: Could not connect to the AI.";
  }
});
