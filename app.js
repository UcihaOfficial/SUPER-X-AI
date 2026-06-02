const API_KEY = "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";

let messages = [
{
role:"system",
content:"Kamu adalah SUPER X AI."
}
];

function addMessage(text,type){

const chat=document.getElementById("chat");

const div=document.createElement("div");

div.className=`message ${type}`;
div.textContent=text;

chat.appendChild(div);

chat.scrollTop=chat.scrollHeight;
}

function newChat(){

messages=[
{
role:"system",
content:"Kamu adalah SUPER X AI."
}
];

document.getElementById("chat").innerHTML=`
<div class="welcome">
<h1>NUXX AI</h1>
<p>Tanyakan apa saja...</p>
</div>
`;
}

async function sendMessage(){

const input=document.getElementById("message");

const text=input.value.trim();

if(!text) return;

const welcome=document.querySelector(".welcome");

if(welcome) welcome.remove();

addMessage(text,"user");

messages.push({
role:"user",
content:text
});

input.value="";

const typing=document.createElement("div");

typing.className="message ai";

typing.innerHTML=`
<div class="typing">
<span></span>
<span></span>
<span></span>
</div>
`;

document.getElementById("chat").appendChild(typing);

try{

const response=await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${API_KEY}`
},
body:JSON.stringify({
model: "llama-3.3-70b-versatile",
messages:messages,
temperature:0.7
})
}
);

const data=await response.json();

typing.remove();

if(!response.ok){
addMessage(
data.error?.message || "Request gagal",
"ai"
);
return;
}

const reply=
data.choices[0].message.content;

addMessage(reply,"ai");

messages.push({
role:"assistant",
content:reply
});

}catch(err){

typing.remove();

addMessage(
"Error: "+err.message,
"ai"
);

console.error(err);
}
}
