// Replace with your actual API keys and credentials
const firebaseConfig = {
      apiKey: "AIzaSyAob-IJWewda_XEEqhTjp8aZtwQ3e4ymz8",
      authDomain: "my-audio-emailer.firebaseapp.com",
      projectId: "my-audio-emailer",
      storageBucket: "my-audio-emailer.appspot.com",
      messagingSenderId: "801207008698",
      appId: "1:801207008698:web:649ddd92c31df7798bb183"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

const inputText = document.getElementById("input-text");
const speakButton = document.getElementById("speak-button");

speakButton.addEventListener("click", async () => {
  const text = inputText.value;
  if (!text) return;

  const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyB-q__QKEut_BBcX3YmaPjynkZscWDqt4Y", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        text: text,
      },
      voice: {
        languageCode: "en-US",
        name: "en-US-Wavenet-A",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    }),
  });

  if (!response.ok) {
    console.error("Error synthesizing speech");
    return;
  }

  const data = await response.json();
  const audioBlob = new Blob([new Uint8Array(data.audioContent).buffer], { type: "audio/mpeg" });

  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();

  // Save the text to Firestore
  await db.collection("spokenTexts").add({
    text: text,
    timestamp: firebase.firestore.Timestamp.now(),
  });
});