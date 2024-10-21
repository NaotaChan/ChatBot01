let apiKey;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        apiKey = data.API_KEY;
    })
    .catch(error => {
        console.error("Errore nel caricamento della chiave API:", error);
    });



document.getElementById("send-button").addEventListener("click", () => {
    console.log("Pulsante Invia cliccato"); // Debug
    const userInput = document.getElementById("chat-input").value;
    if (userInput) {
        console.log("Messaggio utente:", userInput); // Debug
        updateChatOutput("Utente", userInput);
        document.getElementById("chat-input").value = "";
        getAIResponse(userInput);
    } else {
        console.log("Nessun input da inviare"); // Debug
    }
});

document.getElementById("voice-button").addEventListener("click", () => {
    console.log("Pulsante Parla cliccato"); // Debug
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "it-IT";
    recognition.onresult = function(event) {
        const voiceInput = event.results[0][0].transcript;
        console.log("Input vocale:", voiceInput); // Debug
        updateChatOutput("Utente", voiceInput);
        getAIResponse(voiceInput);
    };
    recognition.start();
});

function updateChatOutput(sender, message) {
    console.log(`Aggiorna output chat: ${sender} - ${message}`); // Debug
    const chatOutput = document.getElementById("chat-output");
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatOutput.appendChild(newMessage);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function getAIResponse(message) {
    console.log("Invio richiesta API con messaggio:", message); // Debug
    axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 150
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => {
        console.log("Risposta API ricevuta", response); // Debug
        const aiResponse = response.data.choices[0].message.content.trim();
        updateChatOutput("Assistente", aiResponse);
        speak(aiResponse);
    })
    .catch(error => {
        console.error("Errore nella risposta AI:", error);
        updateChatOutput("Assistente", "C'è stato un errore durante la richiesta. Verifica la tua connessione e riprova.");
    });
}

function speak(text) {
    console.log("Sintesi vocale:", text); // Debug
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    window.speechSynthesis.speak(utterance);
}
