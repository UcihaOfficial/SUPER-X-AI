const API_KEY = "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";

let messages = [
{
role: "system",
content: "Kamu adalah SUPER X AI, asisten AI modern yang membantu pengguna."
}
];

const chat = document.getElementById("chat");
const input = document.getElementById("message");

function addMessage(text, type){

const div = document.createElement("div");

div.className = "message ${type}";

div.innerHTML = text
.replace(/</g,"<")
.replace(/>/g,">")
.replace(/\n/g,"<br>");

chat.appendChild(div);

chat.scrollTop = chat.scrollHeight;

}

function showTyping(){

const div = document.createElement("div");

div.className = "message ai";
div.id = "typing";

div.innerHTML = `

<div class="typing">
<span></span>
<span></span>
<span></span>
</div>
`;chat.appendChild(div);

chat.scrollTop = chat.scrollHeight;

}

function removeTyping(){

const typing = document.getElementById("typing");

if(typing){
typing.remove();
}

}

async function sendMessage(){

const text = input.value.trim();

if(!text) return;

document.querySelector(".welcome")?.remove();

addMessage(text,"user");

messages.push({
role:"user",
content:text
});

input.value = "";

showTyping();

try{

const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1024,
      messages
    })
  }
);

const data = await response.json();

removeTyping();

const reply =
  data?.choices?.[0]?.message?.content;

if (!reply) {
  throw new Error(
    JSON.stringify(data)
  );
}

addMessage(reply, "ai");

messages.push({
role:"assistant",
content:reply
});

saveHistory();

}
catch(err){

removeTyping();

addMessage(
"Terjadi kesalahan: " + err.message,
"ai"
);

}

}

function quickPrompt(text){

input.value = text;

sendMessage();

}

function newChat(){

messages = [
{
role:"system",
content:"Kamu adalah SUPER X AI."
}
];

chat.innerHTML = `

<div class="welcome"><div class="welcome-icon">
✦
</div><h1>
Welcome to SUPER X AI
</h1><p>
Ask anything. Generate ideas,
code, articles and more.
</p></div>
`;localStorage.removeItem("nuxx-history");

}

function saveHistory(){

localStorage.setItem(
"nuxx-history",
JSON.stringify(messages)
);

}

function loadHistory(){

const saved =
localStorage.getItem("nuxx-history");

if(!saved) return;

messages = JSON.parse(saved);

const systemRemoved =
messages.filter(
m => m.role !== "system"
);

if(systemRemoved.length){

document.querySelector(".welcome")?.remove();

systemRemoved.forEach(msg => {

addMessage(
msg.content,
msg.role === "user"
? "user"
: "ai"
);

});

}

}

input.addEventListener(
"keydown",
function(e){

if(
e.key === "Enter" &&
!e.shiftKey
){

e.preventDefault();

sendMessage();

}

}
);

loadHistory();